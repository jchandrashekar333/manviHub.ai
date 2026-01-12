import { Link } from "react-router-dom"
import {
    ArrowRight,
    Image as ImageIcon,
    Type,
    Video,
    Music,
    Code,
    Library,
    Sparkles,
    Box,
    Layout,
    Briefcase,
    Gavel,
    GraduationCap,
    Heart,
    Gamepad2,
    Plane,
    Stethoscope,
    Coffee,
    Zap,
    Search
} from "lucide-react"

interface CategoryCardProps {
    name: string
    count?: number
}

const ICON_MAP: Record<string, any> = {
    "AI Image Tools": ImageIcon,
    "AI Prompt Libraries": Library,
    "AI Prompt Generators": Sparkles,
    "AI Video Tools": Video,
    "AI Audio / Music": Music,
    "AI Writing Tools": Type,
    "AI Developer Tools": Code,
    "AI 3D & Animation": Box,
    "AI Architecture & Design": Layout,
    "AI Business & HR": Briefcase,
    "AI Legal & Finance": Gavel,
    "AI Education & Learning": GraduationCap,
    "AI Social & Dating": Heart,
    "AI Fun & Games": Gamepad2,
    "AI Travel & Lifestyle": Plane,
    "AI Healthcare": Stethoscope,
    "AI Lifestyle": Coffee,
    "AI Productivity": Zap
}

export function CategoryCard({ name, count = 0 }: CategoryCardProps) {
    const slug = name.toLowerCase().replace(/ /g, "-").replace(/\//g, "")
    const Icon = ICON_MAP[name] || Search

    return (
        <Link
            to={`/category/${slug}`}
            className="group flex flex-col justify-between p-6 rounded-2xl border border-white/5 bg-gradient-to-b from-surface to-background transition-all duration-300 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 aspect-[4/3] md:aspect-auto md:h-44"
        >
            <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-all duration-300 group-hover:scale-110">
                    <Icon className="h-5 w-5 text-primary" />
                </div>
                <ArrowRight className="h-4 w-4 text-white/20 -translate-x-2 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
            </div>

            <div>
                <h3 className="text-lg font-semibold text-white group-hover:text-primary transition-colors">{name}</h3>
                <p className="text-sm text-white/40 mt-1">{count} {count === 1 ? 'tool' : 'tools'}</p>
            </div>
        </Link>
    )
}
