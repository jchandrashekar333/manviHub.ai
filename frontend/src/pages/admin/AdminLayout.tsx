import { Link, Outlet, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export function AdminLayout() {
    const { logout } = useAuth();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const navItems = [
        { label: 'Dashboard', path: '/admin' },
        { label: 'Tools', path: '/admin/tools' },
        { label: 'Users', path: '/admin/users' },
        { label: 'Categories', path: '/admin/categories' },
        { label: 'Moderation', path: '/admin/moderation' },
        { label: 'Settings', path: '/admin/settings' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform transition-transform duration-200 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0`}
            >
                <div className="flex flex-col h-full">
                    <div className="p-6 border-b border-white/10 flex items-center justify-between">
                        <Link to="/" className="text-xl font-bold tracking-tight">AI Admin</Link>
                        <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-white/60 hover:text-white">
                            <span className="text-xl">X</span>
                        </button>
                    </div>

                    <nav className="flex-1 p-4 space-y-1">
                        {navItems.map((item) => {
                            const isActive = location.pathname === item.path ||
                                (item.path !== '/admin' && location.pathname.startsWith(item.path));
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-primary text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}
                                >
                                    <span>{item.label.charAt(0)}</span>
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="p-4 border-t border-white/10">
                        <button
                            onClick={logout}
                            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-sm font-medium text-red-400 hover:bg-white/5 transition-colors"
                        >
                            <span>L</span>
                            Logout
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 min-w-0 overflow-auto">
                {/* Mobile Header */}
                <header className="lg:hidden bg-white border-b px-4 py-3 flex items-center justify-between">
                    <button onClick={() => setIsSidebarOpen(true)} className="text-gray-600">
                        <span>Menu</span>
                    </button>
                    <span className="font-semibold text-gray-900">Admin Panel</span>
                </header>

                <div className="p-6 lg:p-8 max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
