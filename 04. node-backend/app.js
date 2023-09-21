require("dotenv").config();

const fs = require("fs");
const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const placesRoutes = require("./routes/places-routes");
const usersRoute = require("./routes/users-routes");
const HttpError = require("./models/http-error");

const app = express();

app.use(bodyParser.json());

//요청한 파일을 반환하는 미들웨어. static serving: 요청이 있을 때, 파일을 실행없이 반환만 한다는 의미. 실행 없
app.use("/uploads/images", express.static(path.join("uploads", "images"))); ///uploads/images폴더를 가리키는 새로운 경로가 구축

//cors 에러 해결
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  next();
});

app.use("/api/places", placesRoutes);
app.use("/api/users", usersRoute);

app.use((req, res, next) => {
  const error = new HttpError("라우트를 찾지 못했습니다.", 404);
  throw error;
});

app.use((error, req, res, next) => {
  //요청에 파일 존재 시
  if (req.file) {
    //파일 삭제
    fs.unlink(req.file.path, (err) => {
      console.log(err);
    });
  }

  if (res.headerSent) {
    return next(error);
  }

  res.status(error.code || 500);
  res.json({ message: error.message || "정의되지 않은 에러 발생" });
});

mongoose
  .connect(
    `mongodb+srv://user03:${process.env.DB_PW}@cluster0.mqq5hvg.mongodb.net/mern?retryWrites=true&w=majority`
  )
  .then(() => {
    //db 연결이 성공할 경우 서버 연결
    app.listen(5000);
  })
  .catch((err) => {
    console.log(err);
  });
