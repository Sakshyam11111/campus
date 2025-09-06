import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Camera, Calendar, Users, Heart, MessageCircle, Share2, Send, X, Trash2, Reply } from 'lucide-react';
import { db, storage } from './Firebase';
import { collection, addDoc, updateDoc, doc, onSnapshot, query, orderBy, serverTimestamp, arrayUnion, arrayRemove, increment, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const SocialFeed = ({ user }) => {
  const [posts, setPosts] = useState([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [commentInputs, setCommentInputs] = useState({});
  const [replyInputs, setReplyInputs] = useState({});
  const [showCommentInput, setShowCommentInput] = useState({});
  const [showReplyInput, setShowReplyInput] = useState({});
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [likedComments, setLikedComments] = useState(new Set());
  const [likedReplies, setLikedReplies] = useState(new Set());
  const [expandedPosts, setExpandedPosts] = useState(new Set());
  const [imagePreview, setImagePreview] = useState('');
  const [showImageInput, setShowImageInput] = useState(false);
  const [postType, setPostType] = useState('general');
  const [isPosting, setIsPosting] = useState(false);
  const [error, setError] = useState('');
  const [shareMessage, setShareMessage] = useState(''); // New state for share feedback

  // Character limits
  const POST_CHAR_LIMIT = 500;
  const COMMENT_CHAR_LIMIT = 200;

  // Fetch posts from Firestore and reset liked states
  useEffect(() => {
    setLikedPosts(new Set());
    setLikedComments(new Set());
    setLikedReplies(new Set());
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPosts(postsData);
      console.log('Fetched posts:', postsData);
    }, (error) => {
      console.error('Error fetching posts:', error);
      setError(`Failed to load posts: ${error.message}`);
      setTimeout(() => setError(''), 3000);
    });
    return () => unsubscribe();
  }, []);

  // Memoized post sorting
  const sortedPosts = useMemo(() => posts, [posts]);

  // Handle image selection
  const handleImageSelect = useCallback((event) => {
    const file = event.target.files[0];
    if (!file) {
      console.log('No image selected');
      setError('Please select an image.');
      setTimeout(() => setError(''), 3000);
      return;
    }
    if (!file.type.startsWith('image/')) {
      console.log('Invalid file type:', file.type);
      setError('Please select a valid image file (e.g., JPG, PNG).');
      setTimeout(() => setError(''), 3000);
      return;
    }
    setSelectedImage(file);
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result);
    reader.onerror = () => {
      console.error('Error reading image file');
      setError('Failed to read image file.');
      setTimeout(() => setError(''), 3000);
    };
    reader.readAsDataURL(file);
    console.log('Image selected:', file.name, file.type, file.size);
  }, []);

  // Handle post creation
  const handlePost = useCallback(async () => {
    if (!newPostContent.trim() || !user || isPosting) {
      console.log('Post aborted:', { newPostContent, user, isPosting });
      setError('Please enter content and ensure you are logged in.');
      setTimeout(() => setError(''), 3000);
      return;
    }

    setIsPosting(true);
    console.log('Attempting to post:', { content: newPostContent, user, postType });

    try {
      let imageUrl = '';
      if (selectedImage) {
        console.log('Uploading image:', selectedImage.name, selectedImage.size, selectedImage.type);
        const sanitizedFileName = selectedImage.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const imageRef = ref(storage, `images/${Date.now()}_${sanitizedFileName}`);
        try {
          const snapshot = await uploadBytes(imageRef, selectedImage);
          console.log('Upload snapshot received:', snapshot);
          imageUrl = await getDownloadURL(snapshot.ref);
          console.log('Image URL retrieved:', imageUrl);
        } catch (uploadError) {
          console.error('Image upload failed:', {
            message: uploadError.message,
            code: uploadError.code,
          });
          throw new Error(`Failed to upload image: ${uploadError.message}`);
        }
      }

      const newPost = {
        user: {
          name: user.username || 'Anonymous',
          avatar: (user.username || 'U')[0].toUpperCase(),
          year: user.year || 'Student',
          major: user.major || '',
          uid: user.uid || '',
        },
        content: newPostContent.trim(),
        timestamp: new Date().toLocaleString(),
        createdAt: serverTimestamp(),
        likes: 0,
        likedBy: [],
        comments: [],
        type: postType,
        ...(imageUrl && { imageUrl }),
      };

      console.log('New post data:', newPost);
      const docRef = await addDoc(collection(db, 'posts'), newPost);
      console.log('Post created with ID:', docRef.id);

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
      });
      setError(`Failed to create post: ${error.message}`);
      setTimeout(() => setError(''), 3000);
    } finally {
      setIsPosting(false);
    }
  }, [newPostContent, user, selectedImage, postType, isPosting]);

  // Handle liking a post
  const handleLikePost = useCallback(async (postId) => {
    if (!user) {
      console.log('Like aborted: User not logged in');
      setError('Please log in to like posts.');
      setTimeout(() => setError(''), 3000);
      return;
    }

    const post = posts.find(p => p.id === postId);
    if (!post) {
      console.log('Like aborted: Post not found', postId);
      setError('Post not found.');
      setTimeout(() => setError(''), 3000);
      return;
    }

    const isLiked = post.likedBy?.includes(user.uid);
    const newLikedPosts = new Set(likedPosts);

    try {
      const postRef = doc(db, 'posts', postId);
      if (isLiked) {
        await updateDoc(postRef, {
          likes: increment(-1),
          likedBy: arrayRemove(user.uid),
        });
        newLikedPosts.delete(postId);
        console.log(`Post ${postId} unliked by user ${user.uid}`);
      } else {
        await updateDoc(postRef, {
          likes: increment(1),
          likedBy: arrayUnion(user.uid),
        });
        newLikedPosts.add(postId);
        console.log(`Post ${postId} liked by user ${user.uid}`);
      }
      setLikedPosts(newLikedPosts);
    } catch (error) {
      console.error('Error updating post likes:', {
        message: error.message,
        code: error.code,
        stack: error.stack,
      });
      setError(`Failed to update like: ${error.message}`);
      setTimeout(() => setError(''), 3000);
    }
  }, [likedPosts, user, posts]);

  // Handle liking a comment
  const handleLikeComment = useCallback(async (postId, commentId) => {
    if (!user) {
      console.log('Comment like aborted: User not logged in');
      setError('Please log in to like comments.');
      setTimeout(() => setError(''), 3000);
      return;
    }

    const post = posts.find(p => p.id === postId);
    if (!post) {
      console.log('Comment like aborted: Post not found', postId);
      setError('Post not found.');
      setTimeout(() => setError(''), 3000);
      return;
    }

    const comment = post.comments.find(c => c.id === commentId);
    if (!comment) {
      console.log('Comment like aborted: Comment not found', commentId);
      setError('Comment not found.');
      setTimeout(() => setError(''), 3000);
      return;
    }

    const isLiked = comment.likedBy?.includes(user.uid);
    const newLikedComments = new Set(likedComments);

    try {
      const postRef = doc(db, 'posts', postId);
      const updatedComments = post.comments.map(c => {
        if (c.id === commentId) {
          return {
            ...c,
            likes: isLiked ? (c.likes || 0) - 1 : (c.likes || 0) + 1,
            likedBy: isLiked ? (c.likedBy || []).filter(uid => uid !== user.uid) : [...(c.likedBy || []), user.uid],
          };
        }
        return c;
      });

      await updateDoc(postRef, { comments: updatedComments });
      if (isLiked) {
        newLikedComments.delete(`${postId}-${commentId}`);
        console.log(`Comment ${commentId} on post ${postId} unliked by user ${user.uid}`);
      } else {
        newLikedComments.add(`${postId}-${commentId}`);
        console.log(`Comment ${commentId} on post ${postId} liked by user ${user.uid}`);
      }
      setLikedComments(newLikedComments);
    } catch (error) {
      console.error('Error updating comment likes:', {
        message: error.message,
        code: error.code,
        stack: error.stack,
      });
      setError(`Failed to update comment like: ${error.message}`);
      setTimeout(() => setError(''), 3000);
    }
  }, [likedComments, user, posts]);

  // Handle liking a reply
  const handleLikeReply = useCallback(async (postId, commentId, replyId) => {
    if (!user) {
      console.log('Reply like aborted: User not logged in');
      setError('Please log in to like replies.');
      setTimeout(() => setError(''), 3000);
      return;
    }

    const post = posts.find(p => p.id === postId);
    if (!post) {
      console.log('Reply like aborted: Post not found', postId);
      setError('Post not found.');
      setTimeout(() => setError(''), 3000);
      return;
    }

    const comment = post.comments.find(c => c.id === commentId);
    if (!comment) {
      console.log('Reply like aborted: Comment not found', commentId);
      setError('Comment not found.');
      setTimeout(() => setError(''), 3000);
      return;
    }

    const reply = comment.replies?.find(r => r.id === replyId);
    if (!reply) {
      console.log('Reply like aborted: Reply not found', replyId);
      setError('Reply not found.');
      setTimeout(() => setError(''), 3000);
      return;
    }

    const isLiked = reply.likedBy?.includes(user.uid);
    const newLikedReplies = new Set(likedReplies);

    try {
      const postRef = doc(db, 'posts', postId);
      const updatedComments = post.comments.map(c => {
        if (c.id === commentId) {
          return {
            ...c,
            replies: (c.replies || []).map(r => {
              if (r.id === replyId) {
                return {
                  ...r,
                  likes: isLiked ? (r.likes || 0) - 1 : (r.likes || 0) + 1,
                  likedBy: isLiked ? (r.likedBy || []).filter(uid => uid !== user.uid) : [...(r.likedBy || []), user.uid],
                };
              }
              return r;
            }),
          };
        }
        return c;
      });

      await updateDoc(postRef, { comments: updatedComments });
      if (isLiked) {
        newLikedReplies.delete(`${postId}-${commentId}-${replyId}`);
        console.log(`Reply ${replyId} on comment ${commentId} on post ${postId} unliked by user ${user.uid}`);
      } else {
        newLikedReplies.add(`${postId}-${commentId}-${replyId}`);
        console.log(`Reply ${replyId} on comment ${commentId} on post ${postId} liked by user ${user.uid}`);
      }
      setLikedReplies(newLikedReplies);
    } catch (error) {
      console.error('Error updating reply likes:', {
        message: error.message,
        code: error.code,
        stack: error.stack,
      });
      setError(`Failed to update reply like: ${error.message}`);
      setTimeout(() => setError(''), 3000);
    }
  }, [likedReplies, user, posts]);

  // Handle deleting a post
  const handleDeletePost = useCallback(async (postId) => {
    if (!user) {
      console.log('Delete aborted: User not logged in');
      setError('Please log in to delete posts.');
      setTimeout(() => setError(''), 3000);
      return;
    }

    try {
      const postRef = doc(db, 'posts', postId);
      await deleteDoc(postRef);
      console.log(`Post ${postId} deleted successfully`);
    } catch (error) {
      console.error('Error deleting post:', {
        message: error.message,
        code: error.code,
        stack: error.stack,
      });
      setError(`Failed to delete post: ${error.message}`);
      setTimeout(() => setError(''), 3000);
    }
  }, [user]);

  // Handle adding a comment
  const handleAddComment = useCallback(async (postId) => {
    if (!user) {
      console.log('Comment aborted: User not logged in');
      setError('Please log in to comment.');
      setTimeout(() => setError(''), 3000);
      return;
    }

    const commentContent = commentInputs[postId]?.trim();
    if (!commentContent) {
      console.log('Comment aborted: Empty comment');
      setError('Please enter a comment.');
      setTimeout(() => setError(''), 3000);
      return;
    }

    const post = posts.find(p => p.id === postId);
    if (!post) {
      console.log('Comment aborted: Post not found', postId);
      setError('Post not found.');
      setTimeout(() => setError(''), 3000);
      return;
    }

    try {
      const postRef = doc(db, 'posts', postId);
      const newComment = {
        id: Date.now() + Math.random(),
        user: {
          name: user.username || 'Anonymous',
          avatar: (user.username || 'U')[0].toUpperCase(),
          uid: user.uid || '',
        },
        content: commentContent.slice(0, COMMENT_CHAR_LIMIT),
        timestamp: new Date().toLocaleString(),
        likes: 0,
        likedBy: [],
        replies: [],
      };

      console.log('Adding comment to post:', { postId, comment: newComment });
      await updateDoc(postRef, {
        comments: arrayUnion(newComment),
      });

      setCommentInputs(prev => ({ ...prev, [postId]: '' }));
      setShowCommentInput(prev => ({ ...prev, [postId]: false }));
      console.log('Comment added successfully:', newComment);
    } catch (error) {
      console.error('Error adding comment:', {
        message: error.message,
        code: error.code,
        stack: error.stack,
      });
      setError(`Failed to add comment: ${error.message}`);
      setTimeout(() => setError(''), 3000);
    }
  }, [commentInputs, user, posts]);

  // Handle adding a reply
  const handleAddReply = useCallback(async (postId, commentId) => {
    if (!user) {
      console.log('Reply aborted: User not logged in');
      setError('Please log in to reply.');
      setTimeout(() => setError(''), 3000);
      return;
    }

    const replyContent = replyInputs[`${postId}-${commentId}`]?.trim();
    if (!replyContent) {
      console.log('Reply aborted: Empty reply');
      setError('Please enter a reply.');
      setTimeout(() => setError(''), 3000);
      return;
    }

    const post = posts.find(p => p.id === postId);
    if (!post) {
      console.log('Reply aborted: Post not found', postId);
      setError('Post not found.');
      setTimeout(() => setError(''), 3000);
      return;
    }

    const comment = post.comments.find(c => c.id === commentId);
    if (!comment) {
      console.log('Reply aborted: Comment not found', commentId);
      setError('Comment not found.');
      setTimeout(() => setError(''), 3000);
      return;
    }

    try {
      const postRef = doc(db, 'posts', postId);
      const newReply = {
        id: Date.now() + Math.random(),
        user: {
          name: user.username || 'Anonymous',
          avatar: (user.username || 'U')[0].toUpperCase(),
          uid: user.uid || '',
        },
        content: replyContent.slice(0, COMMENT_CHAR_LIMIT),
        timestamp: new Date().toLocaleString(),
        likes: 0,
        likedBy: [],
      };

      const updatedComments = post.comments.map(c => {
        if (c.id === commentId) {
          return {
            ...c,
            replies: [...(c.replies || []), newReply],
          };
        }
        return c;
      });

      console.log('Adding reply to comment:', { postId, commentId, reply: newReply });
      await updateDoc(postRef, { comments: updatedComments });

      setReplyInputs(prev => ({ ...prev, [`${postId}-${commentId}`]: '' }));
      setShowReplyInput(prev => ({ ...prev, [`${postId}-${commentId}`]: false }));
      console.log('Reply added successfully:', newReply);
    } catch (error) {
      console.error('Error adding reply:', {
        message: error.message,
        code: error.code,
        stack: error.stack,
      });
      setError(`Failed to add reply: ${error.message}`);
      setTimeout(() => setError(''), 3000);
    }
  }, [replyInputs, user, posts]);

  // Handle sharing a post
  const handleSharePost = useCallback(async (postId) => {
    if (!user) {
      console.log('Share aborted: User not logged in');
      setError('Please log in to share posts.');
      setTimeout(() => setError(''), 3000);
      return;
    }

    const post = posts.find(p => p.id === postId);
    if (!post) {
      console.log('Share aborted: Post not found', postId);
      setError('Post not found.');
      setTimeout(() => setError(''), 3000);
      return;
    }

    // Generate a shareable URL (replace with your app's actual domain)
    const shareUrl = `${window.location.origin}/post/${postId}`;
    const shareData = {
      title: `Post by ${post.user.name}`,
      text: post.content.length > 100 ? `${post.content.slice(0, 100)}...` : post.content,
      url: shareUrl,
    };

    // Add image URL if available
    if (post.imageUrl) {
      shareData.files = [
        new File(
          [await (await fetch(post.imageUrl)).blob()],
          `post-${postId}-image.jpg`,
          { type: 'image/jpeg' }
        )
      ];
    }

    try {
      // Try Web Share API
      if (navigator.share && (navigator.canShare?.(shareData) ?? true)) {
        await navigator.share(shareData);
        console.log(`Post ${postId} shared via Web Share API`);
        setShareMessage('Post shared successfully!');
        setTimeout(() => setShareMessage(''), 3000);
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(shareUrl);
        console.log(`Post ${postId} URL copied to clipboard: ${shareUrl}`);
        setShareMessage('Link copied to clipboard!');
        setTimeout(() => setShareMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error sharing post:', {
        message: error.message,
        code: error.code,
        stack: error.stack,
      });
      setError(`Failed to share post: ${error.message}`);
      setTimeout(() => setError(''), 3000);
    }
  }, [user, posts]);

  // Toggle comment input visibility
  const toggleCommentInput = useCallback((postId) => {
    setShowCommentInput(prev => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  }, []);

  // Toggle reply input visibility
  const toggleReplyInput = useCallback((postId, commentId) => {
    setShowReplyInput(prev => ({
      ...prev,
      [`${postId}-${commentId}`]: !prev[`${postId}-${commentId}`],
    }));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm sm:text-base animate-pulse">
            {error}
          </div>
        )}
        {shareMessage && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-sm sm:text-base animate-pulse">
            {shareMessage}
          </div>
        )}
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-8 border border-gray-100">
          <div className="flex items-start space-x-3 sm:space-x-4">
            <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0 bg-gradient-to-r from-orange-400 to-red-500">
              {user ? user.username[0].toUpperCase() : 'U'}
            </div>
            <div className="flex-1">
              <textarea
                placeholder="What's on your mind?"
                className="w-full p-3 border rounded-2xl focus:outline-none focus:ring-2 resize-none border-gray-200 focus:ring-blue-500 bg-white text-gray-900 text-sm sm:text-base"
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value.slice(0, POST_CHAR_LIMIT))}
                rows={3}
                disabled={isPosting || !user}
              />
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-3 gap-3">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <button
                    onClick={() => setShowImageInput(!showImageInput)}
                    className="text-gray-600 hover:text-blue-500 flex items-center space-x-1 transition-colors text-sm sm:text-base"
                    disabled={isPosting || !user}
                  >
                    <Camera size={20} />
                    <span>Photo</span>
                  </button>
                  <select
                    value={postType}
                    onChange={(e) => setPostType(e.target.value)}
                    className="text-sm border rounded-lg p-1 border-gray-200 bg-white text-gray-900"
                    disabled={isPosting || !user}
                  >
                    <option value="general">General</option>
                    <option value="event">Event</option>
                    <option value="group">Group</option>
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">
                    {newPostContent.length}/{POST_CHAR_LIMIT}
                  </span>
                  <button
                    onClick={handlePost}
                    className={`px-4 py-2 rounded-lg transition-all bg-gradient-to-r from-orange-400 to-red-500 text-white hover:opacity-90 text-sm sm:text-base ${isPosting || !newPostContent.trim() || !user ? 'opacity-50 cursor-not-allowed' : 'transform hover:scale-105'}`}
                    disabled={isPosting || !newPostContent.trim() || !user}
                  >
                    {isPosting ? 'Posting...' : 'Post'}
                  </button>
                </div>
              </div>
              {showImageInput && (
                <div className="mt-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="text-sm text-gray-500"
                    disabled={isPosting || !user}
                  />
                  {imagePreview && (
                    <div className="mt-2 relative">
                      <img src={imagePreview} alt="Preview" className="max-w-full h-auto rounded-lg" />
                      <button
                        onClick={() => {
                          setSelectedImage(null);
                          setImagePreview('');
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
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
        {sortedPosts.length > 0 ? (
          sortedPosts.map(post => (
            <article key={post.id} className="bg-white border-gray-100 rounded-2xl shadow-lg p-4 sm:p-6 mb-6 border">
              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0 bg-gradient-to-r from-orange-400 to-red-500">
                  {post.user.avatar}
                </div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center space-x-2">
                      <p className="font-medium text-gray-900 text-sm sm:text-base">
                        {post.user.name}
                      </p>
                      <span className="text-gray-400 text-xs">•</span>
                      <p className="text-sm text-gray-500">
                        {post.user.year}, {post.user.major}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                      <time className="text-sm text-gray-400">
                        {post.timestamp}
                      </time>
                      {user && user.uid === post.user.uid && (
                        <button
                          onClick={() => handleDeletePost(post.id)}
                          className="text-gray-500 hover:text-red-500 transition-colors"
                          title="Delete post"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="mt-2">
                    {post.type === 'event' && <Calendar className="inline-block mr-2 text-blue-500" size={16} />}
                    {post.type === 'group' && <Users className="inline-block mr-2 text-green-500" size={16} />}
                    <p className={`text-sm sm:text-base text-gray-700 ${!expandedPosts.has(post.id) && post.content.length > 200 ? 'line-clamp-3' : ''}`}>
                      {post.content}
                    </p>
                    {post.content.length > 200 && (
                      <button
                        onClick={() => setExpandedPosts(prev => {
                          const newSet = new Set(prev);
                          if (newSet.has(post.id)) newSet.delete(post.id);
                          else newSet.add(post.id);
                          return newSet;
                        })}
                        className="text-sm mt-2 text-blue-500 hover:text-blue-600"
                      >
                        {expandedPosts.has(post.id) ? 'Show less' : 'Show more'}
                      </button>
                    )}
                  </div>
                  {post.imageUrl && (
                    <img src={post.imageUrl} alt="Post" className="mt-3 max-w-full h-auto rounded-lg" />
                  )}
                  <div className="flex items-center space-x-4 sm:space-x-6 mt-4">
                    <button
                      onClick={() => handleLikePost(post.id)}
                      className={`flex items-center space-x-1 ${post.likedBy?.includes(user?.uid) ? 'text-red-500' : 'text-gray-500'} hover:text-red-500 transition-colors text-sm sm:text-base`}
                      disabled={!user}
                    >
                      <Heart size={20} fill={post.likedBy?.includes(user?.uid) ? 'currentColor' : 'none'} />
                      <span>{post.likes || 0}</span>
                    </button>
                    <button
                      onClick={() => toggleCommentInput(post.id)}
                      className="flex items-center space-x-1 text-gray-500 hover:text-blue-500 transition-colors text-sm sm:text-base"
                      disabled={!user}
                    >
                      <MessageCircle size={20} />
                      <span>{post.comments?.length || 0}</span>
                    </button>
                    <button
                      onClick={() => handleSharePost(post.id)}
                      className="flex items-center space-x-1 text-gray-500 hover:text-blue-500 transition-colors text-sm sm:text-base"
                      disabled={!user}
                    >
                      <Share2 size={20} />
                      <span>Share</span>
                    </button>
                  </div>
                  {post.comments?.length > 0 && (
                    <div className="mt-4 space-y-3">
                      {post.comments.map(comment => (
                        <div key={comment.id} className="flex items-start space-x-3">
                          <div className="w-6 sm:w-8 h-6 sm:h-8 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-bold shrink-0 bg-gradient-to-r from-orange-400 to-red-500">
                            {comment.user.avatar}
                          </div>
                          <div className="flex-1">
                            <div className="bg-gray-50 rounded-2xl p-3">
                              <div className="flex items-center space-x-2 mb-1">
                                <p className="text-sm font-medium text-gray-900">{comment.user.name}</p>
                                <span className="text-gray-400 text-xs">•</span>
                                <time className="text-xs text-gray-400">{comment.timestamp}</time>
                              </div>
                              <p className="text-sm text-gray-700">{comment.content}</p>
                              <div className="flex items-center space-x-4 mt-2">
                                <button
                                  onClick={() => handleLikeComment(post.id, comment.id)}
                                  className={`flex items-center space-x-1 ${comment.likedBy?.includes(user?.uid) ? 'text-red-500' : 'text-gray-500'} hover:text-red-500 transition-colors text-sm`}
                                  disabled={!user}
                                >
                                  <Heart size={16} fill={comment.likedBy?.includes(user?.uid) ? 'currentColor' : 'none'} />
                                  <span>{comment.likes || 0}</span>
                                </button>
                                <button
                                  onClick={() => toggleReplyInput(post.id, comment.id)}
                                  className="flex items-center space-x-1 text-gray-500 hover:text-blue-500 transition-colors text-sm"
                                  disabled={!user}
                                >
                                  <Reply size={16} />
                                  <span>Reply</span>
                                </button>
                              </div>
                            </div>
                            {comment.replies?.length > 0 && (
                              <div className="ml-4 sm:ml-6 mt-2 space-y-2">
                                {comment.replies.map(reply => (
                                  <div key={reply.id} className="flex items-start space-x-2 sm:space-x-3">
                                    <div className="w-5 sm:w-6 h-5 sm:h-6 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 bg-gradient-to-r from-orange-400 to-red-500">
                                      {reply.user.avatar}
                                    </div>
                                    <div className="bg-gray-100 rounded-2xl p-2">
                                      <div className="flex items-center space-x-2 mb-1">
                                        <p className="text-xs sm:text-sm font-medium text-gray-900">{reply.user.name}</p>
                                        <span className="text-gray-400 text-xs">•</span>
                                        <time className="text-xs text-gray-400">{reply.timestamp}</time>
                                      </div>
                                      <p className="text-xs sm:text-sm text-gray-700">{reply.content}</p>
                                      <div className="flex items-center space-x-4 mt-1">
                                        <button
                                          onClick={() => handleLikeReply(post.id, comment.id, reply.id)}
                                          className={`flex items-center space-x-1 ${reply.likedBy?.includes(user?.uid) ? 'text-red-500' : 'text-gray-500'} hover:text-red-500 transition-colors text-xs sm:text-sm`}
                                          disabled={!user}
                                        >
                                          <Heart size={14} fill={reply.likedBy?.includes(user?.uid) ? 'currentColor' : 'none'} />
                                          <span>{reply.likes || 0}</span>
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                            {showReplyInput[`${post.id}-${comment.id}`] && (
                              <div className="ml-4 sm:ml-6 mt-2 flex items-center space-x-2 sm:space-x-3">
                                <div className="w-5 sm:w-6 h-5 sm:h-6 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 bg-gradient-to-r from-orange-400 to-red-500">
                                  {user ? user.username[0].toUpperCase() : 'U'}
                                </div>
                                <div className="flex-1 relative">
                                  <input
                                    type="text"
                                    placeholder="Write a reply..."
                                    className="w-full p-2 pr-10 border rounded-2xl focus:outline-none focus:ring-2 transition-all border-gray-200 focus:ring-blue-500 bg-white text-gray-900 text-xs sm:text-sm"
                                    value={replyInputs[`${post.id}-${comment.id}`] || ''}
                                    onChange={(e) => setReplyInputs(prev => ({
                                      ...prev,
                                      [`${post.id}-${comment.id}`]: e.target.value.slice(0, COMMENT_CHAR_LIMIT),
                                    }))}
                                    onKeyPress={(e) => {
                                      if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleAddReply(post.id, comment.id);
                                      }
                                    }}
                                    maxLength={COMMENT_CHAR_LIMIT}
                                  />
                                  <button
                                    onClick={() => handleAddReply(post.id, comment.id)}
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-blue-500 hover:text-blue-600 transition-colors disabled:text-gray-300"
                                    disabled={!replyInputs[`${post.id}-${comment.id}`]?.trim() || !user}
                                  >
                                    <Send size={14} />
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {showCommentInput[post.id] && (
                    <div className="mt-4 flex items-center space-x-3">
                      <div className="w-6 sm:w-8 h-6 sm:h-8 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0 bg-gradient-to-r from-orange-400 to-red-500">
                        {user ? user.username[0].toUpperCase() : 'U'}
                      </div>
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          placeholder="Add a comment..."
                          className="w-full p-2 sm:p-3 pr-10 sm:pr-12 border rounded-2xl focus:outline-none focus:ring-2 transition-all border-gray-200 focus:ring-blue-500 bg-white text-gray-900 text-sm sm:text-base"
                          value={commentInputs[post.id] || ''}
                          onChange={(e) => setCommentInputs(prev => ({
                            ...prev,
                            [post.id]: e.target.value.slice(0, COMMENT_CHAR_LIMIT),
                          }))}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleAddComment(post.id);
                            }
                          }}
                          maxLength={COMMENT_CHAR_LIMIT}
                        />
                        <button
                          onClick={() => handleAddComment(post.id)}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 sm:p-1.5 text-blue-500 hover:text-blue-600 transition-colors disabled:text-gray-300"
                          disabled={!commentInputs[post.id]?.trim() || !user}
                        >
                          <Send size={16} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </article>
          ))
        ) : (
          <div className="bg-white border-gray-100 rounded-2xl p-8 sm:p-12 shadow-lg border text-center">
            <div className="w-12 sm:w-16 h-12 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-gradient-to-r from-orange-100 to-red-100">
              <MessageCircle size={24} className="text-orange-400 sm:text-3xl"/>
            </div>
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
            <p className="mb-4 text-gray-500 text-sm sm:text-base">Be the first to share something with your community!</p>
            {!user && (
              <p className="text-sm text-gray-400">Please log in to create posts.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SocialFeed;