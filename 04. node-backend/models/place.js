const mongoose = require("mongoose");

//스키마 메서드에 액세스하는 스키마 상수 생성
const Schema = mongoose.Schema;

//진짜 스키마 생성
const placeSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  address: { type: String, required: true },
  location: {
    lat: { type: Number, required: true },
    lan: { type: Number, required: true },
  },
  creatorId: { type: String, required: true },
});

//모델 생성
mondel.exports = mongoose.model("Place", placeSchema);
