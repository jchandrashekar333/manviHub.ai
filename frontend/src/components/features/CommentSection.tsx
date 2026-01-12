import React, { useState, useEffect } from 'react';
import { Send, MessageSquare } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { commentsApi } from '../../lib/api';
import { formatDistanceToNow } from 'date-fns';
import type { Tool } from '../../data/tools';

interface Comment {
    _id: string;
    content: string;
    userId: {
        name: string;
        email: string;
    };
    createdAt: string;
    likes: number;
}

interface CommentSectionProps {
    tool: Tool;
    onAuthRequired?: () => void;
    onCommentAdded?: () => void;
}

export const CommentSection: React.FC<CommentSectionProps> = ({ tool, onAuthRequired, onCommentAdded }) => {
    const { isAuthenticated } = useAuth();
    const [comments, setComments] = useState<Comment[]>([]);
    const [commentText, setCommentText] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchComments();
    }, [tool.id]);

    const fetchComments = async () => {
        try {
            const response = await commentsApi.getByToolId(tool.id);
            setComments(response.data);
        } catch (error) {
            console.error('Failed to fetch comments:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentText.trim()) return;

        if (!isAuthenticated) {
            onAuthRequired?.();
            return;
        }

        setSubmitting(true);
        try {
            const response = await commentsApi.create(tool.id, commentText);
            setComments([response.data, ...comments]);
            setCommentText('');
            onCommentAdded?.(); // Update comment count in parent
        } catch (error) {
            console.error('Failed to post comment:', error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="mt-4 pt-4 border-t border-white/5 space-y-4">
            <div className="flex items-center gap-2 text-white/60 text-sm mb-4">
                <MessageSquare className="h-4 w-4" />
                <span className="font-medium">Comments ({comments.length})</span>
            </div>

            {/* Comment List */}
            <div className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                {loading ? (
                    <div className="text-white/20 text-xs py-4 text-center">
                        Loading comments...
                    </div>
                ) : comments.length > 0 ? (
                    comments.map((comment) => (
                        <div key={comment._id} className="bg-white/5 rounded-lg p-3 space-y-1">
                            <div className="flex justify-between items-center">
                                <span className="text-primary text-xs font-semibold">
                                    {comment.userId.name}
                                </span>
                                <span className="text-white/30 text-[10px]">
                                    {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                                </span>
                            </div>
                            <p className="text-white/80 text-xs leading-relaxed">{comment.content}</p>
                        </div>
                    ))
                ) : (
                    <div className="text-white/20 text-xs py-4 text-center italic">
                        No thoughts yet. Be the first to share!
                    </div>
                )}
            </div>

            {/* Comment Form */}
            <form onSubmit={handleSubmit} className="space-y-2 mt-4">
                {!isAuthenticated && (
                    <div className="text-xs text-white/40 text-center py-2">
                        <button
                            type="button"
                            onClick={onAuthRequired}
                            className="text-primary hover:text-primary/80 underline"
                        >
                            Sign in
                        </button>{' '}
                        to comment
                    </div>
                )}
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder={isAuthenticated ? "Share your thoughts..." : "Sign in to comment"}
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        disabled={!isAuthenticated}
                        required
                        className="flex-1 bg-white/5 border border-white/10 rounded-lg py-1.5 px-4 text-xs text-white placeholder-white/30 focus:outline-none focus:border-primary/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <button
                        type="submit"
                        disabled={submitting || !commentText.trim() || !isAuthenticated}
                        className="bg-primary/20 hover:bg-primary/30 disabled:opacity-50 text-primary p-2 rounded-lg transition-all disabled:cursor-not-allowed"
                    >
                        <Send className="h-4 w-4" />
                    </button>
                </div>
            </form>
        </div>
    );
};
