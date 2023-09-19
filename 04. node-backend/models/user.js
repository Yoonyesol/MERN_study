const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  image: { type: String, required: true },
  places: { type: String, required: true },
});

//이메일이 기존에 없을 때만 사용자를 생성할 수 있다.
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
