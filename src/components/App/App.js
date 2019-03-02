import React from "react";
import Counter from "../Counter/Counter";
import Buttons from "../Buttons/Buttons";
import Option from "../Options/Options";

class App extends React.Component {
  render() {
    return (
      <div style={{ textAlign: "center" }}>
        <Counter />
        <Option />
        <Buttons />
      </div>
    );
  }
}

export default App;
