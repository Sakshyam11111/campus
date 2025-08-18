import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { ThemeContext } from './ThemeContext';
import { Camera, Calendar, Users, Heart, MessageCircle, Share2, Send, X, ChevronDown } from 'lucide-react';
import { db, storage } from './Firebase'; // Ensure storage is exported
import { collection, addDoc, updateDoc, doc, onSnapshot, query, orderBy, serverTimestamp, arrayUnion, increment } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const SocialFeed = ({ user }) => {
  const [posts, setPosts] = useState([]);
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
  const { theme } = React.useContext(ThemeContext);

  // Character limit for posts
  const POST_CHAR_LIMIT = 500;
  const COMMENT_CHAR_LIMIT = 200;

  // Fetch posts from Firestore in real-time
  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPosts(postsData);
      console.log('Fetched posts:', postsData); // Debug log
    }, (error) => {
      console.error('Error fetching posts:', error); // Error handling
    });
    return unsubscribe;
  }, []);

  // Memoized post sorting
  const sortedPosts = useMemo(() => posts, [posts]);

  const handlePost = useCallback(async () => {
    if (!newPostContent.trim() || !user || isPosting) {
      console.log('Post aborted:', { newPostContent, user, isPosting }); // Debug log
      return;
    }
    
    setIsPosting(true);
    console.log('Attempting to post:', { content: newPostContent, user, postType }); // Debug log
    
    try {
      let imageUrl = '';
      if (selectedImage) {
        console.log('Uploading image:', selectedImage.name, selectedImage.size, selectedImage.type); // Detailed debug log
        const imageRef = ref(storage, `images/${Date.now()}_${selectedImage.name}`);
        const snapshot = await uploadBytes(imageRef, selectedImage);
        console.log('Upload snapshot received:', snapshot); // Confirm snapshot
        imageUrl = await getDownloadURL(snapshot.ref);
        console.log('Image URL retrieved:', imageUrl); // Confirm URL
      }

      const newPost = {
        user: { 
          name: user.username || 'Anonymous', 
          avatar: (user.username || 'U')[0].toUpperCase(), 
          year: user.year || 'Student', 
          major: user.major || '' 
        },
        content: newPostContent.trim(),
        timestamp: "Just now",
        createdAt: serverTimestamp(),
        likes: 0,
        comments: [],
        type: postType,
        ...(imageUrl && { imageUrl }) // Only include imageUrl if it has a value
      };
      
      console.log('New post data:', newPost); // Debug log
      const docRef = await addDoc(collection(db, 'posts'), newPost);
      console.log('Post created with ID:', docRef.id); // Debug log
      
      setNewPostContent('');
      setSelectedImage(null);
      setImagePreview('');
      setShowImageInput(false);
      setPostType('general');
    } catch (error) {
      console.error('Failed to create post:', {
        message: error.message,
        code: error.code,
        stack: error.stack,
        details: error.details // Additional error details if available
      });
      alert(`Failed to create post: ${error.message}. Check console for details.`);
    } finally {
      setIsPosting(false);
    }
  }, [newPostContent, user, selectedImage, postType, isPosting]);

  const handleImageSelect = useCallback((event) => {
    const file = event.target.files[0];
    if (file) {
      console.log('Selected image details:', file.name, file.size, file.type); // Debug log
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file (e.g., .jpg, .png).');
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

  const handleAddComment = useCallback(async (postId) => {
    const commentText = commentInputs[postId]?.trim();
    if (!commentText || !user) {
      console.log('Comment aborted:', { commentText, user }); // Debug log
      return;
    }

    const newComment = {
      id: Date.now(),
      user: { name: user.username, avatar: user.username[0].toUpperCase() },
      content: commentText,
      timestamp: "Just now",
      createdAt: serverTimestamp()
    };

    try {
      console.log('Attempting to add comment to post:', postId, newComment); // Debug log
      await updateDoc(doc(db, 'posts', postId), {
        comments: arrayUnion(newComment)
      });
      console.log('Comment added to post:', postId); // Debug log
      setCommentInputs(prev => ({ ...prev, [postId]: '' }));
    } catch (error) {
      console.error('Failed to add comment:', {
        message: error.message || 'No message available',
        code: error.code || 'No code available',
        stack: error.stack || 'No stack trace available',
        details: error.details || 'No details available',
        fullError: JSON.stringify(error, null, 2) // Fallback to stringify the entire error
      });
      alert(`Failed to add comment: ${error.message || 'Unknown error'}. Check console for details.`);
    }
  }, [commentInputs, user]);

  const handleLike = useCallback(async (postId, currentLikes, isLiked) => {
    try {
      await updateDoc(doc(db, 'posts', postId), {
        likes: increment(isLiked ? -1 : 1)
      });
      setLikedPosts(prev => {
        const newSet = new Set(prev);
        if (isLiked) {
          newSet.delete(postId);
        } else {
          newSet.add(postId);
        }
        return newSet;
      });
    } catch (error) {
      console.error('Failed to update like:', error);
    }
  }, []);

  const handleShare = useCallback((post) => {
    console.log('Sharing post:', post); // Debug log
    if (navigator.share) {
      navigator.share({
        title: `Post by ${post.user.name}`,
        text: post.content,
        url: window.location.href // Or a specific post URL if available
      }).then(() => console.log('Post shared successfully'))
        .catch((error) => console.error('Share failed:', error));
    } else {
      alert('Sharing is not supported on this browser.');
    }
  }, []);

  const toggleExpand = useCallback((postId) => {
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

  const toggleCommentInput = useCallback((postId) => {
    setShowCommentInput(prev => ({ ...prev, [postId]: !prev[postId] }));
  }, []);

  const postTypes = [
    { value: 'general', label: 'General Post', icon: MessageCircle },
    { value: 'event', label: 'Event', icon: Calendar },
    { value: 'study', label: 'Study Group', icon: Users },
    { value: 'question', label: 'Question', icon: Heart }
  ];

  return (
    <div className={`rounded-2xl shadow-lg overflow-hidden border ${theme === 'colorful' ? 'bg-white border-gray-100' : 'bg-gray-800 border-gray-600'}`}>
      {/* New Post Section */}
      <div className={`p-6 border-b ${theme === 'colorful' ? 'border-gray-100' : 'border-gray-600'}`}>
        <div className="flex items-start space-x-4">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0 ${theme === 'colorful' ? 'bg-gradient-to-r from-orange-500 to-red-600' : 'bg-gray-500'}`}>
            {user ? user.username[0].toUpperCase() : 'U'}
          </div>
          <div className="flex-1 space-y-3">
            <textarea
              placeholder="Share something with your community..."
              className={`w-full p-3 border rounded-2xl resize-none focus:outline-none focus:ring-2 transition-all ${theme === 'colorful' ? 'border-gray-200 focus:ring-blue-500 bg-white text-gray-900' : 'border-gray-600 focus:ring-gray-500 bg-gray-700 text-white'}`}
              rows={3}
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value.slice(0, POST_CHAR_LIMIT))}
              disabled={!user || isPosting}
              maxLength={POST_CHAR_LIMIT}
            />
            <div className="flex flex-wrap gap-2 mb-2">
              {postTypes.map(type => (
                <button
                  key={type.value}
                  onClick={() => setPostType(type.value)}
                  className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium transition-all ${postType === type.value ? (theme === 'colorful' ? 'bg-blue-500 text-white' : 'bg-gray-500 text-white') : (theme === 'colorful' ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' : 'bg-gray-700 text-gray-300 hover:bg-gray-600')}`}
                >
                  <type.icon size={14} />
                  <span>{type.label}</span>
                </button>
              ))}
            </div>
            {showImageInput && (
              <div className="mt-2">
                {imagePreview ? (
                  <div className="relative">
                    <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded-xl" />
                    <button
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 p-1 bg-white rounded-full shadow hover:bg-gray-100"
                    >
                      <X size={16} className="text-gray-600" />
                    </button>
                  </div>
                ) : (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="w-full p-3 border rounded-2xl"
                  />
                )}
              </div>
            )}
            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowImageInput(!showImageInput)}
                  className={`p-2 rounded-full transition-colors ${theme === 'colorful' ? 'hover:bg-gray-100 text-gray-600' : 'hover:bg-gray-700 text-gray-400'}`}
                  aria-label="Add photo"
                >
                  <Camera size={20} />
                </button>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`text-sm ${newPostContent.length > POST_CHAR_LIMIT * 0.8 ? 'text-red-500' : 'text-gray-400'}`}>
                  {newPostContent.length}/{POST_CHAR_LIMIT}
                </span>
                <button
                  onClick={handlePost}
                  disabled={!newPostContent.trim() || !user || isPosting}
                  className={`px-6 py-2 rounded-xl font-medium transition-all transform hover:scale-105 ${theme === 'colorful' ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white hover:opacity-90' : 'bg-gray-600 text-white hover:bg-gray-500'} ${(!newPostContent.trim() || !user || isPosting) ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isPosting ? 'Posting...' : 'Post'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Posts List */}
      <div className="divide-y divide-gray-100 dark:divide-gray-700">
        {sortedPosts.length > 0 ? (
          sortedPosts.map(post => {
            const isLiked = likedPosts.has(post.id);
            const isExpanded = expandedPosts.has(post.id);
            return (
              <article key={post.id} className="p-6 space-y-4">
                <div className="flex items-start space-x-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0 ${theme === 'colorful' ? 'bg-gradient-to-r from-orange-500 to-red-600' : 'bg-gray-500'}`}>
                    {post.user.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <p className={`font-medium ${theme === 'colorful' ? 'text-gray-900' : 'text-white'}`}>{post.user.name}</p>
                      <span className="text-gray-400 text-xs">•</span>
                      <time className={`text-sm ${theme === 'colorful' ? 'text-gray-500' : 'text-gray-400'}`}>{post.timestamp}</time>
                    </div>
                    <p className={`text-xs ${theme === 'colorful' ? 'text-gray-500' : 'text-gray-400'}`}>{post.user.major} • {post.user.year}</p>
                  </div>
                </div>
                <p className={`text-sm ${theme === 'colorful' ? 'text-gray-700' : 'text-gray-300'}`}>{post.content}</p>
                {post.imageUrl && (
                  <img src={post.imageUrl} alt="Post image" className="w-full h-64 object-cover rounded-xl" />
                )}
                <div className="flex items-center space-x-6">
                  <button
                    onClick={() => handleLike(post.id, post.likes, isLiked)}
                    className={`flex items-center space-x-1 ${isLiked ? 'text-red-500' : 'text-gray-400'} hover:text-red-500 transition-colors`}
                  >
                    <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} />
                    <span className="text-sm">{post.likes}</span>
                  </button>
                  <button
                    onClick={() => toggleCommentInput(post.id)}
                    className={`flex items-center space-x-1 text-gray-400 hover:text-blue-500 transition-colors`}
                  >
                    <MessageCircle size={20} />
                    <span className="text-sm">{post.comments.length}</span>
                  </button>
                  <button
                    onClick={() => handleShare(post)}
                    className="flex items-center space-x-1 text-gray-400 hover:text-green-500 transition-colors"
                  >
                    <Share2 size={20} />
                    <span className="text-sm">Share</span>
                  </button>
                </div>
                {post.comments.length > 0 && (
                  <div className="space-y-3 mt-4">
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
    </div>
  );
};

export default SocialFeed;