import mongoose from "mongoose";
import ENV from "./ENV";

export default async function connectDb() {
  try {
    await mongoose.connect(ENV.MONGO_URL);
    console.log("Database connection established 🚀");
  } catch (error: any) {
    console.log("Error connecting to database", error.message);
  }
}
