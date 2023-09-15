const express = require("express");
const bodyParser = require("body-parser");
const uuid = require("uuid/v4");

const app = express();

const DUMMY_PRODUCTS = []; // not a database, just some in-memory storage for now

app.use(bodyParser.json());

// CORS Headers => Required for cross-origin/ cross-server communication
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});

//엔드포인트. 특정 경로에 미들웨어 등록
app.get("/products", (req, res, next) => {
  //메서드와 경로의 조합에 요청이 도달할 때 실행되는 함수
  res.status(200).json({ products: DUMMY_PRODUCTS });
  //응답으로 products 반환
});

//엔드 포인트 --> 백엔드 주요 로직
app.post("/product", (req, res, next) => {
  const { title, price } = req.body;

  //사용자 입력값 검증
  if (!title || title.trim().length === 0 || !price || price <= 0) {
    return res.status(422).json({
      message: "Invalid input, please enter a valid title and price.",
    });
  }

  const createdProduct = {
    id: uuid(),
    title,
    price,
  };

  DUMMY_PRODUCTS.push(createdProduct); //서버를 끌 때 모든 데이터가 소실된다 -> DB필요!

  //상품이 성공적으로 생성되면 응답을 반환한다.
  res
    .status(201)
    .json({ message: "Created new product.", product: createdProduct });
});

app.listen(5000); // start Node + Express server on port 5000
