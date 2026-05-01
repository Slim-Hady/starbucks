import 'dotenv/config';
import {app} from './app';
import mongoose from 'mongoose';

const PORT = process.env.PORT || 3001;
const DB =  process.env.DATABASE_LOCAL;

async function startServer() {
    try {
        await mongoose.connect(DB!);
        console.log('Connect with database');

        app.listen(PORT , () => {
            return console.log(`App is running on Port ${PORT}`);
        });
    }
    catch (err) {
        console.log(err);
    }
}

startServer();