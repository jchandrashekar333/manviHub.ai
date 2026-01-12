import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const listUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const users = await User.find({}, 'email name isAdmin');

        console.log('\n--- REGISTERED USERS ---');
        if (users.length === 0) {
            console.log('No users found.');
        } else {
            users.forEach(u => {
                console.log(`Email: ${u.email} | Name: ${u.name} | Admin: ${u.isAdmin ? 'YES' : 'No'}`);
            });
        }
        console.log('------------------------\n');

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

listUsers();
