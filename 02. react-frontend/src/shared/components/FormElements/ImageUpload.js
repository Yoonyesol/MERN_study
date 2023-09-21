import React, { useEffect, useRef, useState } from "react";

import Button from "./Button";
import "./ImageUpload.css";

const ImageUpload = (props) => {
  const [file, setFile] = useState();
  const [previewUrl, setPreviewUrl] = useState(); //미리보기
  const [isValid, setIsValid] = useState(false); //파일이 존재하는지 체크

  const filePickerRef = useRef();

  //프리뷰 이미지에서 url 따오기
  useEffect(() => {
    if (!file) {
      return;
    }
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result);
    };
    fileReader.readAsDataURL(file);
  }, [file]);

  const pickedHandler = (event) => {
    //파일 존재 여부, 파일 갯수 확인
    let pickedFile;
    let fileIsValid = isValid; //상태 예약으로 결과가 달라질 것을 대비
    if (event.target.files && event.target.files.length === 1) {
      pickedFile = event.target.files[0]; //선택 파일 추출
      setFile(pickedFile);
      setIsValid(true);
      fileIsValid = true;
    } else {
      setIsValid(false);
      fileIsValid = false;
    }
    props.onInput(props.id, pickedFile, fileIsValid);
  };

  const pickImageHandler = () => {
    filePickerRef.current.click();
  };

  return (
    <div className="form-control">
      <input
        id={props.id}
        ref={filePickerRef}
        style={{ display: "none" }}
        type="file"
        accept=".jpg, .png, .jpeg"
        onChange={pickedHandler}
      />
      <div className={`image-upload ${props.center && "center"}`}>
        <div className="image-upload__preview">
          {previewUrl && <img src={previewUrl} alt="Preview" />}{" "}
          {!previewUrl && <p>이미지를 선택해 주세요.</p>}
        </div>
        <Button type="button" onClick={pickImageHandler}>
          PICK IMAGE
        </Button>
      </div>
      {!isValid && <p>{props.errorText}</p>}
    </div>
  );
};

export default ImageUpload;
