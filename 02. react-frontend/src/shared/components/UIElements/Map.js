import React, { useEffect, useRef } from "react";

import "./Map.css";

const Map = (props) => {
  const mapRef = useRef(); //지정된 요소와 상수값을 연결(지정된 요소에 대한 상수값을 설정)

  const { center, zoom } = props;
  useEffect(() => {
    //실제 포인터를 가진 current 프로퍼티 설정
    const map = new window.google.maps.Map(mapRef.current, {
      //지도 렌더링할 위치 정하기
      center: center, //가운데 정렬
      zoom: zoom,
    }); //맵 생성자 함수

    //마커가 가운데 정렬되게 설정
    new window.google.maps.Marker({ position: props.center, map: map });
  }, [center, zoom]);

  return (
    <div
      ref={mapRef}
      className={`map ${props.className}`}
      style={props.style}
    ></div>
  );
};

export default Map;
