const express = require("express");

const placesControllers = require("../controllers/places-controller");

const router = express.Router(); //특수 객체 생성

//라우트, 라우트에 요청이 도달하면 실행되어야 하는 함수
router.get("/:pid", placesControllers.getPlaceById);

router.get("/user/:uid", placesControllers.getPlaceByUserId);

router.post("/", placesControllers.createPlace);

//해당 파일에서 내보내는 건 router라는 상수이다.
module.exports = router;
