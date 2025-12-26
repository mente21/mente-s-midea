import mongoose from 'mongoose';

let isConnected = false;

const connectDB = async () => {
    if (isConnected) return;

    try {
        await mongoose.connect(process.env.MONGODB_URL, {
            dbName: "pingup"
        });
        isConnected = true;
        console.log('database connected');
    } catch (error) {
        console.log("DB Connection Error:", error.message);
    }
}

export default connectDB;