const { v4: uuid } = require("uuid");
const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const User = require("../models/user");

const DUMMY_USERS = [
  { id: "u1", name: "john", email: "test@google.com", password: "123456" },
];

const getUsers = (req, res, next) => {
  res.json({ users: DUMMY_USERS });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("유효하지 않은 데이터가 존재합니다.", 422));
  }

  const { name, email, password, places } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("회원가입에 실패했습니다", 500);
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError("이미 등록된 이메일이 존재합니다.", 422);
    return next(error);
  }

  const createdUser = new User({
    name,
    email,
    image:
      "https://image.utoimage.com/preview/cp872722/2022/12/202212008462_500.jpg",
    password,
    places,
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError(
      "회원가입에 실패했습니다. 재시도 해주세요.",
      500
    );
    return next(error);
  }

  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  const identifiedUser = DUMMY_USERS.find((u) => u.email === email);
  if (!identifiedUser || identifiedUser.password !== password) {
    throw new HttpError("로그인 정보가 일치하지 않습니다.", 401);
  }
  res.json({ message: "로그인 성공!" });
};

exports.getUsers = getUsers;
exports.login = login;
exports.signup = signup;
