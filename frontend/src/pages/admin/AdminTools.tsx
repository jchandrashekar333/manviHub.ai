import { useEffect, useState } from 'react';
import { Search, Edit2, Trash2, ExternalLink } from 'lucide-react';
import api from '../../lib/api';
import type { Tool } from '../../data/tools';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export function AdminTools() {
    const [tools, setTools] = useState<Tool[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchTools = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: '20',
                search
            });

            const { data } = await api.get(`/admin/tools?${params}`);
            setTools(data.tools);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error('Failed to fetch tools', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchTools();
        }, 300);
        return () => clearTimeout(timer);
    }, [page, search]);

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this tool?')) return;
        try {
            await api.delete(`/admin/tools/${id}`);
            setTools(tools.filter(t => t.id !== id));
        } catch (error) {
            alert('Failed to delete tool');
        }
    };

    const handleStatusUpdate = async (id: string, status: 'verified' | 'rejected') => {
        try {
            await api.put(`/admin/tools/${id}/status`, { status });
            setTools(tools.map(t => t.id === id ? { ...t, status } : t));
        } catch (error) {
            alert('Failed to update tool status');
        }
    };

    const toggleFeatured = async (tool: Tool) => {
        try {
            const updated = { ...tool, featured: !tool.featured };
            await api.put(`/admin/tools/${tool.id}/status`, { featured: updated.featured });
            setTools(tools.map(t => t.id === tool.id ? updated : t));
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Manage Tools</h1>
                <Button>Add New Tool</Button>
            </div>

            {/* Filters */}
            <div className="flex gap-4">
                <div className="flex-1">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Search tools..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10 bg-white text-gray-900 border-gray-200 focus:border-primary"
                        />
                    </div>
                </div>
                {/* Category Filter could go here */}
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-gray-700">Tool</th>
                                <th className="px-6 py-4 font-semibold text-gray-700">Category</th>
                                <th className="px-6 py-4 font-semibold text-gray-700">Status</th>
                                <th className="px-6 py-4 font-semibold text-gray-700">Pricing</th>
                                <th className="px-6 py-4 font-semibold text-gray-700 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">Loading...</td></tr>
                            ) : tools.length === 0 ? (
                                <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">No tools found</td></tr>
                            ) : (
                                tools.map((tool) => (
                                    <tr key={tool.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {tool.image && (
                                                    <img src={tool.image} alt="" className="w-8 h-8 rounded object-cover bg-gray-100" />
                                                )}
                                                <div>
                                                    <div className="font-medium text-gray-900">{tool.name}</div>
                                                    <a href={tool.url} target="_blank" rel="noreferrer" className="text-xs text-gray-500 hover:text-primary flex items-center gap-1">
                                                        {tool.url} <ExternalLink className="w-3 h-3" />
                                                    </a>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">{tool.category}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${(tool.status || 'verified') === 'verified' ? 'bg-green-50 text-green-700' :
                                                    tool.status === 'pending' ? 'bg-amber-50 text-amber-700' :
                                                        'bg-red-50 text-red-700'
                                                }`}>
                                                {(tool.status || 'verified').charAt(0).toUpperCase() + (tool.status || 'verified').slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => toggleFeatured(tool)}
                                                className={`px-2 py-1 rounded text-xs font-medium border transition-colors ${tool.featured
                                                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                                                    : 'bg-gray-50 text-gray-500 border-gray-200 opacity-50 hover:opacity-100'
                                                    }`}
                                            >
                                                {tool.featured ? 'Featured' : 'Standard'}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${tool.isPaid
                                                ? 'bg-purple-50 text-purple-700'
                                                : 'bg-green-50 text-green-700'
                                                }`}>
                                                {tool.isPaid ? 'Paid' : 'Free'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {tool.status === 'pending' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleStatusUpdate(tool.id, 'verified')}
                                                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                            title="Approve"
                                                        >
                                                            Approve
                                                        </button>
                                                        <button
                                                            onClick={() => handleStatusUpdate(tool.id, 'rejected')}
                                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                            title="Reject"
                                                        >
                                                            Reject
                                                        </button>
                                                    </>
                                                )}
                                                <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(tool.id)}
                                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-sm text-gray-500">Page {page} of {totalPages}</span>
                    <div className="flex gap-2">
                        <Button
                            variant="secondary"
                            size="sm"
                            disabled={page <= 1}
                            onClick={() => setPage(p => p - 1)}
                        >
                            Previous
                        </Button>
                        <Button
                            variant="secondary"
                            size="sm"
                            disabled={page >= totalPages}
                            onClick={() => setPage(p => p + 1)}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
