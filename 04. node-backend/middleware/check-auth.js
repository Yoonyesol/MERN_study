const jwt = require("jsonwebtoken");

const HttpError = require("../models/http-error");

module.exports = (req, res, next) => {
  try {
    //새로 들어온 요청에서 토큰을 추출(헤더에 토큰을 인코딩)
    const token = req.headers.authorization.split(" ")[1]; //Authorization: Bearer token
    if (!token) {
      throw new Error("인증에 실패했습니다!");
    }
    const decodedToken = jwt.verify(token, "supersecret_dont_share"); //토큰 검증. 반환값은 토큰에 부호화된 페이로드
    req.userData = { userId: decodedToken.userId }; //사용자 id 추출
    next(); //인증을 요구하는 다른 루트 중 어디로든 갈 수 있게 함
  } catch (err) {
    const error = new HttpError("인증에 실패했습니다!", 401);
  }
  return next(error);
};
