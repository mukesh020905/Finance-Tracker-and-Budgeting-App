import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { FaHeart, FaComment, FaPaperPlane, FaUserCircle } from 'react-icons/fa';

const Forum = () => {
    const { currentUser } = useContext(AuthContext);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newPostTitle, setNewPostTitle] = useState('');
    const [newPostContent, setNewPostContent] = useState('');
    const [activeCommentPost, setActiveCommentPost] = useState(null);
    const [comments, setComments] = useState({});
    const [newComment, setNewComment] = useState('');

    const API_URL = 'http://localhost:8080/api/forum';

    useEffect(() => {
        fetchPosts();
    }, [currentUser]);

    const fetchPosts = async () => {
        try {
            const token = currentUser.token;
            const res = await axios.get(`${API_URL}/posts`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPosts(res.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching forum posts', error);
            setLoading(false);
        }
    };

    const handleCreatePost = async (e) => {
        e.preventDefault();
        if (!newPostTitle.trim() || !newPostContent.trim()) return;

        try {
            const token = currentUser.token;
            await axios.post(`${API_URL}/posts`, { title: newPostTitle, content: newPostContent }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNewPostTitle('');
            setNewPostContent('');
            fetchPosts(); // refresh feed
        } catch (error) {
            console.error('Error creating post', error);
        }
    };

    const handleLikePost = async (postId) => {
        try {
            const token = currentUser.token;
            await axios.post(`${API_URL}/posts/${postId}/like`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Update local state to reflect like immediately without full refetch
            setPosts(posts.map(p => p.id === postId ? { ...p, likesCount: p.likesCount + 1 } : p));
        } catch (error) {
            console.error('Error liking post', error);
        }
    };

    const toggleComments = async (postId) => {
        if (activeCommentPost === postId) {
            setActiveCommentPost(null);
            return;
        }

        setActiveCommentPost(postId);
        // Fetch comments if not already loaded
        if (!comments[postId]) {
            try {
                const token = currentUser.token;
                const res = await axios.get(`${API_URL}/posts/${postId}/comments`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setComments(prev => ({ ...prev, [postId]: res.data }));
            } catch (error) {
                console.error('Error fetching comments', error);
            }
        }
    };

    const handleAddComment = async (e, postId) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            const token = currentUser.token;
            const res = await axios.post(`${API_URL}/posts/${postId}/comments`, { content: newComment }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Append new comment locally
            setComments(prev => ({
                ...prev,
                [postId]: [...(prev[postId] || []), res.data]
            }));
            setNewComment('');
        } catch (error) {
            console.error('Error adding comment', error);
        }
    };

    if (loading) return <div className="p-6">Loading Forum...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <header className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Community Forum</h2>
                <p className="text-gray-600">Share financial tips, ask questions, and learn from others.</p>
            </header>

            {/* Create Post Section */}
            <div className="card bg-white shadow-sm border border-gray-100 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <FaPaperPlane className="text-blue-500" /> Start a Discussion
                </h3>
                <form onSubmit={handleCreatePost} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Thread Title..."
                        value={newPostTitle}
                        onChange={(e) => setNewPostTitle(e.target.value)}
                        className="input-field w-full"
                        required
                        maxLength={100}
                    />
                    <textarea
                        placeholder="What's on your mind?"
                        value={newPostContent}
                        onChange={(e) => setNewPostContent(e.target.value)}
                        className="input-field w-full resize-none h-24"
                        required
                    />
                    <div className="flex justify-end">
                        <button type="submit" className="btn-primary hover:bg-blue-700 transition px-6">
                            Publish Post
                        </button>
                    </div>
                </form>
            </div>

            {/* Feed Section */}
            <div className="space-y-6">
                {posts.map(post => (
                    <div key={post.id} className="card bg-white shadow-sm border border-gray-100 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                        <div className="p-6 pb-4">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg">
                                    {post.author?.username?.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-800">{post.author?.username}</p>
                                    <p className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}</p>
                                </div>
                            </div>

                            <h4 className="text-xl font-bold text-gray-900 mb-2">{post.title}</h4>
                            <p className="text-gray-700 whitespace-pre-wrap">{post.content}</p>
                        </div>

                        {/* Action Bar */}
                        <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex items-center gap-6">
                            <button
                                onClick={() => handleLikePost(post.id)}
                                className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition font-medium"
                            >
                                <FaHeart className={post.likesCount > 0 ? "text-red-500" : ""} />
                                <span>{post.likesCount} {post.likesCount === 1 ? 'Like' : 'Likes'}</span>
                            </button>
                            <button
                                onClick={() => toggleComments(post.id)}
                                className="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition font-medium"
                            >
                                <FaComment />
                                <span>Comments</span>
                            </button>
                        </div>

                        {/* Comments Section */}
                        {activeCommentPost === post.id && (
                            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                                <div className="space-y-4 mb-4 max-h-64 overflow-y-auto">
                                    {!comments[post.id] ? (
                                        <p className="text-gray-500 text-sm">Loading comments...</p>
                                    ) : comments[post.id].length === 0 ? (
                                        <p className="text-gray-500 text-sm">No comments yet. Be the first!</p>
                                    ) : (
                                        comments[post.id].map(comment => (
                                            <div key={comment.id} className="flex gap-3 bg-white p-3 rounded-lg border border-gray-100">
                                                <FaUserCircle className="text-gray-400 text-2xl mt-1" />
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-800">
                                                        {comment.author?.username}
                                                        <span className="text-xs font-normal text-gray-500 ml-2">
                                                            {new Date(comment.createdAt).toLocaleDateString()}
                                                        </span>
                                                    </p>
                                                    <p className="text-sm text-gray-700 mt-1">{comment.content}</p>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>

                                {/* Add Comment Form */}
                                <form onSubmit={(e) => handleAddComment(e, post.id)} className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Write a comment..."
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        className="input-field flex-1 text-sm py-2 px-3"
                                        required
                                    />
                                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded font-medium text-sm hover:bg-blue-700 transition">
                                        Post
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                ))}

                {posts.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-xl border border-gray-100 border-dashed">
                        <FaComment className="text-gray-300 text-4xl mx-auto mb-3" />
                        <h4 className="text-gray-600 font-medium">It's quiet in here.</h4>
                        <p className="text-gray-500 text-sm mt-1">Start the first community discussion!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Forum;
