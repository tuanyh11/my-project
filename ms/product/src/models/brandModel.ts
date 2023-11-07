import mongoose from "mongoose";
const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
  },
  { timestamps: true }
);

//Export the model
const Brand = mongoose.model("Brand", brandSchema);

export default Brand;
