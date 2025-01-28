import mongoose, { mongo } from "mongoose";
import dotenv from "dotenv"

dotenv.config()

export const connectToDatabase = async () => {
    try {
        await mongoose.connect(process.env.DB_CONNECT_STRING)
        console.log("Connected to database successfully")
    }
    catch (error) {
        console.log(error)
    }
}
