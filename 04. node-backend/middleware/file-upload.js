const { v1: uuid } = require("uuid");
const multer = require("multer");

//특정 MIME 타입 설정(파일확장자 매핑). 처리 중인 파일 종류를 알려주는 역할.
//식별된 MIME 타입에 알맞은 확장자를 판별함.
const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "png",
};

//함수의 결과: multer가 제공하는 실제 fileUpload의 미들웨어. express 미들웨어 체인에 사용가능함
const fileUpload = multer({
  limits: 500000, //용량제한 걸기(500kb)
  //데이터가 저장될 위치 제어. multer.diskStorage를 생성해 스토리지를 제공
  //diskStorage의 구성
  storage: multer.diskStorage({
    //파일이 저장될 경로를 생성
    destination: (req, file, cb) => {
      //(요청객체, 추출된 파일, 작업완료 후 호출해야 하는 콜백)
      cb(null, "uploads/images");
    },
    //사용되는 파일 이름을 제어하기 위한 key
    filename: (req, file, cb) => {
      //파일 확장자 ext 추출
      const ext = MIME_TYPE_MAP[file.mimetype];
      cb(null, uuid() + "." + ext); //올바른 확장자와 무작위의 이름을 가진 파일이 생성됨
    },
  }),
  //fileFilter 프로퍼티를 구성 후 multer의 구성에 사용할 객체로 전달
  fileFilter: (req, file, cb) => {
    //다른 mime타입이어서 정해진 확장자 엔트리를 못 찾는다면 undifined반환
    const isValid = !!MIME_TYPE_MAP[file.mimetype]; //!!로 'undifined/null ---> false'로 변환
    let error = isValid ? null : new Error("유효하지 않은 mime 타입입니다.");
    cb(error, isValid); //isValid가 true이면 true를 전달해 파일수용. 첫번째 인수에서 오류가 발생하면 그 전에 파일을 거부한다.
  },
});

module.exports = fileUpload;
