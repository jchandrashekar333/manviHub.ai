import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Tool from './models/Tool.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB for seeding...');

        // Read the tools.ts file
        const toolsPath = path.join(__dirname, '..', 'frontend', 'src', 'data', 'tools.ts');
        const toolsContent = fs.readFileSync(toolsPath, 'utf-8');

        // Extract the array using a more robust approach
        // We look for the start of the array and the end
        const startMarker = 'const INITIAL_TOOLS: Tool[] = [';
        const startIndex = toolsContent.indexOf(startMarker);

        if (startIndex === -1) {
            throw new Error('Could not find INITIAL_TOOLS in tools.ts');
        }

        // Find the matching closing bracket for the array
        const arrayStart = toolsContent.indexOf('[', startIndex);
        const arrayEnd = toolsContent.lastIndexOf('];');

        if (arrayStart === -1 || arrayEnd === -1) {
            throw new Error('Could not find start or end of INITIAL_TOOLS array');
        }

        const arrayString = toolsContent.slice(arrayStart, arrayEnd + 1);

        // Instead of new Function, let's write to a temp file and import it
        // This is much more robust for large/complex data
        const tempFilePath = path.join(__dirname, 'temp-tools.js');
        const tempFileContent = `export const tools = ${arrayString};`;
        fs.writeFileSync(tempFilePath, tempFileContent);

        const { tools } = await import('./temp-tools.js');

        // Clean up temp file
        if (fs.existsSync(tempFilePath)) {
            fs.unlinkSync(tempFilePath);
        }

        console.log(`Found ${tools.length} tools. Cleaning database...`);
        await Tool.deleteMany({});

        // Deduplicate or fix IDs before insertion
        const uniqueTools = [];
        const seenIds = new Set();
        let fixCount = 0;

        for (const tool of tools) {
            if (seenIds.has(tool.id)) {
                // If ID exists, generate a new one (using a simple suffix or random)
                tool.id = `${tool.id}_dup_${Math.random().toString(36).substr(2, 5)}`;
                fixCount++;
            }
            seenIds.add(tool.id);
            uniqueTools.push(tool);
        }

        if (fixCount > 0) {
            console.log(`Resolved ${fixCount} duplicate ID conflicts.`);
        }

        console.log('Inserting tools...');
        const result = await Tool.insertMany(uniqueTools);
        console.log(`${result.length} tools were successfully seeded to the database.`);
        process.exit(0);
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
