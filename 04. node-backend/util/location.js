require("dotenv").config();

const axios = require("axios");
const HttpError = require("../models/http-error");

const API_KEY = process.env.GOOGLE_API_KEY;

const getCoordsForAddress = async (address) => {
  //axios는 url로 GET 요청을 보냄. 반환값: 주소에 해당하는 좌표
  const response = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${process.env.GOOGLE_API_KEY}`
  );

  const data = response.data;

  //유효성 검증을 통과했는데도 google map에서 주소를 찾을 수 없는 경우
  if (!data || data.status === "ZERO_RESULTS") {
    const error = new HttpError(
      "입력된 주소의 좌표를 불러올 수 없습니다.",
      422
    );
    throw error;
  }
  //좌표 찾기
  const coordinates = data.results[0].geometry.location;

  return coordinates;
};

module.exports = getCoordsForAddress;
