import mongoose from 'mongoose';

export const connectDB = async () => {
    try{
        const conn =  await mongoose.connect(process.env.MONGO_URL);
        console.log(`MongoDB connected: ${conn.connection.host}`);
    }
    catch(error){
        console.log(error, "connection failed to db");
        process.exit(1); // Exit the process with failure
    }
}
