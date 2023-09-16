import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Users from "./user/pages/Users";
import { Redirect, Switch } from "react-router-dom/cjs/react-router-dom.min";
import NewPlace from "./places/pages/NewPlace";

function App() {
  return (
    <Router>
      <Switch>
        {/* 일치하는 경로를 발견하면 그 밑의 코드는 읽지 않는다. */}
        <Route path="/" exact>
          {/* 
        exact 없는 경우: 어떤 경로든 /로 시작하기만 하면 Users를 렌더링한다.  
        exact 없는 경우: /인 경우에만 컴포넌트 렌더링
        */}
          <Users />
        </Route>
        <Route path="/places/new" exact>
          <NewPlace />
        </Route>
        <Redirect to="/" />
        {/* 지원하지 않는 페이지로 이동하지 않게 하기 위해 추가 */}
      </Switch>
    </Router>
  );
}

export default App;
