import { useSearchParams } from "react-router-dom"
import { useState, useMemo } from "react"
import { ToolCard } from "../components/features/ToolCard"
import { Search as SearchIcon } from "lucide-react"
import { useTools } from "../context/ToolContext"
import { Button } from "../components/ui/Button"

export function Search() {
    const [searchParams] = useSearchParams()
    const [filter, setFilter] = useState<'all' | 'free' | 'paid'>('all')
    const query = searchParams.get("q") || ""
    const { tools: TOOLS, loading, error } = useTools()

    const { results, filteredResults } = useMemo(() => {
        const q = query.toLowerCase()
        const searchResults = TOOLS.filter(tool =>
            tool.name.toLowerCase().includes(q) ||
            tool.description.toLowerCase().includes(q) ||
            tool.category.toLowerCase().includes(q)
        )
        const filtered = searchResults.filter(tool => {
            if (filter === 'free') return !tool.isPaid
            if (filter === 'paid') return tool.isPaid
            return true
        })
        return { results: searchResults, filteredResults: filtered }
    }, [TOOLS, query, filter])

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
        <div className="container py-12 md:py-20">
            <div className="flex flex-col gap-8">
                <div className="border-b border-white/10 pb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                        <SearchIcon className="h-6 w-6 text-white/40" />
                        Search results for "{query}"
                    </h1>
                </div>

                {/* Filter Tabs */}
                {results.length > 0 && (
                    <div className="flex items-center gap-2">
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
                                        ? results.length
                                        : results.filter(t => f === 'free' ? !t.isPaid : t.isPaid).length}
                                </span>
                            </button>
                        ))}
                    </div>
                )}

                {filteredResults.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredResults.map((tool) => (
                            <ToolCard key={tool.id} tool={tool} />
                        ))}
                    </div>
                ) : (
                    <div className="py-24 text-center">
                        <p className="text-xl text-white/40">No {filter} tools found matching your search.</p>
                        {filter !== 'all' && results.length > 0 && (
                            <button
                                onClick={() => setFilter('all')}
                                className="mt-2 text-sm text-primary hover:underline"
                            >
                                Show all results
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
