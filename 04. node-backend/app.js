require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const placesRoutes = require("./routes/places-routes");
const usersRoute = require("./routes/users-routes");
const HttpError = require("./models/http-error");

const app = express();

app.use(bodyParser.json());

app.use("/api/places", placesRoutes);
app.use("/api/users", usersRoute);

app.use((req, res, next) => {
  const error = new HttpError("라우트를 찾지 못했습니다.", 404);
  throw error;
});

app.use((error, req, res, next) => {
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
