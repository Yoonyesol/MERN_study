const fs = require("fs");

const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

const HttpError = require("../models/http-error");
const getCoordsForAddress = require("../util/location");
const Place = require("../models/place"); //Place 모델 사용가능
const User = require("../models/user");

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    //GET 요청에 문제가 생겼을 때의 오류
    const error = new HttpError("장소를 찾지 못했습니다.", 500);
    return next(error);
  }

  //GET 요청에는 문제가 없지만 장소가 없을 경우
  if (!place) {
    const error = new HttpError("해당 ID에 대한 장소를 찾지 못했습니다.", 404);
    return next(error); //오류 발생 시 코드 실행 중단
  }
  res.json({ place: place.toObject({ getters: true }) });
};

const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  //let places;
  let userWithPlaces;
  try {
    //특정 사용자 id를 검색해 해당하는 장소를 확인. populate인자의 저장소에 접근가능
    userWithPlaces = await User.findById(userId).populate("places");
  } catch (err) {
    const error = new HttpError("해당 유저ID의 장소를 찾지 못했습니다.", 500);
    return next(error);
  }

  if (!userWithPlaces || userWithPlaces.places.length === 0) {
    return next(new HttpError("해당 유저ID의 장소를 찾지 못했습니다.", 404));
  }
  res.json({
    places: userWithPlaces.places.map((place) =>
      place.toObject({ getters: true })
    ),
  });
};

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("입력하지 않은 데이터가 존재합니다.", 422));
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
    image: req.file.path,
    creatorId,
  });

  let user;
  //creatorId의 존재 여부 확인
  try {
    user = await User.findById(creatorId);
  } catch (err) {
    const error = new HttpError("creatorId가 존재하지 않습니다.", 500);
    return next(error);
  }

  //해당 사용자의 존재 여부 확인
  if (!user) {
    const error = new HttpError(
      "주어진 id에 해당하는 사용자가 존재하지 않습니다.",
      500
    );
    return next(error);
  }

  console.log(user);

  try {
    //새로운 장소를 생성할 때 시작하는 현재 세션
    //세션이 존재하면 트랜잭션 시작 가능
    const sess = await mongoose.startSession();
    sess.startTransaction(); //db에게 뭘 할 건지를 알려줄 수 있게 됨
    await createdPlace.save({ session: sess }); //새로운 장소 생성. 자동으로 장소의 고유 id 생성
    //장소id를 사용자 문서에 추가
    user.places.push(createdPlace); //push(): mongoose내부에서 우리가 참조하는 두 개의 모델을 연결
    //업데이트한 문서를 저장
    await user.save({ session: sess });
    await sess.commitTransaction(); //세션이 트랜잭션을 커밋하게 한다.
  } catch (err) {
    const error = new HttpError("장소 저장 실패", 500);
    return next(error);
  }

  res.status(201).json({ place: createdPlace });
};

const updatePlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("입력하지 않은 데이터가 존재합니다.", 422));
  }
  const { title, description } = req.body;
  const placeId = req.params.pid;

  //id로 해당 장소 불러오기
  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError("장소를 업데이트 할 수 없습니다.", 500);
    return next(error);
  }

  //장소 생성자가 아니면 내용 수정 불가
  if (place.creatorId.toString() !== req.userData.userId) {
    const error = new HttpError(
      "장소를 업데이트 할 수 있는 권한이 없습니다.",
      401 //권한 부여 오류
    );
    return next(error);
  }

  //내용 업데이트
  place.title = title;
  place.description = description;

  //업데이트된 정보를 db에 저장
  try {
    await place.save();
  } catch (err) {
    const error = new HttpError("업데이트에 실패했습니다.", 500);
    return next(error);
  }

  res.status(200).json({ place: place.toObject({ getters: true }) });
};

const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;

  //id로 해당 장소 검색
  let place;
  try {
    //populate: 다른 컬렉션의 문서를 참조하고 그 컬렉션에 있는 다른 기존 문서의 데이터를 가지고 작업할 수 있다.
    //몽구스가 creatorId를 가지고 사용자 데이터 전체를 대상으로 검색한다. 이 id를 가지고 사용자를 찾아내고 그 사용자의 문서에 저장된 모든 데이터를 가져올 수 있다.
    place = await Place.findById(placeId).populate("creatorId");
  } catch (err) {
    const error = new HttpError("삭제할 장소를 찾지 못했습니다.", 500);
    return next(error);
  }

  //장소가 없을 경우
  if (!place) {
    const error = new HttpError("해당 id의 장소를 찾지 못했습니다.", 404);
    return next(error);
  }

  //장소 생성자가 삭제를 요청했는지 확인
  if (place.creatorId.id !== req.userData.userId) {
    const error = new HttpError("장소를 삭제할 수 있는 권한이 없습니다.", 401);
    return next(error);
  }

  const imagePath = place.image;

  //장소 삭제
  try {
    //사용자 문서에서 장소 삭제
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await place.deleteOne({ session: sess }); //몽고3.2 이후에는 deleteOne, deleteMany로 대체
    place.creatorId.places.pull(place); //pull을 이용해 place호출, 자동으로 id제거
    //새로 생성된 사용자를 db에 저장
    await place.creatorId.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError("장소를 삭제하지 못했습니다.", 500);
    return next(error);
  }

  //이미지 삭제
  fs.unlink(imagePath, (err) => {
    console.log(err);
  });

  res.status(200).json({ message: "삭제 완료", placeId });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
