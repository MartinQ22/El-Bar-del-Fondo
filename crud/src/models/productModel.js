import mongoose from "mongoose";
import  paginate  from "mongoose-paginate-v2";

const productSchema = new mongoose.Schema({
    title: String,
    description: { type: String, index: "text" },
    thumbnail: {type: String, default: "" },
    code: {type: String, unique: true },
    price: Number,
    category: { type: String, index: true },
    stock: Number,
    status: {
        type: Boolean,
        default: true,
        required: false
    },
    created_at: {
        type: Date,
        default: Date.now()
    }
});

productSchema.plugin(paginate);

const Product = mongoose.model("Product", productSchema);

export default Product;