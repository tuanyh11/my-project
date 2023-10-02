const { default: mongoose } = require("mongoose");

// mongoose.set("strictQuery", true);
const dbConnect = async () => {
  try { 
    const conn = await mongoose.connect(
      "mongodb+srv://tuanyh11:ssU21IHrQrfEnvOG@cluster0.c8nqmel.mongodb.net/?retryWrites=true&w=majority"
    );
    console.log("Database Connected Successfully");  
  } catch (error) {
    console.log(error); 
    console.log("DAtabase error");
  } 
}; 
module.exports = dbConnect;
 