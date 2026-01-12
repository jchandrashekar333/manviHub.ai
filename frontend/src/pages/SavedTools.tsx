import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bookmark, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { userApi } from '../lib/api';
import { ToolCard } from '../components/features/ToolCard';
import type { Tool } from '../data/tools';

export function SavedTools() {
    const { isAuthenticated, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [tools, setTools] = useState<Tool[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, authLoading, navigate]);

    useEffect(() => {
        if (isAuthenticated) {
            fetchSavedTools();
        }
    }, [isAuthenticated]);

    const fetchSavedTools = async () => {
        try {
            const response = await userApi.getSavedTools();
            setTools(response.data);
        } catch (error) {
            console.error('Failed to fetch saved tools:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUnsave = (toolId: string) => {
        setTools(tools.filter(tool => tool.id !== toolId));
    };

    const filteredTools = tools.filter(tool =>
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading your saved tools...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <Bookmark className="w-8 h-8 text-blue-600" />
                    <h1 className="text-3xl font-bold text-white">My Saved Tools</h1>
                </div>
                <p className="text-white/60">
                    {tools.length} {tools.length === 1 ? 'tool' : 'tools'} saved
                </p>
            </div>

            {/* Search */}
            {tools.length > 0 && (
                <div className="mb-6">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search saved tools..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
            )}

            {/* Tools Grid */}
            {filteredTools.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTools.map((tool) => (
                        <ToolCard
                            key={tool.id}
                            tool={tool}
                            onUnsave={handleUnsave}
                        />
                    ))}
                </div>
            ) : tools.length > 0 ? (
                <div className="text-center py-12">
                    <p className="text-white/60">No tools match your search</p>
                </div>
            ) : (
                <div className="text-center py-12">
                    <Bookmark className="w-16 h-16 text-white/20 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">No saved tools yet</h3>
                    <p className="text-white/60 mb-6">
                        Start exploring and save your favorite AI tools
                    </p>
                    <button
                        onClick={() => navigate('/')}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                        Explore Tools
                    </button>
                </div>
            )}
        </div>
    );
}
