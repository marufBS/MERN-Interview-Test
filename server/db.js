import mongoose from "mongoose";
import dotenv from 'dotenv'

//loaging the .env file
dotenv.config()


export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || process.env.LOCAL_MONGO_URI)
    console.log(`Mongodb Connected: ${conn.connection.host}`)
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}