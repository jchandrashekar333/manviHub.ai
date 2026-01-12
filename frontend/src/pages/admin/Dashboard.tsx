import { useEffect, useState } from 'react';
import { Users, PenTool, AlertCircle, MessageSquare, TrendingUp, UserPlus } from 'lucide-react';
import api from '../../lib/api';

export function AdminDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Assuming we use api helper. We might need to add admin endpoints there or call axios directly for now
                // Let's assume we extended api helper later, for now inline fetch or generic get
                const { data } = await api.get('/admin/stats');
                setStats(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const statCards = [
        {
            label: 'Total Users',
            value: stats?.users || 0,
            icon: Users,
            color: 'bg-blue-500',
            trend: '+12% this month'
        },
        {
            label: 'Total Tools',
            value: stats?.tools || 0,
            icon: PenTool,
            color: 'bg-purple-500',
            trend: '+5 new today'
        },
        {
            label: 'Pending Reviews',
            value: stats?.pendingTools || 0,
            icon: AlertCircle,
            color: 'bg-amber-500',
            trend: 'Action needed'
        },
        {
            label: 'Total Comments',
            value: stats?.comments || 0,
            icon: MessageSquare,
            color: 'bg-green-500',
            trend: '+8% this week'
        },
    ];

    if (loading) return <div>Loading stats...</div>;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
                <p className="text-gray-500">Welcome back, Admin. Here's what's happening today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, index) => (
                    <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</h3>
                            <span className="text-xs font-medium text-green-600 mt-2 block">{stat.trend}</span>
                        </div>
                        <div className={`p-3 rounded-lg ${stat.color} bg-opacity-10 text-${stat.color.split('-')[1]}-600`}>
                            {/* Tailwind text color fix: simplified */}
                            <div className={`text-white p-2 rounded-lg ${stat.color}`}>
                                <stat.icon className="w-5 h-5" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Actions (Bento Grid style) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Activity Chart Placeholder */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 h-64 flex flex-col items-center justify-center text-gray-400">
                    <TrendingUp className="w-8 h-8 mb-2 opacity-50" />
                    <p>Activity Chart (Coming Soon)</p>
                </div>

                {/* Recent Signups Placeholder */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 h-64 flex flex-col items-center justify-center text-gray-400">
                    <UserPlus className="w-8 h-8 mb-2 opacity-50" />
                    <p>Recent User Signups (Coming Soon)</p>
                </div>
            </div>
        </div>
    );
}
