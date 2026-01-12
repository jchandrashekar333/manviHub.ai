import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { CATEGORIES } from "../data/tools"
import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import { submissionsApi } from "../lib/api"
import { useOutletContext } from "react-router-dom"

export function Submit() {
    const { isAuthenticated } = useAuth()
    const { openAuthModal } = useOutletContext<{ openAuthModal: () => void }>()
    const [submitted, setSubmitted] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const [formData, setFormData] = useState({
        name: '',
        url: '',
        category: '',
        description: '',
        isPaid: false
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (!isAuthenticated) {
            openAuthModal()
            return
        }

        if (!formData.category) {
            setError('Please select a category')
            return
        }

        setLoading(true)
        try {
            await submissionsApi.submit({
                name: formData.name,
                description: formData.description,
                category: formData.category,
                url: formData.url,
                isPaid: formData.isPaid
            })
            setSubmitted(true)
            setFormData({ name: '', url: '', category: '', description: '', isPaid: false })
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to submit tool')
        } finally {
            setLoading(false)
        }
    }

    if (submitted) {
        return (
            <div className="container py-24 text-center max-w-lg">
                <div className="bg-surface border border-white/5 p-8 rounded-xl">
                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-4">Submission Received!</h1>
                    <p className="text-white/60 mb-6">
                        Thanks for submitting a tool! We review every submission to ensure it meets our quality standards.
                        You'll be notified once it's approved.
                    </p>
                    <Button onClick={() => setSubmitted(false)} variant="outline">Submit another</Button>
                </div>
            </div>
        )
    }

    return (
        <div className="container max-w-xl py-12 md:py-20">
            <div className="mb-10 text-center">
                <h1 className="text-3xl font-bold text-white tracking-tight mb-4">Submit a Tool</h1>
                <p className="text-white/60">
                    Found a great AI tool? Let us know. We review all submissions within 48 hours.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 bg-surface p-8 rounded-xl border border-white/5">
                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-white/80">Tool Name *</label>
                    <Input
                        id="name"
                        required
                        placeholder="e.g. Midjourney"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="url" className="text-sm font-medium text-white/80">Website URL *</label>
                    <Input
                        id="url"
                        required
                        type="url"
                        placeholder="https://..."
                        value={formData.url}
                        onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="category" className="text-sm font-medium text-white/80">Category *</label>
                    <select
                        id="category"
                        required
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="flex h-10 w-full rounded-md border border-white/10 bg-surface px-3 py-2 text-sm text-white/90 focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                        <option value="">Select a category</option>
                        {CATEGORIES.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                <div className="space-y-2">
                    <label htmlFor="desc" className="text-sm font-medium text-white/80">Short Description *</label>
                    <textarea
                        id="desc"
                        required
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="flex min-h-[100px] w-full rounded-md border border-white/10 bg-surface px-3 py-2 text-sm text-white/90 placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                        placeholder="What does this tool do? (50-200 characters)"
                        maxLength={200}
                    />
                    <p className="text-xs text-white/40">{formData.description.length}/200 characters</p>
                </div>

                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="isPaid"
                        checked={formData.isPaid}
                        onChange={(e) => setFormData({ ...formData, isPaid: e.target.checked })}
                        className="w-4 h-4 rounded border-white/10 bg-surface text-primary focus:ring-2 focus:ring-primary"
                    />
                    <label htmlFor="isPaid" className="text-sm text-white/80">This is a paid tool</label>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Submitting...' : 'Submit Tool'}
                </Button>

                <p className="text-xs text-center text-white/30">
                    By submitting, you agree that the information is accurate and the tool is legitimate.
                </p>
            </form>
        </div>
    )
}
