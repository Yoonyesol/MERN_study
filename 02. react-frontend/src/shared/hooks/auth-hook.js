import React, { useState, useCallback, useEffect } from "react";

let logoutTimer;

export const useAuth = () => {
  const [token, setToken] = useState(false);
  const [tokenExpirationDate, setTokenExpirationDate] = useState();
  const [userId, setUserId] = useState(false);

  //재생성할 필요 없음, 의존성 빈 배열
  const login = useCallback((uid, token, expirationDate) => {
    setToken(token);
    setUserId(uid);
    //지금으로부터 1시간.
    //useEffect에서 전달해준 time이 유효하다면 그대로 쓰고 아니면 새로 생성
    const tokenExpirationDate =
      expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
    setTokenExpirationDate(tokenExpirationDate); //만료기간 저장
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
    setTokenExpirationDate(null); //설정하지 않으면 기존의 만료시간을 계속 참조하므로 후에 로그인 시 계속 강제 로그아웃됨
    setUserId(null);
    localStorage.removeItem("userData"); //로컬스토리지에서 데이터 삭제
  }, []);

  //토큰 기한 만료시마다 자동 로그아웃
  useEffect(() => {
    //토큰과 만료기간 둘 다 있으면 타이머를 설정한다.
    if (token && tokenExpirationDate) {
      const remainingTime =
        tokenExpirationDate.getTime() - new Date().getTime(); //남은 만료기간
      logoutTimer = setTimeout(logout, remainingTime); //timeout()이 트리거되면 logout 함수를 가리키게 한다.
    } else {
      //둘 중 하나라도 없다면
      clearTimeout(logoutTimer); //진행 중인 타이머 모두 제거
    }
  }, [token, logout, tokenExpirationDate]);

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
  return { token, login, logout, userId };
};
