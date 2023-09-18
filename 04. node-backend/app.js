const express = require("express");
const bodyParser = require("body-parser");

const placesRoutes = require("./routes/places-routes");
const HttpError = require("./models/http-error");

const app = express();

//본문을 먼저 파싱->본문의 json 데이터를 추출해서 객체나배열같이 일반적인 js 구조로 변환
app.use(bodyParser.json());

//경로가 /api/places로 시작된다면 placesRoutes 실행
app.use("/api/places", placesRoutes);

//앞선 routes 중 응답을 전송하지 않았을 때만 실행
app.use((req, res, next) => {
  const error = new HttpError("라우트를 찾지 못했습니다.", 404);
  throw error; //동기 방식으로 코드가 실행되므로 throw 사용
});

//매개변수 4개: 오류 처리 미들웨어 함수
//앞의 미들웨어 함수에서 오류가 발생했을 때만 실행된다.
app.use((error, req, res, next) => {
  //응답이 이미 전송되었는지 확인
  if (res.headerSent) {
    return next(error);
  }
  //응답이 전송되지 않은 경우
  //상태 코드가 정의된 경우에는 코드를, 아닌 경우에는
  //서버에 어떤 문제가 있음을 알려주는 기본상태코드 500이 반환되도록 함
  res.status(error.code || 500);
  res.json({ message: error.message || "정의되지 않은 에러 발생" });
});

app.listen(5000);
