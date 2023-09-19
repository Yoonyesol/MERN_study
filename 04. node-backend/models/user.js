const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  image: { type: String, required: true },
  //배열: 여러 개의 장소 엔트리가 존재, ref: Place 모델과 참조관계
  places: [{ type: mongoose.Types.ObjectId, required: true, ref: "Place" }],
});

//이메일이 기존에 없을 때만 사용자를 생성할 수 있다.
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
