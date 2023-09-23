import React, { useState, useCallback, Suspense, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";

//import Users from "./user/pages/Users";
// import NewPlace from "./places/pages/NewPlace";
import MainNavigation from "./shared/components/Navigation/MainNavigation";
// import UserPlaces from "./places/pages/UserPlaces";
// import UpdatePlace from "./places/pages/UpdatePlace";
// import Auth from "./user/pages/Auth";
import { AuthContext } from "./shared/context/auth-context";
import LoadingSpinner from "./shared/components/UIElements/LoadingSpinner";

//코드분할
const Users = React.lazy(() => import("./user/pages/Users"));
const NewPlace = React.lazy(() => import("./places/pages/NewPlace"));
const UpdatePlace = React.lazy(() => import("./places/pages/UpdatePlace"));
const Auth = React.lazy(() => import("./user/pages/Auth"));
const UserPlaces = React.lazy(() => import("./places/pages/UserPlaces"));

function App() {
  const [token, setToken] = useState(false);
  const [userId, setUserId] = useState(false);

  //재생성할 필요 없음, 의존성 빈 배열
  const login = useCallback((uid, token, expirationDate) => {
    setToken(token);
    setUserId(uid);
    //지금으로부터 1시간.
    //useEffect에서 전달해준 time이 유효하다면 그대로 쓰고 아니면 새로 생성
    const tokenExpirationDate =
      expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
    localStorage.setItem(
      "userData", //key
      JSON.stringify({
        userId: uid,
        token: token,
        expiration: tokenExpirationDate.toISOString(),
      }) //value
    );
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUserId(null);
    localStorage.removeItem("userData"); //로컬스토리지에서 데이터 삭제
  }, []);

  //로컬 스토리지를 확인해 자동 로그인
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData")); //parse 이용해 객체 등의 일반 js구조로 되돌리기
    //로컬스토리지에 데이터가 있고, 데이터가 있을 경우 token을 확인해서 token이 있다면
    //저장된 만료 시각의 Date가 현재 시각인 Date보다 크다면 그 시간동안 이 토큰은 유효하다
    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiration) > new Date()
    ) {
      login(
        storedData.userId,
        storedData.token,
        new Date(storedData.expiration) //변경사항이 적용되지 않은 원래의 만료시간 스탬프
      );
    }
  }, [login]);

  let routes;

  if (token) {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Users />
        </Route>
        <Route path="/:userId/places" exact>
          <UserPlaces />
        </Route>
        <Route path="/places/new" exact>
          <NewPlace />
        </Route>
        <Route path="/places/:placeId" exact>
          <UpdatePlace />
        </Route>
        <Redirect to="/" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Users />
        </Route>
        <Route path="/:userId/places" exact>
          <UserPlaces />
        </Route>
        <Route path="/auth" exact>
          <Auth />
        </Route>
        <Redirect to="/auth" />
      </Switch>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token, //토큰 없으면 false(로그인 여부)
        token: token, //토큰 객체
        userId: userId,
        login: login,
        logout: logout,
      }}
    >
      <Router>
        <MainNavigation />
        <main>
          <Suspense
            fallback={
              <div className="center">
                <LoadingSpinner />
              </div>
            }
          >
            {routes}
          </Suspense>
        </main>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
