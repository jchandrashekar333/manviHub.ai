import { ExternalLink, Heart, MessageSquare, Bookmark } from "lucide-react"
import { Badge } from "../ui/Badge"
import type { Tool } from "../../data/tools"
import { useState, useEffect } from "react"
import { CommentSection } from "./CommentSection"
import { useAuth } from "../../context/AuthContext"
import { toolsApi, commentsApi } from "../../lib/api"

interface ToolCardProps {
    tool: Tool
    onUnsave?: (toolId: string) => void
    onAuthRequired?: () => void
}

export function ToolCard({ tool, onUnsave, onAuthRequired }: ToolCardProps) {
    const { isAuthenticated } = useAuth()
    const [imageError, setImageError] = useState(false)
    const [isLiked, setIsLiked] = useState(false)
    const [isSaved, setIsSaved] = useState(false)
    const [likes, setLikes] = useState(tool.likes || 0)
    const [showComments, setShowComments] = useState(false)
    const [commentCount, setCommentCount] = useState(0)

    // Fetch comment count when component mounts
    useEffect(() => {
        const fetchCommentCount = async () => {
            try {
                const response = await commentsApi.getByToolId(tool.id)
                setCommentCount(response.data.length)
            } catch (error) {
                console.error('Failed to fetch comment count:', error)
            }
        }
        fetchCommentCount()
    }, [tool.id])

    const handleLike = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        if (!isAuthenticated) {
            onAuthRequired?.()
            return
        }

        try {
            const response = await toolsApi.like(tool.id)
            setIsLiked(response.data.isLiked)
            setLikes(response.data.likes)
        } catch (error) {
            console.error('Failed to like tool:', error)
        }
    }

    const handleSave = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        if (!isAuthenticated) {
            onAuthRequired?.()
            return
        }

        try {
            if (isSaved) {
                await toolsApi.unsave(tool.id)
                setIsSaved(false)
                onUnsave?.(tool.id)
            } else {
                await toolsApi.save(tool.id)
                setIsSaved(true)
            }
        } catch (error) {
            console.error('Failed to save tool:', error)
        }
    }

    const handleToggleComments = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setShowComments(prev => !prev)
    }

    const handleCommentAdded = () => {
        setCommentCount(prev => prev + 1)
    }

    const getHostname = (url: string) => {
        try {
            // First try as is
            return new URL(url).hostname
        } catch {
            try {
                // If it fails, try prepending https://
                return new URL(`https://${url}`).hostname
            } catch {
                return ""
            }
        }
    }

    const hostname = getHostname(tool.url)

    // 4-Layer Icon Discovery System
    const manualOverrides: Record<string, string> = {
        'chat.openai.com': 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg',
        'midjourney.com': 'https://upload.wikimedia.org/wikipedia/commons/e/e6/Midjourney_Emblem.png',
        'stability.ai': 'https://stability.ai/favicon.ico',
        'notion.so': 'https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png',
        'jasper.ai': 'https://www.jasper.ai/favicon.ico',
        'synthesia.io': 'https://www.synthesia.io/favicon.ico',
        'heygen.com': 'https://www.heygen.com/favicon.ico',
        'lumalabs.ai': 'https://lumalabs.ai/favicon.ico',
        'klingai.com': 'https://klingai.com/favicon.ico',
        'gamma.app': 'https://gamma.app/favicon.ico',
    }

    const getIconUrl = () => {
        // Layer 1: Manual overrides
        if (manualOverrides[hostname]) {
            return manualOverrides[hostname]
        }

        // Layer 2: Unavatar.io
        if (hostname) {
            return `https://unavatar.io/${hostname}?fallback=https://www.google.com/s2/favicons?domain=${hostname}&sz=128`
        }

        // Layer 3: Google Favicons (already in fallback)
        return `https://www.google.com/s2/favicons?domain=${hostname}&sz=128`
    }

    const [displayImage, setDisplayImage] = useState(tool.image || getIconUrl())
    const [isUsingFallback, setIsUsingFallback] = useState(false)

    const handleImageError = () => {
        if (!isUsingFallback && displayImage !== getIconUrl()) {
            // First failure (likely tool.image), try icon discovery
            setDisplayImage(getIconUrl())
            setIsUsingFallback(true)
        } else {
            // Second failure, show letter avatar
            setImageError(true)
        }
    }

    return (
        <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-b from-surface to-background p-6 transition-all duration-300 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1">
            <div className="flex flex-col gap-4">
                <div className="flex items-start justify-between">
                    <div className="h-10 w-10 flex-shrink-0 rounded-xl bg-white flex items-center justify-center text-lg font-bold text-black/40 overflow-hidden shadow-sm p-1.5 transition-transform group-hover:scale-105">
                        {!imageError ? (
                            <img
                                src={displayImage}
                                alt={`${tool.name} icon`}
                                className="h-full w-full object-contain"
                                onError={handleImageError}
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-primary/20 to-primary/5 text-primary text-xl font-bold rounded-lg">
                                {tool.name.charAt(0)}
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleSave}
                            className={`p-2 rounded-full transition-all duration-300 ${isSaved
                                ? "bg-blue-500/20 text-blue-500"
                                : "hover:bg-white/5 text-white/40 hover:text-white"
                                }`}
                            title={isSaved ? "Unsave" : "Save"}
                        >
                            <Bookmark className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`} />
                        </button>
                        <button
                            onClick={handleLike}
                            className={`flex items-center gap-1.5 px-2 py-1 rounded-full transition-all duration-300 ${isLiked
                                ? "bg-red-500/20 text-red-500"
                                : "hover:bg-white/5 text-white/40 hover:text-white"
                                }`}
                        >
                            <Heart className={`h-4 w-4 transform transition-transform duration-300 ${isLiked ? "fill-current scale-110" : "group-hover:scale-110"}`} />
                            <span className="text-xs font-semibold tabular-nums">{likes}</span>
                        </button>
                        <a
                            href={tool.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white/5 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 text-white/60 hover:text-white hover:bg-white/10"
                        >
                            <ExternalLink className="h-4 w-4" />
                        </a>
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-bold text-white tracking-tight group-hover:text-primary transition-colors duration-300">{tool.name}</h3>
                    <p className="mt-2 text-sm text-white/50 line-clamp-2 leading-relaxed font-light">
                        {tool.description}
                    </p>
                </div>
            </div>

            <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-white/5 border-white/5">{tool.category}</Badge>
                    <button
                        onClick={handleToggleComments}
                        className={`flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-medium transition-all ${showComments ? 'bg-primary/20 text-primary' : 'bg-white/5 text-white/40 hover:text-white/60'}`}
                    >
                        <MessageSquare className="h-3 w-3" />
                        <span>{commentCount}</span>
                    </button>
                </div>
                <span className={tool.isPaid ? "text-xs font-medium text-white/40" : "text-xs font-medium text-green-400"}>
                    {tool.isPaid ? "Paid" : "Free"}
                </span>
            </div>

            {showComments && (
                <CommentSection
                    tool={tool}
                    onAuthRequired={onAuthRequired}
                    onCommentAdded={handleCommentAdded}
                />
            )}
        </div>
    )
}
