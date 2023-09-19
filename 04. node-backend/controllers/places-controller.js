const { v4: uuid } = require("uuid");
const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const getCoordsForAddress = require("../util/location");
const Place = require("../models/place"); //Place 모델 사용가능

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
  const placeId = req.params.pid;

  const place = DUMMY_PLACES.find((p) => {
    return p.id === placeId;
  });

  if (!place) {
    throw new HttpError("해당 ID에 대한 장소를 찾지 못했습니다.", 404);
  }
  res.json({ place: place });
};

const getPlacesByUserId = (req, res, next) => {
  const userId = req.params.uid;

  const places = DUMMY_PLACES.filter((u) => {
    return u.creatorId === userId;
  });

  if (!places || places.length === 0) {
    return next(new HttpError("해당 유저ID의 장소를 찾지 못했습니다.", 404));
  }
  res.json({ places });
};

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(HttpError("입력하지 않은 데이터가 존재합니다.", 422));
  }
  const { title, description, address, creatorId } = req.body;

  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    return next(error);
  }

  //모델 생성 완료
  const createdPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    image:
      "https://lh3.googleusercontent.com/p/AF1QipPyuJVRazIvc5q3tBMmbrH25HHWvIwh8zsc9Tmn=s680-w680-h510",
    creatorId,
  });

  try {
    await createdPlace.save(); //db에 저장, 고유 id 생성
  } catch (err) {
    const error = new HttpError("장소 저장 실패", 500);
    return next(error);
  }

  res.status(201).json({ place: createdPlace });
};

const updatePlace = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("입력하지 않은 데이터가 존재합니다.", 422);
  }
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
  if (DUMMY_PLACES.find((p) => p.id !== placeId)) {
    throw new HttpError("id에 해당하는 장소가 없습니다.", 404);
  }
  DUMMY_PLACES = DUMMY_PLACES.filter((p) => p.id !== placeId);

  res.status(200).json({ message: "Deleted place", placeId });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
