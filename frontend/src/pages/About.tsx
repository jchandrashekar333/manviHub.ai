export function About() {
    return (
        <div className="container max-w-4xl py-12 md:py-24">
            <div className="space-y-16">
                <div className="space-y-6">
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40">
                        About ManviHub.ai
                    </h1>
                    <p className="text-xl md:text-2xl text-white/70 leading-relaxed font-light">
                        ManviHub.ai was built with a simple idea: <span className="text-white font-medium italic">make discovering AI tools easy, useful, and human-friendly.</span>
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8 border-t border-white/5">
                    <div className="space-y-6">
                        <h2 className="text-2xl font-semibold text-white">Cutting Through the Noise</h2>
                        <p className="text-white/60 leading-relaxed text-lg">
                            The AI ecosystem is growing faster than ever, with thousands of tools launching across different industries. While this growth is exciting, it also creates noise and confusion. ManviHub.ai exists to cut through that noise.
                        </p>
                        <p className="text-white/60 leading-relaxed text-lg">
                            We curate, organize, and present AI tools across sectors like writing, design, development, marketing, productivity, and more — all in one clean and accessible hub. Our focus is not just listing tools, but helping people find the right tools for real-world use.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-2xl font-semibold text-white">Built for You</h2>
                        <p className="text-white/60 leading-relaxed text-lg">
                            ManviHub.ai is designed for creators, developers, founders, students, and teams who want to work smarter with AI. We believe AI should empower humans, not overwhelm them. That’s why our platform is built around clarity, usability, and thoughtful discovery.
                        </p>

                        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 mt-8">
                            <h3 className="text-white font-medium mb-4 italic text-lg">Our Mission</h3>
                            <p className="text-white/80 leading-relaxed">
                                "To create a trusted, human-first space where anyone can explore, compare, and build their AI toolkit with confidence."
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
