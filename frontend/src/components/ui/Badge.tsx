import * as React from "react"
import { cn } from "../../lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "default" | "outline" | "secondary"
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
    return (
        <div
            className={cn(
                "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                {
                    "border-transparent bg-primary text-white hover:bg-primary/80": variant === "default",
                    "border-transparent bg-white/10 text-white hover:bg-white/20": variant === "secondary",
                    "text-white/60 border-white/20": variant === "outline",
                },
                className
            )}
            {...props}
        />
    )
}

export { Badge }
