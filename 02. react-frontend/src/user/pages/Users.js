import React from "react";
import UsersList from "../components/UsersList";

const Users = () => {
  const USERS = [
    {
      id: "u1",
      name: "testUser",
      image:
        "https://image.utoimage.com/preview/cp872722/2022/12/202212008462_206.jpg",
      places: 4,
    },
  ]; //백엔드 생성 전까지 사용할 더미 데이터

  return <UsersList items={USERS} />;
};
export default Users;
