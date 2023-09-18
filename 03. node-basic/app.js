const express = require("express");
const bodyParser = require("body-parser");

const app = express();

//응답을 보내는 대신 다른 작업을 하는 미들웨어
app.use(bodyParser.urlencoded({ extended: false }));

//POST
app.post("/user", (req, res, next) => {
  res.send("<h1> User:" + req.body.username + "</h1>");
});

//GET
app.get("/", (req, res, next) => {
  res.send(
    "<form action='/user' method='POST'><input type='text' name='username'><button type='submit'>Create User</button></form > "
  );
});

app.listen(5000);
