const express = require("express");
const { check } = require("express-validator");

const placesControllers = require("../controllers/places-controller");
const fileUpload = require("../middleware/file-upload");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

//누구나 요청을 보낼 수 있다.
router.get("/:pid", placesControllers.getPlaceById);

router.get("/user/:uid", placesControllers.getPlacesByUserId);

//use: 이 미들웨어에 도달하는 모든 요청에 미들웨어를 추가할 수 있다.
//유효한 토큰이 없는 요청은 use() 미들웨어가 처리하므로 하단의 라우트까지 갈 일이 없다.
router.use(checkAuth);

//위의 미들웨어에 의해 보호받는다.(접근하기 위해서는 유효한 토큰이 있어야 함)
router.post(
  "/",
  fileUpload.single("image"),
  [
    check("title").not().isEmpty(),
    check("description").isLength({ min: 5 }),
    check("address").not().isEmpty(),
  ],
  placesControllers.createPlace
);

router.patch(
  "/:pid",
  [check("title").not().isEmpty(), check("description").isLength({ min: 5 })],
  placesControllers.updatePlace
);

router.delete("/:pid", placesControllers.deletePlace);

module.exports = router;
