import mongoose from "mongoose";

const foodSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    description: { type: String },
    image: { type: String }, // Ensure this matches "image" in addFood
  },
  { timestamps: true }
);

const foodModel = mongoose.model("Food", foodSchema);

export default foodModel;
