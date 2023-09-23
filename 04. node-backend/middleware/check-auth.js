require("dotenv").config();

const jwt = require("jsonwebtoken");

const HttpError = require("../models/http-error");

module.exports = (req, res, next) => {
  //서버에게 확인을 위해 보내는 options요청을 차단하지 않도록 처리
  if (req.method === "OPTIONS") {
    return next(); //다음 요청 처리하도록
  }

  try {
    //새로 들어온 요청에서 토큰을 추출(헤더에 토큰을 인코딩)
    const token = req.headers.authorization.split(" ")[1]; //Authorization: Bearer token
    //토큰이 없거나 정의되어 있지 않은 경우
    if (!token) {
      throw new Error("인증에 실패했습니다!");
    }
    //토큰 검증. 반환값은 토큰에 부호화된 페이로드
    const decodedToken = jwt.verify(
      //사용자 ID와 이메일을 얻을 수 있다.
      token,
      process.env.JWT_KEY
    );
    req.userData = { userId: decodedToken.userId }; //userData로 사용자 id 추출 가능
    next(); //인증을 요구하는 다른 라우트 중 어디로든 갈 수 있게 함
  } catch (err) {
    const error = new HttpError("인증에 실패했습니다!", 401);
    return next(error);
  }
};
