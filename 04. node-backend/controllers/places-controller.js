const { v4: uuid } = require("uuid");

const HttpError = require("../models/http-error");

let DUMMY_PLACES = [
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

const getPlaceById = (req, res, next) => {
  //url에 인코딩된 id를 가져오기
  const placeId = req.params.pid; //{pid:'p1'}

  //원하는 id값의 장소만 추출
  const place = DUMMY_PLACES.find((p) => {
    return p.id === placeId;
  });

  //place를 찾지 못한 경우 에러 핸들링
  //비동기 코드가 존재하는 경우 next에 오류를 전달하는 방식으로 에러 처리
  if (!place) {
    throw new HttpError("해당 ID에 대한 장소를 찾지 못했습니다.", 404);
  }
  res.json({ place: place }); //원하는 객체를 전달
};

const getPlaceByUserId = (req, res, next) => {
  const userId = req.params.uid;

  const user = DUMMY_PLACES.find((u) => {
    return u.creatorId === userId;
  });

  if (!user) {
    return next(new HttpError("해당 ID의 유저를 찾지 못했습니다.", 404));
  }
  res.json({ user });
};

const createPlace = (req, res, next) => {
  //들어오는 요청에서 데이터 추출
  const { title, description, coordinates, address, creatorId } = req.body;
  const createdPlace = {
    id: uuid(),
    title,
    description,
    location: coordinates,
    address: address,
    creatorId,
  };

  DUMMY_PLACES.push(createdPlace); //unshift(createPlace)

  //새롭게 등록할 것이 있을 때는 201이 관례
  res.status(201).json({ place: createdPlace });
};

const updatePlace = (req, res, next) => {
  const { title, description } = req.body;
  const placeId = req.params.pid;

  const updatedPlace = { ...DUMMY_PLACES.find((p) => p.id === placeId) }; //복사
  const placeIndex = DUMMY_PLACES.findIndex((p) => p.id === placeId);
  updatedPlace.title = title;
  updatedPlace.description = description;

  DUMMY_PLACES[placeIndex] = updatedPlace;

  res.status(200).json({ place: updatedPlace });
};

const deletePlace = (req, res, next) => {
  const placeId = req.params.pid;
  DUMMY_PLACES = DUMMY_PLACES.filter((p) => p.id !== placeId);

  res.status(200).json({ message: "Deleted place", placeId });
};

exports.getPlaceById = getPlaceById;
exports.getPlaceByUserId = getPlaceByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
