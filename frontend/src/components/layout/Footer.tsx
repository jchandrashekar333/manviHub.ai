import { Link } from "react-router-dom"

export function Footer() {
    return (
        <footer className="border-t border-white/5 bg-background py-12 md:py-16">
            <div className="container flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                <Link to="/" className="flex flex-col gap-4 group">
                    <div className="flex items-center gap-2">
                        <img
                            src="/logo.png"
                            alt="ManviHub Logo"
                            className="h-10 w-10 object-contain rounded-full shadow-2xl transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300"
                        />
                        <span className="text-xl font-black tracking-tighter text-white">Manvi<span className="text-primary">Hub</span></span>
                    </div>
                    <p className="text-sm text-white/50 max-w-xs">
                        The ultimate clean and accessible hub to discover, compare, and build your AI toolkit with confidence.
                    </p>
                </Link>

                <div className="flex gap-8">
                    <div className="flex flex-col gap-4">
                        <h4 className="text-sm font-semibold text-white">Platform</h4>
                        <Link to="/" className="text-sm text-white/50 hover:text-white transition-colors">Tools</Link>
                        <Link to="/submit" className="text-sm text-white/50 hover:text-white transition-colors">Submit</Link>
                    </div>
                    <div className="flex flex-col gap-4">
                        <h4 className="text-sm font-semibold text-white">Company</h4>
                        <Link to="/about" className="text-sm text-white/50 hover:text-white transition-colors">About</Link>
                        <a href="#" className="text-sm text-white/50 hover:text-white transition-colors">Twitter</a>
                    </div>
                </div>
            </div>
            <div className="container mt-12 pt-8 border-t border-white/5">
                <p className="text-xs text-white/30 text-center md:text-left">
                    © 2026 ManviHub.ai. All rights reserved.
                </p>
            </div>
        </footer>
    )
}
