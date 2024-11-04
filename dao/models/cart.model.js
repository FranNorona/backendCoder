import mongoose from "mongoose";

mongoose.pluralize(null);

const collection = "carts";

const schema = new mongoose.Schema({
  cartId: { type: Number, required: true, unique: true },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
        required: true,
      },
      quantity: { type: Number, required: true },
    },
  ],
});

const model = mongoose.model(collection, schema);

export default model;
