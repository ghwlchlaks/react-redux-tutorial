/**
 * 순서 action -> reducer -> store -> components
 * action : 어떤 변화가 일어날지 알려주는 객체
 * reducer : action의 정보를 받고 애플리케이션의 상태를 바꿀지 정의
 * store : 모든 데이터를 담고있는 객체, 중간자 역할
 */

/**
 * INCREMENT : 카운터의 값을 올림
 * DECREMENT : 카운터의 값을 내림
 * SET_DIFF : 버튼이 눌렸을때 더하거나 뺄값을 설정
 */
export const INCREMENT = "INCREMENT";
export const DECREMENT = "DECREMENT";
export const SET_DIFF = "SET_DIFF";

export function increment() {
  return {
    type: INCREMENT
  };
}
export function decrement() {
  return {
    type: DECREMENT
  };
}

export function setDiff(value) {
  return {
    type: SET_DIFF,
    diff: value
  };
}
