const express = require("express");

const router = express.Router(); //특수 객체 생성

//라우트, 라우트에 요청이 도달하면 실행되어야 하는 함수
router.get("/", (req, res, next) => {
  console.log("GET Request in places");
  res.json({ message: "작동됨" }); //원하는 객체를 전달
});

//해당 파일에서 내보내는 건 router라는 상수이다.
module.exports = router;
