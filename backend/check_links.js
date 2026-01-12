import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Tool from './models/Tool.js';
import fetch from 'node-fetch';
import { PromisePool } from '@supercharge/promise-pool';

dotenv.config();

// Helper to check a single URL
const checkUrl = async (url) => {
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 8000); // 8s timeout

        const response = await fetch(url, {
            method: 'HEAD',
            signal: controller.signal,
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ToolChecker/1.0' }
        });
        clearTimeout(timeout);

        if (response.ok) return { status: 'ok' };

        // If HEAD fails (some servers block it), try GET
        if (response.status === 405 || response.status === 403 || response.status === 404) {
            // Retry with GET for 405/403, but 404 is likely real
            if (response.status === 404) return { status: 'dead', code: 404 };

            const controller2 = new AbortController();
            const timeout2 = setTimeout(() => controller2.abort(), 8000);
            try {
                const response2 = await fetch(url, {
                    method: 'GET',
                    signal: controller2.signal,
                    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ToolChecker/1.0' }
                });
                clearTimeout(timeout2);
                if (response2.ok) return { status: 'ok' };
                return { status: 'dead', code: response2.status };
            } catch (e) {
                clearTimeout(timeout2);
                return { status: 'dead', error: e.message };
            }
        }

        return { status: 'dead', code: response.status };

    } catch (error) {
        // ENOTFOUND = DNS error (domain gone)
        // ECONNREFUSED = Server down
        return { status: 'dead', error: error.message };
    }
};

const cleanBrokenLinks = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const tools = await Tool.find({});
        console.log(`Checking ${tools.length} tools...`);

        const brokenTools = [];

        // Check in batches of 20
        const { results, errors } = await PromisePool
            .withConcurrency(20)
            .for(tools)
            .process(async (tool) => {
                if (!tool.url) return;

                // Skip known problematic but likely valid ones if we want, or just check all
                const result = await checkUrl(tool.url);
                if (result.status === 'dead') {
                    // console.log(`Broken: ${tool.name} (${tool.url}) - ${result.code || result.error}`);
                    process.stdout.write('x');
                    return { id: tool._id, name: tool.name, url: tool.url, reason: result.code || result.error };
                } else {
                    process.stdout.write('.');
                }
            });

        const dead = results.filter(Boolean);
        console.log(`\n\nFound ${dead.length} broken tools.`);

        // Filter for high confidence deletions
        // 404s, ENOTFOUND (domain missing)
        const toDelete = dead.filter(t => {
            const r = String(t.reason);
            return r === '404' || r.includes('ENOTFOUND') || r.includes('ECONNREFUSED');
        });

        console.log(`High confidence broken (404/DNS): ${toDelete.length}`);

        if (toDelete.length > 0) {
            console.log('Deleting high confidence broken tools...');
            const ids = toDelete.map(t => t.id);
            await Tool.deleteMany({ _id: { $in: ids } });
            console.log(`Deleted ${toDelete.length} tools.`);
        }

        process.exit(0);

    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

cleanBrokenLinks();
