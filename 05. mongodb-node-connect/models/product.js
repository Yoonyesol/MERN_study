const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, require: true },
  price: { type: Number, require: true },
});

//스키마 이름, 스키마 모델
module.exports = mongoose.model("Product", productSchema);
