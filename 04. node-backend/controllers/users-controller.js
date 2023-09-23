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
    const error = new HttpError(
      "회원가입에 실패했습니다. 잠시 후 다시 시도해 주세요.",
      500
    );
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError("이미 등록된 이메일이 존재합니다.", 422);
    return next(error);
  }

  try {
    let hashedPassword;
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError(
      "회원가입에 실패했습니다. 잠시 후 다시 시도해 주세요.",
      500
    );
    return next(error);
  }

  const createdUser = new User({
    name,
    email,
    image: req.file.path, //서버 상의 이미지 경로
    password: hashedPassword,
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

  //유효한 사용자인지 확인하고 토큰 생성
  let token;
  try {
    token = jwt.sign(
      {
        userId: createdUser.id,
        email: createdUser.email,
      },
      process.env.REACT_APP_GOOGLE_MAP_API_KEY,
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError(
      "회원가입에 실패했습니다. 재시도 해주세요.",
      500
    );
    return next(error);
  }

  //프론트엔드로 반환할 데이터
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

  //이메일 존재 여부 검사
  if (!existingUser) {
    const error = new HttpError(
      "존재하지 않는 이메일입니다. 회원가입 해주세요.",
      401
    );
    return next(error);
  }

  //db에 저장된 비밀번호와 같은지 확인
  let isValidPassword = false; //처음에 false로 초기화
  try {
    //평문 비밀번호(새로 입력받은 비번)와 해시 암호(db에 저장된 비번)를 비교해 isValidPassword에 bool값 저장
    //두 값이 다르면 isValidPassword=false
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    const error = new HttpError(
      "로그인에 실패했습니다. 잠시 후 다시 시도해 주세요.",
      500
    );
  }

  if (!isValidPassword) {
    const error = new HttpError(
      "비밀번호가 일치하지 않습니다. 다시 확인해주세요.",
      401
    );
    return next(error);
  }

  //이메일 검증과 비밀번호 검증 모두 통과한 경우 토큰 생성
  let token;
  try {
    token = jwt.sign(
      {
        userId: existingUser.id,
        email: existingUser.email,
      },
      process.env.REACT_APP_GOOGLE_MAP_API_KEY,
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError("로그인에 실패했습니다. 재시도 해주세요.", 500);
    return next(error);
  }

  res.json({
    userId: existingUser.id,
    email: existingUser.email,
    token: token,
  });
};

exports.getUsers = getUsers;
exports.login = login;
exports.signup = signup;
