import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Tool from './models/Tool.js';

dotenv.config();

const GITHUB_README_URL = 'https://raw.githubusercontent.com/yousefebrahimi0/1000-AI-collection-tools/main/README.md';

// Map GitHub categories to our categories
const categoryMap = {
    "Animation & 3D Modeling": "AI 3D & Animation",
    "Architecture & Interior Design": "AI Architecture & Design",
    "Art & Image Generator": "AI Image Tools",
    "Audio & Voice": "AI Audio / Music",
    "Audio Editing": "AI Audio / Music",
    "Avatar": "AI 3D & Animation",
    "Video Generator": "AI Video Tools",
    "Video Editing": "AI Video Tools",
    "Copywriting": "AI Writing Tools",
    "General Writing": "AI Writing Tools",
    "Paraphrasing": "AI Writing Tools",
    "Storyteller": "AI Writing Tools",
    "Summarizer": "AI Writing Tools",
    "Prompt Guides": "AI Prompt Generators",
    "Search Engine": "AI Search Engines",
    "SEO": "AI SEO Tools",
    "Social Media Assistant": "AI Social Media",
    "Developer Tools": "AI Developer Tools",
    "Code Assistant": "AI Developer Tools",
    "No Code": "AI Developer Tools",
    "Design Assistant": "AI Architecture & Design",
    "Gaming": "AI Fun & Games",
    "Life Assistant": "AI Productivity",
    "Memory Assistant": "AI Productivity",
    "Productivity": "AI Productivity",
    "Presentation": "AI Business & HR",
    "Finance": "AI Finance",
    "Human Resources": "AI Business & HR",
    "Legal Assistant": "AI Legal",
    "Education Assistant": "AI Education & Learning",
    "Transcriber": "AI Audio / Music",
    "Text-To-Speech": "AI Audio / Music",
    "Text-To-Video": "AI Video Tools",
    "Image Editing": "AI Image Tools",
    "Logo Generator": "AI Image Tools",
    "Pixel Art": "AI Image Tools",
    "Music": "AI Audio / Music",
    "Spreadsheets": "AI Business & HR",
    "Startup": "AI Business & HR",
    "Customer Support": "AI Customer Support",
    "Sales": "AI Business & HR",
    "Email Assistant": "AI Writing Tools",
    "Fashion": "AI Lifestyle",
    "Gift Ideas": "AI Lifestyle",
    "Healthcare": "AI Healthcare",
    "Resume": "AI Business & HR",
    "SQL": "AI Developer Tools",
    "Travel": "AI Travel & Lifestyle",
    "Real Estate": "AI Business & HR",
    "Research": "AI Research",
    "Experiments": "AI Research"
};

const importTools = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected!');

        console.log('Fetching README...');
        const response = await fetch(GITHUB_README_URL);
        const text = await response.text();

        console.log('Parsing content...');
        const tools = [];
        const lines = text.split('\n');

        let currentCategory = 'Other';
        let tableHeaderFound = false;

        // Simple line parser
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();

            // Checking for Headers
            if (line.startsWith('## ') || line.startsWith('### ')) {
                const headerText = line.replace(/#/g, '').trim();
                // Filter out non-category headers
                if (!['Index', 'Table of Contents', 'Contributing', 'License', 'Credit'].includes(headerText)) {
                    // Try to match or use default
                    currentCategory = categoryMap[headerText] || headerText;
                    // Normalize unknown categories to "Other" or keep specific? 
                    // Let's keep specific to see what we get, or map to 'AI Productivity' as fallback
                    if (!categoryMap[headerText] && !headerText.toLowerCase().includes('tool')) {
                        // Heuristic: if it's a short header, it's likely a category
                    }
                }
            } else if (line.startsWith('<h2>') || line.startsWith('<h3>')) {
                const headerText = line.replace(/<[^>]*>/g, '').trim();
                if (!['Index'].includes(headerText)) {
                    currentCategory = categoryMap[headerText] || headerText;
                }
            }

            // Detect table row: | Name | ... | ... |
            if (line.startsWith('|') && line.includes('|') && line.length > 10) {
                // Check if it's a header row or separator
                if (line.includes('---')) continue;
                if (line.toLowerCase().includes('short description')) {
                    tableHeaderFound = true;
                    continue;
                }

                const cells = line.split('|').map(c => c.trim()).filter(c => c !== '');

                if (cells.length >= 2) {
                    // Extract Name and URL from first cell: [Name](url) or <a href="url">Name</a>
                    const firstCell = cells[0];
                    let name = '';
                    let url = '';

                    // Markdown link
                    const mdMatch = firstCell.match(/\[(.*?)\]\((.*?)\)/);
                    if (mdMatch) {
                        name = mdMatch[1];
                        url = mdMatch[2];
                    } else {
                        // HTML link
                        const htmlMatch = firstCell.match(/href="(.*?)"/);
                        const nameMatch = firstCell.match(/>(.*?)</);
                        if (htmlMatch && nameMatch) {
                            url = htmlMatch[1];
                            name = nameMatch[1];
                        } else {
                            // Plain text?
                            name = firstCell;
                        }
                    }

                    // Clean up URL
                    if (url && (url.startsWith('#') || url.includes('github.com/yousefebrahimi0'))) continue; // skip anchor links

                    // Description: typically 2nd and/or 3rd cell
                    let description = cells[1] || '';
                    if (cells.length > 2) {
                        description += '. ' + cells[2];
                    }

                    if (name && url && description) {
                        // Clean data
                        name = name.replace(/<[^>]*>/g, '').trim(); // Remove any remaining HTML
                        description = description.replace(/<[^>]*>/g, '').trim(); // Remove HTML

                        // Final category cleanup
                        let finalCat = categoryMap[currentCategory] || "AI Productivity"; // Default fallback

                        // Try to find a better match if valid category exists in our system
                        // Check if currentCategory is already one of our known categories?
                        // For now we map to "AI Productivity" if unknown, or keep it if it looks valid
                        if (Object.values(categoryMap).includes(currentCategory)) {
                            finalCat = currentCategory;
                        }

                        tools.push({
                            name,
                            description: description.substring(0, 500), // Limit length
                            category: finalCat,
                            url,
                            isPaid: false, // Default
                            likes: 0,
                            likedBy: []
                        });
                    }
                }
            }
        }

        console.log(`Found ${tools.length} tools.`);

        // Remove duplicates based on URL or Name
        const uniqueTools = Array.from(new Map(tools.map(item => [item.url, item])).values());
        console.log(`Unique tools: ${uniqueTools.length}`);

        // Get max ID to start from - Fetch all IDs to ensure we get the true math max
        const allTools = await Tool.find({}, 'id');
        let maxId = 0;
        for (const t of allTools) {
            const num = parseInt(t.id);
            if (!isNaN(num) && num > maxId) maxId = num;
        }
        let nextId = maxId + 1;

        console.log(`Starting insertion from ID: ${nextId}`);

        // Insert in batches
        const docs = uniqueTools.map(t => ({
            ...t,
            id: String(nextId++)
        }));

        // Upsert logic: Check if URL exists, if so skip, else insert
        // Actually, let's just insert new ones to avoid overwriting existing curated data
        // Or check existing URLs in DB
        const existingUrls = new Set(
            (await Tool.find({}, 'url')).map(t => t.url.replace(/\/$/, '')) // normalize trailing slash
        );

        const newTools = docs.filter(t => !existingUrls.has(t.url.replace(/\/$/, '')));
        console.log(`New tools to insert: ${newTools.length}`);
        console.log(`Skipped ${docs.length - newTools.length} existing tools.`);

        if (newTools.length > 0) {
            await Tool.insertMany(newTools);
            console.log('Successfully imported tools!');
        } else {
            console.log('No new tools to import.');
        }

        process.exit(0);
    } catch (error) {
        console.error('Import error:', error);
        process.exit(1);
    }
};

importTools();
