require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;

const url = `mongodb+srv://user03:${process.env.DB_PW}@cluster0.mqq5hvg.mongodb.net/products_test?retryWrites=true&w=majority`;

const createProduct = async (req, res, next) => {
  //새로운 상품을 나타내는 js 객체 생성
  const newProduct = {
    name: req.body.name,
    price: req.body.price,
  };

  //mongoDB에게 연결할 서버에 대한 정보를 알려줌, 연결 실행 코드는 x
  const client = new MongoClient(url);

  //연결 실행 코드
  try {
    await client.connect(); //몇 초가 소요되므로 비동기 작업
    const db = client.db(); //설정한 product_test db를 가지고 온다.
    const result = db.collection("products").insertOne(newProduct); //컬렉션 지정 후 객체 추가
  } catch (error) {
    return res.json({ message: "db 오류" });
  }
  //신규 상품이 하나 생성될 때마다 연결을 종료해 주어야 함.
  // client.close(); =>close했을 시 db에 내용이 저장되지 않음

  res.json(newProduct);
};

const getProducts = async (req, res, next) => {};

exports.createProduct = createProduct;
exports.getProducts = getProducts;
