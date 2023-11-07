import mongoose from "mongoose";

const mongodbConnect = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/test");
        console.log("db connection established")
    } catch (error) {
        console.log("connection error: " + error);
    }
}

export default mongodbConnect