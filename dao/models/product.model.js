import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const collection = "products";

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
  status: { type: Boolean, required: true },
  stock: { type: Number, required: true },
  category: { type: String, required: true },
  thumbnails: [String],
});

productSchema.plugin(mongoosePaginate);

const model = mongoose.model(collection, productSchema);

export default model;
