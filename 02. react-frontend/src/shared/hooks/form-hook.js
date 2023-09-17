import { useCallback, useReducer } from "react";

const formReducer = (state, action) => {
  switch (action.type) {
    case "INPUT_CHANGE":
      let formIsValid = true; //전체 form에 대한 유효성 확인
      for (const inputId in state.inputs) {
        //객체이므로 for in 루프
        if (!state.inputs[inputId]) {
          //undefined인지 확인
          continue;
        }
        if (inputId === action.inputId) {
          formIsValid = formIsValid && action.isValid; //초기 입력값이 바뀌면 양식은 유효함
        } else {
          formIsValid = formIsValid && state.inputs[inputId].isValid;
        }
      }
      return {
        ...state,
        inputs: {
          ...state.inputs,
          [action.inputId]: { value: action.value, isValid: action.isValid },
        },
        isValid: formIsValid,
      };
    case "SET_DATA":
      return {
        inputs: action.inputs,
        isValid: action.formIsValid,
      };
    default:
      return state;
  }
};

//사용자 지정 함수 생성
export const useForm = (initialInputs, initialFormValidity) => {
  const [formState, dispatch] = useReducer(formReducer, {
    inputs: initialInputs,
    isValid: initialFormValidity,
  });

  //무한루프 방지를 위해 useCallback 사용, 기존 값을 저장해 놓았다가 사용한다.
  const inputHandler = useCallback((id, value, isValid) => {
    dispatch({
      type: "INPUT_CHANGE",
      inputId: id,
      value: value,
      isValid: isValid,
    });
  }, []);

  //백엔드에서 데이터를 가져오기 전 form은 지워진 상태. 이때 form에 저장된 값과 유효성을 대체할 수 있게 하는 함수
  const setFormData = useCallback((inputData, formValidity) => {
    //useCallback: 불필요한 재생성 막기
    dispatch({
      type: "SET_DATA",
      inputs: inputData,
      formIsValid: formValidity,
    });
  }, []);

  //form data를 설정하거나 action을 dispatch할 때마다 setFromData() 호출
  return [formState, inputHandler, setFormData];
};
