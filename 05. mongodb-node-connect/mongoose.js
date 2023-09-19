require("dotenv").config();

const mongoose = require("mongoose");

const Product = require("./models/product");

mongoose
  .connect(
    `mongodb+srv://user03:${process.env.DB_PW}@cluster0.mqq5hvg.mongodb.net/products_test?retryWrites=true&w=majority`
  )
  .then(() => {
    console.log("db연결 완료");
  })
  .catch(() => {
    console.log("db연결 실패");
  });

const createProduct = async (req, res, next) => {
  const createdProduct = new Product({
    name: req.body.name,
    price: req.body.price,
  });
  const result = await createdProduct.save(); //문서 저장에 필요한 모든 무거운 작업을 모두 수행해 준다. 프로미스를 반환하므로 비동기식 작업=> await(시간이 걸릴 수도 있으니까)

  res.json(result);
};

exports.createProduct = createProduct;
