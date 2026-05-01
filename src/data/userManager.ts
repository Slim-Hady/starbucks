import { User } from '../models/User';
import users from './users.json';
import mongoose from 'mongoose';
import 'dotenv/config';

const mongoUri = process.env.DATABASE || process.env.DATABASE_LOCAL;

async function connectDB() {
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(mongoUri!);
        console.log('Connected to MongoDB');
    }
}

async function importUsers() {
    await connectDB();
    try {
        await User.insertMany(users, { ordered: false });
        console.log(`${users.length} users imported successfully`);
    } catch (error: any) {
        if (error.code === 11000) {
            console.log('Some users already exist, skipping duplicates');
        } else {
            console.error('Error importing users:', error.message);
        }
    }
}

async function updateUser(email: string, updateData: Partial<typeof users[0]>) {
    await connectDB();
    const result = await User.findOneAndUpdate(
        { email },
        { $set: updateData },
        { new: true }
    );
    if (result) {
        console.log(`User ${email} updated:`, result);
    } else {
        console.log(`User ${email} not found`);
    }
}

async function deleteUser(email: string) {
    await connectDB();
    const result = await User.findOneAndDelete({ email });
    if (result) {
        console.log(`User ${email} deleted`);
    } else {
        console.log(`User ${email} not found`);
    }
}

async function deleteAllUsers() {
    await connectDB();
    const result = await User.deleteMany({});
    console.log(`${result.deletedCount} users deleted`);
}

async function main() {
    const command = process.argv[2];
    const args = process.argv.slice(3);

    try {
        switch (command) {
            case 'import':
                await importUsers();
                break;
            case 'update':
                if (args.length < 2) {
                    console.log('Usage: npm run data update <email> <field>=<value>');
                    process.exit(1);
                }
                const email = args[0];
                const updates: any = {};
                args.slice(1).forEach(arg => {
                    const [key, value] = arg.split('=');
                    updates[key] = value;
                });
                await updateUser(email, updates);
                break;
            case 'delete':
                if (!args[0]) {
                    console.log('Usage: npm run data delete <email>');
                    process.exit(1);
                }
                await deleteUser(args[0]);
                break;
            case 'deleteAll':
                await deleteAllUsers();
                break;
            default:
                console.log('Commands: import, update <email> <field>=<value>, delete <email>, deleteAll');
        }
    } catch (error: any) {
        console.error('Error:', error.message);
    } finally {
        await mongoose.disconnect();
    }
}

main();