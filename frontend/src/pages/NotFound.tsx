import { Link } from "react-router-dom"
import { Button } from "../components/ui/Button"

export function NotFound() {
    return (
        <div className="container flex flex-col items-center justify-center py-32 text-center">
            <h1 className="text-9xl font-bold text-white/10">404</h1>
            <h2 className="text-2xl font-bold text-white mt-8 mb-4">Page not found</h2>
            <p className="text-white/60 mb-8 max-w-md">
                The page you are looking for doesn't exist or has been moved.
            </p>
            <Link to="/">
                <Button>Go back to Home</Button>
            </Link>
        </div>
    )
}
