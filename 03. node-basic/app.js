const express = require("express");

const app = express();

//응답을 보내는 대신 다른 작업을 하는 미들웨어
app.use((req, res, next) => {
  let body = "";
  //수신 req.body파싱이 완료되면 실행되는 end 리스너
  req.on("end", () => {
    const userName = body.split("=")[1];
    if (userName) {
      req.body = { name: userName };
    }
    next(); //요청을 다음 줄에 있는 미들웨어로 포워딩, 다음 미들웨어 시작하기
  });
  req.on("data", (chunk) => {
    body += chunk;
  });
});

app.use((req, res, next) => {
  if (req.body) {
    return res.send("<h1>" + req.body.name + "</h1>");
  }
  res.send(
    "<form method='POST'><input type='text' name='username'><button type='submit'>Create User</button></form > "
  );
});

app.listen(5000);
