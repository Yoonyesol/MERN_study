const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const HttpError = require("../models/http-error");
const User = require("../models/user");

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (err) {
    const error = new HttpError("유저 정보를 가져오는 데 실패했습니다.", 500);
    return next(error);
  }
  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("유효하지 않은 데이터가 존재합니다.", 422));
  }

  const { name, email, password } = req.body;

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

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError("유저를 생성할 수 없습니다.", 500);
    return next(error);
  }

  const createdUser = new User({
    name,
    email,
    image: req.file.path, //서버 상의 이미지 경로
    password: hashedPassword, //비밀번호를 평문으로 저장해서는 안됨
    places: [], //새 장소가 추가되면 자동으로 배열에 추가
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

  let token;
  try {
    token = jwt.sign(
      { userId: createdUser.id, email: createdUser.email }, //토큰에 인코딩할 정보
      "supersecret_dont_share", //private key: 아무 문자열이나 입력(키 생성을 위해)
      { expiresIn: "1h" } //만료기간
    );
  } catch (err) {
    const error = new HttpError(
      "회원가입에 실패했습니다. 재시도 해주세요.",
      500
    );
    return next(error);
  }

  res
    .status(201)
    .json({ userId: createdUser.id, email: createdUser.email, token: token });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  //이메일이 존재하는지 검증
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("로그인에 실패했습니다", 500);
    return next(error);
  }

  //이메일 존재 여부, 아이디-비밀번호가 일치하는지 검사
  if (!existingUser) {
    const error = new HttpError(
      "이메일 혹은 비밀번호가 일치하지 않습니다.",
      401
    );
    return next(error);
  }

  let isValidPassword = false;
  try {
    //입력받은 비밀번호와 기존 사용자의 비밀번호 비교
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    const error = new HttpError(
      "일치하지 않는 비밀번호입니다. 다시 확인하고 시도해주세요.",
      500
    );
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError(
      "이메일 혹은 비밀번호가 일치하지 않습니다.",
      401
    );
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      "supersecret_dont_share", //signup에서 설정한 private key와 동일하게 설정해야 한다.
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError("로그인에 실패했습니다. 재시도 해주세요.", 500);
    return next(error);
  }

  res.json({
    user: existingUser.id,
    email: existingUser.email,
    token: token,
  });
};

exports.getUsers = getUsers;
exports.login = login;
exports.signup = signup;
