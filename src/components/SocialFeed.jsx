import React, { useState, useCallback, useMemo, useContext } from 'react';
import { ThemeContext } from './ThemeContext';
import { Camera, Calendar, Users, Heart, MessageCircle, Share2, Send, X, ChevronDown } from 'lucide-react';

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
  const { theme } = useContext(ThemeContext);

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
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file.');
        return;
      }
      
      if (file.size > 10 * 1024 * 1024) {
        alert('Image size should be less than 10MB.');
        return;
      }
      
      setSelectedImage(file);
      
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
    if (theme === 'colorful') {
      switch (type) {
        case 'event':
          return 'border-purple-300 bg-purple-50 text-purple-600';
        case 'study':
          return 'border-blue-300 bg-blue-50 text-blue-600';
        case 'general':
        default:
          return 'border-orange-300 bg-orange-50 text-orange-600';
      }
    } else {
      return 'border-gray-500 bg-gray-700 text-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      {user && (
        <div className={`${theme === 'colorful' ? 'bg-white border-gray-100' : 'bg-gray-800 border-gray-600'} rounded-2xl p-6 shadow-lg border`}>
          <div className="flex items-start space-x-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0 ${theme === 'colorful' ? 'bg-gradient-to-r from-orange-400 to-red-500' : 'bg-gray-500'}`}>
              {user.username[0].toUpperCase()}
            </div>
            <div className="flex-1">
              <textarea
                placeholder="What's on your mind?"
                className={`w-full p-3 border rounded-2xl focus:outline-none focus:ring-2 transition-all resize-none ${theme === 'colorful' ? 'border-gray-200 focus:ring-orange-500 bg-white text-gray-900' : 'border-gray-600 focus:ring-gray-500 bg-gray-700 text-white'}`}
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value.slice(0, POST_CHAR_LIMIT))}
                rows={3}
                maxLength={POST_CHAR_LIMIT}
              />
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setShowImageInput(!showImageInput)}
                    className={`flex items-center space-x-1 ${theme === 'colorful' ? 'text-orange-500 hover:text-orange-600' : 'text-gray-400 hover:text-gray-300'} transition-colors`}
                    disabled={isPosting}
                  >
                    <Camera size={20} />
                    <span className="text-sm">Photo</span>
                  </button>
                  <div className="relative">
                    <select
                      value={postType}
                      onChange={(e) => setPostType(e.target.value)}
                      className={`text-sm pr-8 pl-3 py-1 rounded-full border appearance-none focus:outline-none focus:ring-2 ${theme === 'colorful' ? 'border-gray-200 focus:ring-orange-500 bg-white text-gray-900' : 'border-gray-600 focus:ring-gray-500 bg-gray-700 text-white'}`}
                      disabled={isPosting}
                    >
                      <option value="general">General</option>
                      <option value="event">Event</option>
                      <option value="study">Study</option>
                    </select>
                    <ChevronDown size={16} className={`absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none ${theme === 'colorful' ? 'text-gray-500' : 'text-gray-400'}`} />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`text-sm ${newPostContent.length > POST_CHAR_LIMIT * 0.8 ? 'text-red-500' : theme === 'colorful' ? 'text-gray-500' : 'text-gray-400'}`}>
                    {newPostContent.length}/{POST_CHAR_LIMIT}
                  </span>
                  <button
                    onClick={handlePost}
                    className={`px-4 py-2 rounded-full font-medium transition-all ${theme === 'colorful' ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white hover:opacity-90' : 'bg-gray-500 text-white hover:bg-gray-600'} ${!newPostContent.trim() || isPosting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={!newPostContent.trim() || isPosting}
                  >
                    {isPosting ? 'Posting...' : 'Post'}
                  </button>
                </div>
              </div>

              {showImageInput && (
                <div className="mt-4 space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className={`w-full text-sm ${theme === 'colorful' ? 'text-gray-600' : 'text-gray-400'} file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium ${theme === 'colorful' ? 'file:bg-orange-50 file:text-orange-600 hover:file:bg-orange-100' : 'file:bg-gray-700 file:text-gray-300 hover:file:bg-gray-600'}`}
                  />
                  {imagePreview && (
                    <div className="relative">
                      <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
                      <button
                        onClick={handleRemoveImage}
                        className={`absolute top-2 right-2 p-1 rounded-full ${theme === 'colorful' ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-gray-600 text-white hover:bg-gray-500'} transition-colors`}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {sortedPosts.length > 0 ? (
        sortedPosts.map(post => {
          const isExpanded = expandedPosts.has(post.id);
          return (
            <article key={post.id} className={`${theme === 'colorful' ? 'bg-white border-gray-100' : 'bg-gray-800 border-gray-600'} rounded-2xl p-6 shadow-lg border mb-6`}>
              <header className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold ${theme === 'colorful' ? 'bg-gradient-to-r from-orange-400 to-red-500' : 'bg-gray-500'}`}>
                    {post.user.avatar}
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${theme === 'colorful' ? 'text-gray-900' : 'text-white'}`}>{post.user.name}</p>
                    <div className="flex items-center space-x-2">
                      <time className={`text-xs ${theme === 'colorful' ? 'text-gray-500' : 'text-gray-400'}`}>{post.timestamp}</time>
                      <span className="text-gray-400 text-xs">•</span>
                      <p className={`text-xs ${theme === 'colorful' ? 'text-gray-500' : 'text-gray-400'}`}>
                        {post.user.year} {post.user.major && `• ${post.user.major}`}
                      </p>
                    </div>
                  </div>
                </div>
              </header>

              <div className="mt-4">
                <p className={`text-sm ${theme === 'colorful' ? 'text-gray-700' : 'text-gray-300'}`}>
                  {formatContent(post.content, post.id)}
                  {post.content.length > 150 && (
                    <button
                      onClick={() => togglePostExpansion(post.id)}
                      className={`text-sm ml-2 ${theme === 'colorful' ? 'text-orange-500 hover:text-orange-600' : 'text-gray-400 hover:text-gray-300'} transition-colors`}
                    >
                      {isExpanded ? 'Show less' : 'Show more'}
                    </button>
                  )}
                </p>
                {post.image && post.imageUrl && (
                  <img src={post.imageUrl} alt="Post" className="mt-4 w-full h-64 object-cover rounded-lg" />
                )}
              </div>

              <footer className={`flex items-center justify-between mt-4 pt-4 border-t ${theme === 'colorful' ? 'border-gray-100' : 'border-gray-600'}`}>
                <div className="flex space-x-6">
                  <button 
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center space-x-2 transition-all ${
                      likedPosts.has(post.id) 
                        ? theme === 'colorful' ? 'text-pink-500 scale-110' : 'text-gray-300 scale-110'
                        : theme === 'colorful' ? 'text-gray-500 hover:text-red-500 hover:scale-105' : 'text-gray-400 hover:text-gray-300 hover:scale-105'
                    }`}
                    disabled={!user}
                    aria-label={`${likedPosts.has(post.id) ? 'Unlike' : 'Like'} post (${post.likes} likes)`}
                  >
                    <Heart size={20} fill={likedPosts.has(post.id) ? 'currentColor' : 'none'} />
                    <span className="font-medium">{post.likes}</span>
                  </button>
                  
                  <button 
                    onClick={() => toggleCommentInput(post.id)}
                    className={`flex items-center space-x-2 transition-all ${theme === 'colorful' ? 'text-gray-500 hover:text-blue-500 hover:scale-105' : 'text-gray-400 hover:text-gray-300 hover:scale-105'}`}
                    aria-label={`Comment (${post.comments.length} comments)`}
                  >
                    <MessageCircle size={20} />
                    <span className="font-medium">{post.comments.length}</span>
                  </button>
                  
                  <button 
                    onClick={() => handleShare(post.id, post.content)} 
                    className={`flex items-center space-x-2 transition-all ${theme === 'colorful' ? 'text-gray-500 hover:text-green-500 hover:scale-105' : 'text-gray-400 hover:text-gray-300 hover:scale-105'}`}
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

              {post.comments.length > 0 && (
                <div className={`mt-4 space-y-3 pl-2 border-l-2 ${theme === 'colorful' ? 'border-gray-100' : 'border-gray-600'}`}>
                  {post.comments.map(comment => (
                    <div key={comment.id} className="flex items-start space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0 ${theme === 'colorful' ? 'bg-gradient-to-r from-gray-400 to-gray-600' : 'bg-gray-500'}`}>
                        {comment.user.avatar}
                      </div>
                      <div className={`${theme === 'colorful' ? 'bg-gray-50' : 'bg-gray-700'} rounded-2xl p-3`}>
                        <div className="flex items-center space-x-2 mb-1">
                          <p className={`text-sm font-medium ${theme === 'colorful' ? 'text-gray-900' : 'text-white'}`}>{comment.user.name}</p>
                          <span className="text-gray-400 text-xs">•</span>
                          <time className={`text-xs ${theme === 'colorful' ? 'text-gray-400' : 'text-gray-500'}`}>{comment.timestamp}</time>
                        </div>
                        <p className={`text-sm ${theme === 'colorful' ? 'text-gray-700' : 'text-gray-300'}`}>{comment.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {showCommentInput[post.id] && (
                <div className="mt-4 flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0 ${theme === 'colorful' ? 'bg-gradient-to-r from-orange-400 to-red-500' : 'bg-gray-500'}`}>
                    {user ? user.username[0].toUpperCase() : 'U'}
                  </div>
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      className={`w-full p-3 pr-12 border rounded-2xl focus:outline-none focus:ring-2 transition-all ${theme === 'colorful' ? 'border-gray-200 focus:ring-blue-500 bg-white text-gray-900' : 'border-gray-600 focus:ring-gray-500 bg-gray-700 text-white'}`}
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
                      className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 ${theme === 'colorful' ? 'text-blue-500 hover:text-blue-600' : 'text-gray-400 hover:text-gray-300'} transition-colors disabled:text-gray-300`}
                      disabled={!commentInputs[post.id]?.trim() || !user}
                    >
                      <Send size={16} />
                    </button>
                  </div>
                </div>
              )}
            </article>
          );
        })
      ) : (
        <div className={`${theme === 'colorful' ? 'bg-white border-gray-100' : 'bg-gray-800 border-gray-600'} rounded-2xl p-12 shadow-lg border text-center`}>
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${theme === 'colorful' ? 'bg-gradient-to-r from-orange-100 to-red-100' : 'bg-gray-700'}`}>
            <MessageCircle size={32} className={`${theme === 'colorful' ? 'text-orange-400' : 'text-gray-400'}`} />
          </div>
          <h3 className={`text-lg font-medium ${theme === 'colorful' ? 'text-gray-900' : 'text-white'} mb-2`}>No posts yet</h3>
          <p className={`mb-4 ${theme === 'colorful' ? 'text-gray-500' : 'text-gray-400'}`}>Be the first to share something with your community!</p>
          {!user && (
            <p className={`text-sm ${theme === 'colorful' ? 'text-gray-400' : 'text-gray-500'}`}>Please log in to create posts.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SocialFeed;