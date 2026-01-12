import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const updateRole = async () => {
    const email = process.argv[2] || 'admin@example.com';
    const role = process.argv[3] || 'admin';

    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const user = await User.findOne({ email });

        if (!user) {
            console.error(`User with email ${email} not found`);
            process.exit(1);
        }

        user.role = role;
        user.isAdmin = (role === 'admin'); // Keep isAdmin in sync for legacy code
        await user.save();

        console.log(`Successfully updated ${user.email} to role: ${role}`);
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

updateRole();
