import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { submissionsApi } from '../lib/api';
import { Button } from '../components/ui/Button';

interface PendingTool {
    _id: string;
    name: string;
    description: string;
    category: string;
    url: string;
    isPaid: boolean;
    submittedBy: {
        name: string;
        email: string;
    };
    submittedAt: string;
    status: string;
}

export function AdminPending() {
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [tools, setTools] = useState<PendingTool[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!isAuthenticated || !user?.isAdmin) {
            navigate('/');
        } else {
            fetchPendingTools();
        }
    }, [isAuthenticated, user, navigate]);

    const fetchPendingTools = async () => {
        try {
            const response = await submissionsApi.getPending();
            setTools(response.data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch pending tools');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id: string) => {
        if (!confirm('Approve this tool?')) return;

        try {
            await submissionsApi.approve(id);
            setTools(tools.filter(t => t._id !== id));
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to approve tool');
        }
    };

    const handleReject = async (id: string) => {
        const reason = prompt('Rejection reason (optional):');
        if (reason === null) return; // User cancelled

        try {
            await submissionsApi.reject(id, reason || undefined);
            setTools(tools.filter(t => t._id !== id));
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to reject tool');
        }
    };

    if (loading) {
        return (
            <div className="container py-20 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-white/60">Loading pending submissions...</p>
            </div>
        );
    }

    return (
        <div className="container py-12">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Pending Tool Submissions</h1>
                <p className="text-white/60">{tools.length} tools awaiting review</p>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-lg mb-6">
                    {error}
                </div>
            )}

            {tools.length === 0 ? (
                <div className="text-center py-12 bg-surface rounded-xl border border-white/5">
                    <p className="text-white/60">No pending submissions</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {tools.map((tool) => (
                        <div
                            key={tool._id}
                            className="bg-surface border border-white/5 rounded-xl p-6 hover:border-white/10 transition-colors"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-xl font-bold text-white">{tool.name}</h3>
                                        <span className={`text-xs px-2 py-1 rounded-full ${tool.isPaid
                                                ? 'bg-yellow-500/20 text-yellow-500'
                                                : 'bg-green-500/20 text-green-500'
                                            }`}>
                                            {tool.isPaid ? 'Paid' : 'Free'}
                                        </span>
                                        <span className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-500">
                                            {tool.category}
                                        </span>
                                    </div>

                                    <p className="text-white/70 mb-3">{tool.description}</p>

                                    <div className="flex items-center gap-4 text-sm text-white/50">
                                        <a
                                            href={tool.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="hover:text-primary transition-colors"
                                        >
                                            {tool.url}
                                        </a>
                                        <span>•</span>
                                        <span>Submitted by {tool.submittedBy.name}</span>
                                        <span>•</span>
                                        <span>{new Date(tool.submittedAt).toLocaleDateString()}</span>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <Button
                                        onClick={() => handleApprove(tool._id)}
                                        className="bg-green-600 hover:bg-green-700"
                                    >
                                        Approve
                                    </Button>
                                    <Button
                                        onClick={() => handleReject(tool._id)}
                                        variant="outline"
                                        className="border-red-500/20 text-red-500 hover:bg-red-500/10"
                                    >
                                        Reject
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
