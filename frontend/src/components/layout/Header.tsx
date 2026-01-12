import { Link } from "react-router-dom"
import { Search, Plus, Bookmark, LogOut, User } from "lucide-react"
import { Button } from "../ui/Button"
import { useAuth } from "../../context/AuthContext"
import { useState } from "react"

interface HeaderProps {
    onAuthClick?: () => void
}

export function Header({ onAuthClick }: HeaderProps) {
    const { isAuthenticated, user, logout } = useAuth()
    const [showUserMenu, setShowUserMenu] = useState(false)

    return (
        <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-background/80 backdrop-blur-xl">
            <div className="container flex h-16 items-center justify-between">
                <Link to="/" className="flex items-center space-x-2 group">
                    <div className="relative flex items-center justify-center">
                        <div className="absolute inset-0 bg-primary/40 blur-lg rounded-full group-hover:bg-primary/60 transition-all duration-500"></div>
                        <img
                            src="/logo.png"
                            alt="ManviHub Logo"
                            className="relative h-10 w-10 object-contain rounded-full shadow-2xl transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300"
                        />
                    </div>
                    <span className="text-xl font-black tracking-tighter text-white">Manvi<span className="text-primary">Hub</span></span>
                </Link>

                <nav className="hidden md:flex items-center gap-6">
                    <Link to="/" className="text-sm font-medium text-white/60 hover:text-white transition-colors">Discover</Link>
                    <Link to="/about" className="text-sm font-medium text-white/60 hover:text-white transition-colors">About</Link>
                    {isAuthenticated && (
                        <Link to="/saved-tools" className="text-sm font-medium text-white/60 hover:text-white transition-colors flex items-center gap-1">
                            <Bookmark className="h-4 w-4" />
                            Saved
                        </Link>
                    )}
                </nav>

                <div className="flex items-center gap-4">
                    <Link to="/search">
                        <Button variant="ghost" size="sm" className="text-white/60 hover:text-white">
                            <Search className="h-4 w-4" />
                        </Button>
                    </Link>
                    <Link to="/submit">
                        <Button variant="secondary" size="sm" className="gap-2 hidden sm:flex">
                            <Plus className="h-4 w-4" />
                            <span className="hidden sm:inline">Submit Tool</span>
                        </Button>
                    </Link>

                    {isAuthenticated ? (
                        <div className="relative">
                            <button
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                            >
                                <User className="h-4 w-4 text-white/60" />
                                <span className="text-sm text-white/80 hidden sm:inline">{user?.name}</span>
                            </button>

                            {showUserMenu && (
                                <div className="absolute right-0 mt-2 w-48 bg-surface border border-white/10 rounded-lg shadow-xl overflow-hidden">
                                    <Link
                                        to="/saved-tools"
                                        className="flex items-center gap-2 px-4 py-2 text-sm text-white/80 hover:bg-white/5 transition-colors"
                                        onClick={() => setShowUserMenu(false)}
                                    >
                                        <Bookmark className="h-4 w-4" />
                                        My Saved Tools
                                    </Link>
                                    {user?.isAdmin && (
                                        <Link
                                            to="/admin/pending"
                                            className="flex items-center gap-2 px-4 py-2 text-sm text-yellow-500 hover:bg-white/5 transition-colors"
                                            onClick={() => setShowUserMenu(false)}
                                        >
                                            <div className="h-4 w-4 flex items-center justify-center font-bold">!</div>
                                            Admin Dashboard
                                        </Link>
                                    )}
                                    <button
                                        onClick={() => {
                                            logout()
                                            setShowUserMenu(false)
                                        }}
                                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-white/5 transition-colors"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Button
                            onClick={onAuthClick}
                            variant="secondary"
                            size="sm"
                            className="gap-2"
                        >
                            <User className="h-4 w-4" />
                            <span className="hidden sm:inline">Sign In</span>
                        </Button>
                    )}
                </div>
            </div>
        </header>
    )
}
