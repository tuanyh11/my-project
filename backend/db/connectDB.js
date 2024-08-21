import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";

const connectDB = async () => {
  console.log(process.env.MONGO_DB_URI);

  try {
    const conn = await mongoose.connect(process.env.MONGO_DB_URI, {
      // To avoid warnings in the console
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
