import React, { useState, useCallback, useMemo } from 'react';
import { Camera, Calendar, Users, Heart, MessageCircle, Share2, Send, X, Smile } from 'lucide-react';

const SocialFeed = ({ posts = [], addPost, user }) => {
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [commentInputs, setCommentInputs] = useState({});
  const [showCommentInput, setShowCommentInput] = useState({});
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [expandedPosts, setExpandedPosts] = useState(new Set());
  const [imagePreview, setImagePreview] = useState('');
  const [showImageInput, setShowImageInput] = useState(false);
  const [postType, setPostType] = useState('general');
  const [isPosting, setIsPosting] = useState(false);

  // Character limit for posts
  const POST_CHAR_LIMIT = 500;
  const COMMENT_CHAR_LIMIT = 200;

  // Memoized post sorting
  const sortedPosts = useMemo(() => {
    return [...posts].sort((a, b) => {
      if (a.timestamp === "Just now" && b.timestamp !== "Just now") return -1;
      if (b.timestamp === "Just now" && a.timestamp !== "Just now") return 1;
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });
  }, [posts]);

  const handlePost = useCallback(async () => {
    if (!newPostContent.trim() || !user || isPosting) return;
    
    setIsPosting(true);
    
    try {
      let imageDataUrl = '';
      if (selectedImage) {
        // Convert image file to data URL
        imageDataUrl = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.readAsDataURL(selectedImage);
        });
      }

      const newPost = {
        id: Date.now(),
        user: { 
          name: user.username, 
          avatar: user.username[0].toUpperCase(), 
          year: user.year || 'Student', 
          major: user.major || '' 
        },
        content: newPostContent.trim(),
        timestamp: "Just now",
        createdAt: new Date().toISOString(),
        likes: 0,
        comments: [],
        type: postType,
        image: !!imageDataUrl,
        imageUrl: imageDataUrl || undefined
      };
      
      await addPost(newPost);
      
      // Reset form
      setNewPostContent('');
      setSelectedImage(null);
      setImagePreview('');
      setShowImageInput(false);
      setPostType('general');
    } catch (error) {
      alert('Failed to create post. Please try again.');
    } finally {
      setIsPosting(false);
    }
  }, [newPostContent, user, selectedImage, postType, addPost, isPosting]);

  const handleImageSelect = useCallback((event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file.');
        return;
      }
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('Image size should be less than 10MB.');
        return;
      }
      
      setSelectedImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleRemoveImage = useCallback(() => {
    setSelectedImage(null);
    setImagePreview('');
    setShowImageInput(false);
  }, []);

  const handleAddComment = useCallback((postId) => {
    const commentText = commentInputs[postId]?.trim();
    if (!commentText || !user) return;

    const newComment = {
      id: Date.now(),
      user: { name: user.username, avatar: user.username[0].toUpperCase() },
      content: commentText,
      timestamp: "Just now",
      createdAt: new Date().toISOString()
    };

    const updatedPosts = posts.map(post => 
      post.id === postId 
        ? { ...post, comments: [...post.comments, newComment] }
        : post
    );
    
    addPost(updatedPosts);
    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
  }, [commentInputs, user, posts, addPost]);

  const handleLike = useCallback((postId) => {
    if (!user) return;

    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        const isCurrentlyLiked = likedPosts.has(postId);
        return {
          ...post,
          likes: isCurrentlyLiked ? post.likes - 1 : post.likes + 1
        };
      }
      return post;
    });
    
    addPost(updatedPosts);
    
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  }, [user, likedPosts, posts, addPost]);

  const handleShare = useCallback(async (postId, content) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Campus Social Post',
          text: content,
          url: `${window.location.origin}/post/${postId}`
        });
      } else {
        const shareUrl = `${window.location.origin}/post/${postId}`;
        await navigator.clipboard.writeText(`${content}\n\n${shareUrl}`);
        alert('Post link copied to clipboard!');
      }
    } catch (error) {
      alert('Failed to share post.');
    }
  }, []);

  const toggleCommentInput = useCallback((postId) => {
    setShowCommentInput(prev => ({ ...prev, [postId]: !prev[postId] }));
  }, []);

  const togglePostExpansion = useCallback((postId) => {
    setExpandedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  }, []);

  const formatContent = useCallback((content, postId, maxLength = 150) => {
    if (content.length <= maxLength || expandedPosts.has(postId)) {
      return content;
    }
    return content.substring(0, maxLength) + '...';
  }, [expandedPosts]);

  const getPostTypeColor = (type) => {
    const colors = {
      celebration: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      study: 'bg-blue-100 text-blue-800 border-blue-200',
      event: 'bg-green-100 text-green-800 border-green-200',
      general: 'bg-purple-100 text-purple-800 border-purple-200'
    };
    return colors[type] || colors.general;
  };

  const remainingChars = POST_CHAR_LIMIT - newPostContent.length;

  const isPostValid = newPostContent.trim() && remainingChars >= 0 && user;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Create Post Section */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white font-bold shrink-0">
            {user ? user.username[0].toUpperCase() : 'U'}
          </div>
          <div className="flex-1 space-y-3">
            <div className="relative">
              <textarea 
                placeholder="Share something with your Texas community..."
                className="w-full p-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none transition-all"
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                rows={3}
                maxLength={POST_CHAR_LIMIT}
              />
              <div className={`absolute bottom-2 right-3 text-xs ${remainingChars < 50 ? 'text-red-500' : 'text-gray-400'}`}>
                {remainingChars}/{POST_CHAR_LIMIT}
              </div>
            </div>
            
            {/* Image Upload Input */}
            {showImageInput && (
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <input 
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                    id="image-upload"
                  />
                  <label 
                    htmlFor="image-upload"
                    className="flex-1 p-3 border-2 border-dashed border-gray-300 rounded-xl hover:border-orange-400 transition-colors cursor-pointer text-center text-gray-500 hover:text-orange-500"
                  >
                    {selectedImage ? (
                      <span className="text-green-600">Image selected: {selectedImage.name}</span>
                    ) : (
                      <span>Click to select an image or drag and drop</span>
                    )}
                  </label>
                  <button 
                    onClick={handleRemoveImage}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
                {imagePreview && (
                  <div className="relative rounded-xl overflow-hidden border border-gray-200">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-full h-32 object-cover"
                    />
                    <button
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-70 transition-all"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Post Type Selector */}
            <div className="flex flex-wrap gap-2">
              {['general', 'study', 'event', 'celebration'].map(type => (
                <button
                  key={type}
                  onClick={() => setPostType(type)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                    postType === type 
                      ? getPostTypeColor(type)
                      : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
          <div className="flex space-x-4">
            <button 
              onClick={() => setShowImageInput(!showImageInput)}
              className={`flex items-center space-x-2 transition-colors ${
                showImageInput ? 'text-orange-500' : 'text-gray-600 hover:text-orange-500'
              }`}
            >
              <Camera size={20} />
              <span>Photo</span>
            </button>
            <button 
              onClick={() => setPostType('event')}
              className="flex items-center space-x-2 text-gray-600 hover:text-green-500 transition-colors"
            >
              <Calendar size={20} />
              <span>Event</span>
            </button>
            <button 
              onClick={() => setPostType('study')}
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 transition-colors"
            >
              <Users size={20} />
              <span>Study</span>
            </button>
          </div>
          <button 
            onClick={handlePost} 
            className={`px-6 py-2 rounded-full font-medium transition-all transform ${
              isPostValid && !isPosting
                ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white hover:shadow-lg hover:scale-105'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
            disabled={!isPostValid || isPosting}
          >
            {isPosting ? 'Posting...' : 'Post'}
          </button>
        </div>
      </div>

      {/* Posts Feed */}
      {sortedPosts.length > 0 ? (
        sortedPosts.map((post) => {
          const isExpanded = expandedPosts.has(post.id);
          const shouldShowExpand = post.content.length > 150;
          
          return (
            <article key={post.id} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-200">
              <header className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold shrink-0">
                  {post.user.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 flex-wrap">
                    <h4 className="font-semibold text-gray-900 truncate">{post.user.name}</h4>
                    <span className="text-orange-500 text-sm">•</span>
                    <span className="text-gray-500 text-sm truncate">{post.user.year} {post.user.major}</span>
                    <span className="text-gray-400 text-sm">•</span>
                    <time className="text-gray-400 text-sm">{post.timestamp}</time>
                  </div>
                  
                  <div className="mt-3">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {formatContent(post.content, post.id)}
                    </p>
                    {shouldShowExpand && (
                      <button
                        onClick={() => togglePostExpansion(post.id)}
                        className="text-orange-500 hover:text-orange-600 text-sm font-medium mt-1 transition-colors"
                      >
                        {isExpanded ? 'Show less' : 'Show more'}
                      </button>
                    )}
                  </div>

                  {post.image && (
                    <div className="mt-4 rounded-xl overflow-hidden border border-gray-200">
                      {post.imageUrl ? (
                        <img
                          src={post.imageUrl}
                          alt="Post content"
                          className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/400x200/f3f4f6/9ca3af?text=Image+Not+Available';
                          }}
                          loading="lazy"
                        />
                      ) : (
                        <div className="h-64 bg-gradient-to-r from-orange-100 to-red-100 flex items-center justify-center">
                          <Camera size={48} className="text-orange-400" />
                        </div>
                      )}
                    </div>
                  )}

                  <footer className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <div className="flex space-x-6">
                      <button 
                        onClick={() => handleLike(post.id)}
                        className={`flex items-center space-x-2 transition-all ${
                          likedPosts.has(post.id) 
                            ? 'text-pink-500 scale-110' 
                            : 'text-gray-500 hover:text-red-500 hover:scale-105'
                        }`}
                        disabled={!user}
                        aria-label={`${likedPosts.has(post.id) ? 'Unlike' : 'Like'} post (${post.likes} likes)`}
                      >
                        <Heart size={20} fill={likedPosts.has(post.id) ? 'currentColor' : 'none'} />
                        <span className="font-medium">{post.likes}</span>
                      </button>
                      
                      <button 
                        onClick={() => toggleCommentInput(post.id)}
                        className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-all hover:scale-105"
                        aria-label={`Comment (${post.comments.length} comments)`}
                      >
                        <MessageCircle size={20} />
                        <span className="font-medium">{post.comments.length}</span>
                      </button>
                      
                      <button 
                        onClick={() => handleShare(post.id, post.content)} 
                        className="flex items-center space-x-2 text-gray-500 hover:text-green-500 transition-all hover:scale-105"
                        aria-label="Share post"
                      >
                        <Share2 size={20} />
                        <span className="font-medium">Share</span>
                      </button>
                    </div>
                    
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPostTypeColor(post.type)}`}>
                      {post.type}
                    </span>
                  </footer>

                  {/* Comments Section */}
                  {post.comments.length > 0 && (
                    <div className="mt-4 space-y-3 pl-2 border-l-2 border-gray-100">
                      {post.comments.map(comment => (
                        <div key={comment.id} className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0">
                            {comment.user.avatar}
                          </div>
                          <div className="flex-1 bg-gray-50 rounded-2xl p-3">
                            <div className="flex items-center space-x-2 mb-1">
                              <p className="text-sm font-medium text-gray-900">{comment.user.name}</p>
                              <span className="text-gray-400 text-xs">•</span>
                              <time className="text-gray-400 text-xs">{comment.timestamp}</time>
                            </div>
                            <p className="text-sm text-gray-700">{comment.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Comment Input */}
                  {showCommentInput[post.id] && (
                    <div className="mt-4 flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0">
                        {user ? user.username[0].toUpperCase() : 'U'}
                      </div>
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          placeholder="Add a comment..."
                          className="w-full p-3 pr-12 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          value={commentInputs[post.id] || ''}
                          onChange={(e) => setCommentInputs(prev => ({ 
                            ...prev, 
                            [post.id]: e.target.value.slice(0, COMMENT_CHAR_LIMIT) 
                          }))}
                          onKeyPress={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                          maxLength={COMMENT_CHAR_LIMIT}
                        />
                        <button
                          onClick={() => handleAddComment(post.id)}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 text-blue-500 hover:text-blue-600 transition-colors disabled:text-gray-300"
                          disabled={!commentInputs[post.id]?.trim() || !user}
                        >
                          <Send size={16} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </header>
            </article>
          );
        })
      ) : (
        <div className="bg-white rounded-2xl p-12 shadow-lg border border-gray-100 text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-orange-100 to-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageCircle size={32} className="text-orange-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
          <p className="text-gray-500 mb-4">Be the first to share something with your community!</p>
          {!user && (
            <p className="text-sm text-gray-400">Please log in to create posts.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SocialFeed;