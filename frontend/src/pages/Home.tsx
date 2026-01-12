import { useState, useMemo } from "react"
import { useNavigate, useOutletContext } from "react-router-dom"
import { Search } from "lucide-react"
import { Input } from "../components/ui/Input"
import { CATEGORIES } from "../data/tools"
import { CategoryCard } from "../components/features/CategoryCard"
import { ToolCard } from "../components/features/ToolCard"
import { Button } from "../components/ui/Button"
import { useTools } from "../context/ToolContext"

export function Home() {
    const navigate = useNavigate()
    const [query, setQuery] = useState("")
    const { tools: TOOLS, loading, error } = useTools()
    const { openAuthModal } = useOutletContext<{ openAuthModal: () => void }>()

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (query.trim()) {
            navigate(`/search?q=${encodeURIComponent(query)}`)
        }
    }

    const counts = useMemo(() => {
        return TOOLS.reduce((acc, tool) => {
            acc[tool.category] = (acc[tool.category] || 0) + 1
            return acc
        }, {} as Record<string, number>)
    }, [TOOLS])

    const featuredTools = useMemo(() => TOOLS.filter(t => t.featured), [TOOLS])

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <p className="text-red-500 font-medium">{error}</p>
                <Button onClick={() => window.location.reload()}>Retry</Button>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-24 py-20">
            {/* Hero Section */}
            <section className="container max-w-4xl mx-auto text-center px-6 pt-10">
                <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/60 mb-8 backdrop-blur-md">
                    <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
                    {TOOLS.length}+ AI Tools curated
                </div>

                <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/40 mb-8 text-balance">
                    Discover the future<br /> of <span className="text-white">AI Tools</span>
                </h1>

                <p className="text-lg md:text-xl text-white/50 mb-12 max-w-2xl mx-auto text-balance leading-relaxed font-light">
                    The ultimate clean and accessible hub to discover the best AI tools, curated for creators, developers, and teams who want to work smarter.
                </p>

                <form onSubmit={handleSearch} className="relative max-w-xl mx-auto w-full group">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-white/30 group-focus-within:text-primary transition-colors duration-300" />
                    </div>
                    <Input
                        type="text"
                        placeholder="Search for tools, prompts, or categories..."
                        className="pl-14 h-16 bg-white/[0.03] border-white/10 rounded-2xl text-lg focus-visible:ring-offset-0 transition-all duration-300 hover:bg-white/[0.06] hover:border-white/20 focus:bg-background focus:border-primary/50 shadow-2xl shadow-black/50"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </form>
            </section>

            {/* Categories */}
            <section className="container">
                <div className="flex flex-col gap-8">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold tracking-tight text-white">Browse Categories</h2>
                        <Button variant="ghost" className="text-white/40 hover:text-white">View all</Button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {CATEGORIES.map((cat) => {
                            const count = counts[cat] || 0
                            return <CategoryCard key={cat} name={cat} count={count} />
                        })}
                    </div>
                </div>
            </section>

            {/* Featured Tools */}
            <section className="container">
                <div className="flex flex-col gap-8">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold tracking-tight text-white">Featured Tools</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {featuredTools.map((tool) => (
                            <ToolCard key={tool.id} tool={tool} onAuthRequired={openAuthModal} />
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}
