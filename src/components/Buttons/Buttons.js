import React from "react";
import { connect } from "react-redux";
// 특정 이벤트가 발생했을때 취할 action을 불러옵니다.
import { increment, decrement } from "../../actions";

class Buttons extends React.Component {
  render() {
    return (
      <div>
        <button type="button" onClick={this.props.onIncrement}>
          +
        </button>
        <button type="button" onClick={this.props.onDecrement}>
          -
        </button>
      </div>
    );
  }
}

/* 
컴포넌트의 특정 이벤트(예: onIncrement)가 발생했을때 지정한 action을 dispatch하도록 설정
*/

let mapDispatchToProps = dispatch => {
  return {
    onIncrement: () => dispatch(increment()),
    onDecrement: () => dispatch(decrement())
  };
};

/* 
  button 컴포넌트에서는 counter컴포넌트와 다르게 state의 값을 변경해줄 필요가 없으므로
  undefined를 전달
*/
Buttons = connect(
  undefined,
  mapDispatchToProps
)(Buttons);

export default Buttons;
