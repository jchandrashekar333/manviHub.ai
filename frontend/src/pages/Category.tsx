import { useParams, Link } from "react-router-dom"
import { useState, useMemo } from "react"
import { ToolCard } from "../components/features/ToolCard"
import { ArrowLeft } from "lucide-react"
import { useTools } from "../context/ToolContext"
import { Button } from "../components/ui/Button"

export function Category() {
    const { slug } = useParams<{ slug: string }>()
    const [filter, setFilter] = useState<'all' | 'free' | 'paid'>('all')
    const { tools: TOOLS, loading, error } = useTools()

    const categoryName = slug ? slug.replace(/-/g, " ") : ""

    const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "")

    const { categoryTools, filteredTools } = useMemo(() => {
        const tools = TOOLS.filter(t => normalize(t.category).includes(normalize(categoryName)))
        const filtered = tools.filter(tool => {
            if (filter === 'free') return !tool.isPaid
            if (filter === 'paid') return tool.isPaid
            return true
        })
        return { categoryTools: tools, filteredTools: filtered }
    }, [TOOLS, categoryName, filter])

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

    // Display name can be reconstructed or found from mock data matches
    const displayTitle = categoryTools.length > 0 ? categoryTools[0].category : categoryName

    return (
        <div className="container py-12 md:py-20">
            <div className="flex flex-col gap-8">
                <div>
                    <Link to="/" className="inline-flex items-center text-sm text-white/40 hover:text-white mb-6 transition-colors">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Home
                    </Link>
                    <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight capitalize">{displayTitle}</h1>
                    <p className="mt-4 text-white/60 text-lg">
                        Discover the best {displayTitle} tools and resources.
                    </p>
                </div>

                {/* Filter Tabs */}
                {categoryTools.length > 0 && (
                    <div className="flex items-center gap-2 border-b border-white/10 pb-4">
                        {(['all', 'free', 'paid'] as const).map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`
                                    px-4 py-2 rounded-full text-sm font-medium transition-all
                                    ${filter === f
                                        ? 'bg-white text-black'
                                        : 'bg-transparent text-white/60 hover:text-white hover:bg-white/5'}
                                `}
                            >
                                {f.charAt(0).toUpperCase() + f.slice(1)}
                                <span className="ml-2 opacity-50 text-xs">
                                    {f === 'all'
                                        ? categoryTools.length
                                        : categoryTools.filter(t => f === 'free' ? !t.isPaid : t.isPaid).length}
                                </span>
                            </button>
                        ))}
                    </div>
                )}

                {filteredTools.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredTools.map((tool) => (
                            <ToolCard key={tool.id} tool={tool} />
                        ))}
                    </div>
                ) : (
                    <div className="py-20 text-center border border-dashed border-white/10 rounded-xl bg-white/5">
                        <p className="text-white/40">No {filter} tools found in this category.</p>
                        <button
                            onClick={() => setFilter('all')}
                            className="mt-4 text-sm text-primary hover:underline"
                        >
                            View all tools
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
