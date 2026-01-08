import mongoose from 'mongoose';


export const dbConnection = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB_URI);
        console.log("Database Connected!")
    } catch (error) {
        console.log("DB connection error", error)
    }
}
