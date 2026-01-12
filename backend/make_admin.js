import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const makeAdmin = async () => {
    const email = process.argv[2];

    if (!email) {
        console.error('Please provide an email address');
        console.log('Usage: node make_admin.js <email>');

        try {
            await mongoose.connect(process.env.MONGODB_URI);
            const users = await User.find({}, 'email name isAdmin');
            console.log('\nAvailable Users:');
            users.forEach(u => console.log(`- ${u.email} (${u.name}) [Admin: ${u.isAdmin || false}]`));
        } catch (e) { }

        process.exit(1);
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const user = await User.findOne({ email });

        if (!user) {
            console.error(`User with email ${email} not found`);
            process.exit(1);
        }

        user.isAdmin = true;
        await user.save();

        console.log(`Successfully made ${user.name} (${user.email}) an admin!`);
        console.log('You can now assess the Admin Dashboard at /admin/pending');

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

makeAdmin();
