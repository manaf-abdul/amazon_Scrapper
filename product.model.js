const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
    title: { type: String, required: true },
    weight: { type: String },
    price: { type: String, default: null },
    ingredients: {type: String, default: null },
    product_dimensions: { type: String, default: null },
    manufacturer: { type: String, default: null },
    nutrition: { type: String, default: null },
    additives: { type: String, default: null },
    about: { type: [], default: null},
    image: { type: String, default: null },
    ingredient_type: { type: String, default: null },
    diet_type: { type: String, default: null },
});

productSchema.index({ created_ts: -1 });
productSchema.index({ updated_ts: -1 });
productSchema.index({ updated_ts: -1, created_ts: -1 });

module.exports = mongoose.model("Product", productSchema);