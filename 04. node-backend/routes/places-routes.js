const express = require("express");

const router = express.Router(); //특수 객체 생성

const DUMMY_PLACES = [
  {
    id: "p1",
    title: "Empire State Building",
    description: "One of the most famous sky scrapers in the world!",
    imageUrl:
      "https://lh3.googleusercontent.com/p/AF1QipPyuJVRazIvc5q3tBMmbrH25HHWvIwh8zsc9Tmn=s680-w680-h510",
    address: "20 W 34th St., New York, NY 10001",
    location: {
      lat: 40.7484405,
      lng: -73.9878584,
    },
    creatorId: "u1",
  },
  {
    id: "p2",
    title: "Emp. State Building",
    description: "One of the most famous sky scrapers in the world!",
    imageUrl:
      "https://lh3.googleusercontent.com/p/AF1QipPyuJVRazIvc5q3tBMmbrH25HHWvIwh8zsc9Tmn=s680-w680-h510",
    address: "20 W 34th St., New York, NY 10001",
    location: {
      lat: 40.7484405,
      lng: -73.9878584,
    },
    creatorId: "u2",
  },
];

//라우트, 라우트에 요청이 도달하면 실행되어야 하는 함수
router.get("/:pid", (req, res, next) => {
  //url에 인코딩된 id를 가져오기
  const placeId = req.params.pid; //{pid:'p1'}

  //원하는 id값의 장소만 추출
  const place = DUMMY_PLACES.find((p) => {
    return p.id === placeId;
  });

  //place를 찾지 못한 경우 에러 핸들링
  //비동기 코드가 존재하는 경우 next에 오류를 전달하는 방식으로 에러 처리
  if (!place) {
    const error = new Error("해당 ID에 대한 장소를 찾지 못했습니다.");
    error.code = 404; //오류 상태
    throw error;
  }
  res.json({ place: place }); //원하는 객체를 전달
});

router.get("/user/:uid", (req, res, next) => {
  const userId = req.params.uid;

  const user = DUMMY_PLACES.find((u) => {
    return u.creatorId === userId;
  });

  if (!user) {
    const error = new Error("해당 ID의 유저를 찾지 못했습니다.");
    error.code = 404; //오류 상태
    return next(error);
  }
  res.json({ user });
});

//해당 파일에서 내보내는 건 router라는 상수이다.
module.exports = router;