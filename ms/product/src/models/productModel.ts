import mongoose from "mongoose";
const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    creator: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    categories: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
        }
    ],
    brands: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Brand',
        }
    ],
    quantity: {
      type: Number,
      required: true,
    },
    sold: {
      type: Number,
      default: 0,
    },
    images: [
      {
        public_id: String,
        url: String,
      },
    ],
    tags: String,
    ratings: [
      {
        star: Number,
        comment: String,
        postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      },
    ],
    totalRating: {
      type: String,
      default: 0,
    },
  },
  { timestamps: true }
);

//Export the model
const Product = mongoose.model("Product", productSchema);

export default Product;
