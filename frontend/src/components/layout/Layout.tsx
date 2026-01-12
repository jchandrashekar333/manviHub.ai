import { Header } from "./Header"
import { Footer } from "./Footer"
import { Outlet } from "react-router-dom"
import { AuthModal } from "../auth/AuthModal"
import { Toast } from "../ui/Toast"
import { useState } from "react"

export function Layout() {
    const [showAuthModal, setShowAuthModal] = useState(false)
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

    const handleAuthSuccess = () => {
        setToast({ message: 'Successfully signed in!', type: 'success' })
    }

    return (
        <div className="min-h-screen bg-background text-white selection:bg-primary/30 flex flex-col font-sans relative overflow-x-hidden">
            {/* Background Gradients */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]" />
                <div className="absolute top-[20%] right-[-10%] w-[30%] h-[30%] rounded-full bg-secondary/5 blur-[120px]" />
            </div>

            <Header onAuthClick={() => setShowAuthModal(true)} />
            <main className="flex-1 relative z-10">
                <Outlet context={{ openAuthModal: () => setShowAuthModal(true) }} />
            </main>
            <Footer />

            <AuthModal
                isOpen={showAuthModal}
                onClose={() => setShowAuthModal(false)}
                onSuccess={handleAuthSuccess}
            />

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    )
}
