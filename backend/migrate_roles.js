import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const migrateRoles = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        console.log('Migrating user roles...');

        // Update Admins
        const adminResult = await User.updateMany(
            { isAdmin: true },
            { $set: { role: 'admin' } }
        );
        console.log(`Updated ${adminResult.modifiedCount} admins.`);

        // Update Users (who don't have a role yet)
        const userResult = await User.updateMany(
            { role: { $exists: false } },
            { $set: { role: 'user' } }
        );
        console.log(`Updated ${userResult.modifiedCount} regular users.`);

        // Force update explicitly for safety if updateMany didn't catch all edge cases
        // (e.g. if isAdmin was missing)
        const allUsers = await User.find({});
        for (const u of allUsers) {
            if (!u.role) {
                u.role = u.isAdmin ? 'admin' : 'user';
                await u.save();
            }
        }

        console.log('Migration complete.');
        process.exit(0);
    } catch (error) {
        console.error('Migration error:', error);
        process.exit(1);
    }
};

migrateRoles();
