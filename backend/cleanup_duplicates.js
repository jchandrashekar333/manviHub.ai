import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Tool from './models/Tool.js';

dotenv.config();

const cleanDuplicates = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);

        console.log('Fetching all tools...');
        const tools = await Tool.find({});
        console.log(`Total tools: ${tools.length}`);

        const urlMap = new Map();
        const duplicates = [];

        // DEDUPLICATION STRATEGY
        // 1. Normalize URLs (remove trailing slashes, www., protocol) to find true dupes
        // 2. Keep the one with the most "value" (e.g. has image, verified, etc) or just the oldest/newest

        for (const tool of tools) {
            if (!tool.url) continue;

            // Normalize URL for comparison
            // Remove http(s)://, www., and trailing slash
            const normalizedUrl = tool.url.toLowerCase()
                .replace(/^https?:\/\//, '')
                .replace(/^www\./, '')
                .replace(/\/$/, '');

            if (urlMap.has(normalizedUrl)) {
                const existing = urlMap.get(normalizedUrl);

                // Decide which one to keep
                // If existing has image and current doesn't, keep existing
                // If current has image and existing doesn't, swap
                // Otherwise, treat as duplicate
                if (!existing.image && tool.image) {
                    duplicates.push(existing._id);
                    urlMap.set(normalizedUrl, tool);
                } else {
                    duplicates.push(tool._id);
                    // Keep existing
                }
            } else {
                urlMap.set(normalizedUrl, tool);
            }
        }

        console.log(`Found ${duplicates.length} duplicates based on URL.`);

        if (duplicates.length > 0) {
            const result = await Tool.deleteMany({ _id: { $in: duplicates } });
            console.log(`Deleted ${result.deletedCount} duplicate tools.`);
        } else {
            console.log('No duplicates found.');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

cleanDuplicates();
