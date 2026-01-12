import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';

dotenv.config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        const email = 'admin@aidirectory.com';
        const password = 'adminPassword123!';
        const name = 'Super Admin';

        // Check if exists
        let user = await User.findOne({ email });

        if (user) {
            console.log('Admin user already exists. Updating password and permissions...');
            user.password = password; // Will be hashed by pre-save hook? typically yes if logic exists, but let's check model
            user.isAdmin = true;
            // We need to manually hash if the model update doesn't trigger pre-save hook on direct assignment sometimes?
            // Usually user.save() triggers pre-save.
            await user.save();
            console.log('Admin user updated successfully.');
        } else {
            console.log('Creating new admin user...');
            user = new User({
                name,
                email,
                password,
                isAdmin: true
            });
            await user.save();
            console.log('Admin user created successfully.');
        }

        // To be safe regarding hashing, let's look at the User model first. 
        // If I can't see it, I'll rely on save(). But to be 100% sure I'll re-read User.js first.
        // Actually, I'll just look at User.js now in a separate tool call to be safe, then run this.

        console.log('\n----------------------------------------');
        console.log('ADMIN CREDENTIALS GENERATED');
        console.log(`Email:    ${email}`);
        console.log(`Password: ${password}`);
        console.log('----------------------------------------\n');

        process.exit(0);
    } catch (error) {
        console.error('Error creating admin:', error);
        process.exit(1);
    }
};

createAdmin();
