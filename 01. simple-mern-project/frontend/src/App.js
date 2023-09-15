import React, { useState, useEffect } from "react";

import Header from "./components/Header/Header";
import NewProduct from "./components/Products/NewProduct";
import ProductList from "./components/Products/ProductList";
import "./App.css";

function App() {
  const [loadedProducts, setLoadedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      //http 요청(get)
      const response = await fetch("http://localhost:5000/products");

      const responseData = await response.json();

      //백엔드로부터 가져온 데이터를 상태 데이터에 저장
      setLoadedProducts(responseData.products);
      setIsLoading(false);
    };

    fetchProducts();
  }, []);

  //product 객체를 구축하여 백엔드로 전송
  const addProductHandler = async (productName, productPrice) => {
    try {
      const newProduct = {
        title: productName,
        price: +productPrice, // "+" to convert string to number
      };
      let hasError = false;
      const response = await fetch("http://localhost:5000/product", {
        method: "POST",
        body: JSON.stringify(newProduct), //데이터 첨부
        headers: {
          "Content-Type": "application/json", //json데이터 전송을 백엔드에게 알려줌
        },
      });

      //응답이 ok인지 확인
      if (!response.ok) {
        hasError = true;
      }

      const responseData = await response.json();

      if (hasError) {
        throw new Error(responseData.message);
      }

      //정상적으로 응답을 받았다면 프론트엔드에서 작업한 products를 업데이트해서 UI를 리렌더링하고 새로 추가된 상품을 반영한다.
      setLoadedProducts((prevProducts) => {
        return prevProducts.concat({
          ...newProduct,
          id: responseData.product.id,
        });
      });
    } catch (error) {
      alert(error.message || "Something went wrong!");
    }
  };

  return (
    <React.Fragment>
      <Header />
      <main>
        <NewProduct onAddProduct={addProductHandler} />
        {isLoading && <p className="loader">Loading...</p>}
        {!isLoading && <ProductList items={loadedProducts} />}
      </main>
    </React.Fragment>
  );
}

export default App;
