import React, { Component } from "react";
import WheelComponent from "./weel";
import "react-wheel-of-prizes/dist/index.css";
import "./styles.css";
import IMAGES from "./assets";
import axios from "axios";

import TrPortal from "./portal";
import Confetti from "react-confetti";
import { Button } from "semantic-ui-react";
import Table from "./Table";

const weelColors = (_segments) => {
  let arr = [];
  let colors = ["#EE4040", "#F0CF50", "#815CD1", "#3DA5E0", "#34A24F"];
  _segments.forEach((el) => {
    let color = colors.shift();
    arr.push(color);
    colors.push(color);
  });

  return arr;
};

export class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      portal: false,
      show: false,
      segments: [],
      spin_count: 5, // Thêm state để lưu trữ số lượt quay
      spinResults: [],
   
    };
  }

  componentDidMount() {
    // Fetch prize data from the API and update the segments state
    axios
      .get("http://localhost:3000/api/spinwheels")
      .then((response) => {
        const data = response.data;
        console.log("data",data)
        if (Array.isArray(data) && data.length > 0) {
          const segments = data[9].options.map((item) => item.prizes);
          this.setState({ segments });
        } else {
          console.error("Invalid API response:", data);
        }
      })
      .catch((error) => {
        console.error("Error fetching prize data:", error);
      });
  }

  // Hàm xử lý khi người dùng quay vòng
  handleSpin = () => {
    // Tăng giá trị spin_count lên 1
    this.setState((prevState) => ({ spin_count: prevState.spin_count + 1 }));
  };
  handleSpin = () => {
    const { show } = this.state;
    if (show) {
      // Lưu kết quả quay vào mảng spinResults
      this.setState((prevState) => ({
        spinResults: [...prevState.spinResults, show],
        spin_count: prevState.spin_count + 1, // Tăng giá trị spin_count lên 1
      }));
    }
  };
  

  render() {
    const { segments, spin_count  } = this.state;
    const segColors = segments && segments.length > 0 ? weelColors(segments) : [];

    const onFinished = (winner) => {
      this.setState({ portal: false, show: winner });
    };

    return (
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            paddingTop: "150px",
            paddingBottom: "150px",
            background: `url(${IMAGES.background})`,
          }}
        >
          {console.log("weelColors", segments, segColors)}
          {this.state.show && <Confetti width={1600} height={1019} />}
          {segments.length > 0 && (
            <WheelComponent
              segments={segments}
              segColors={segColors}
              winningSegment={"8"}
              onFinished={(winner) => onFinished(winner)}
              primaryColor="gray"
              contrastColor="white"
              buttonText="Spin"
              isOnlyOnce={true}
              onSpin={this.handleSpin} // Gọi hàm handleSpin khi người dùng quay
            />
          )}

          {this.state.portal ? <TrPortal /> : null}
          {this.state.show && (
            // modal
            <div className="box">
              <div className="imageBox">
                <img
                  src={IMAGES[`image${this.state.show.split(" ").join("")}`]}
                  alt=""
                />
              </div>
              <h2 className="titleWin">
                CHÚC MỪNG BẠN ĐÃ TRÚNG: {this.state.show} !!!
              </h2>
              <div className="closeContainer">
                <button
                  className="closepankaj"
                  onClick={() => this.setState({ show: false })}
                >
                  OK
                </button>
              </div>
              {/* Hiển thị số lượt quay */}
            
            </div>
            
          )}
            <div className="texts">Lượt: {spin_count}</div>
           
         {/* Hiển thị các phần thưởng đã quay được */}
         {this.state.spinResults.length > 0 && (
            <div>
              <h2>Các phần thưởng đã quay:</h2>
              <ul>
                {this.state.spinResults.map((result, index) => (
                  <li key={index}>{result}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
          {/* <button onClick={() => {alert('test')}} className="btn">Phần Thưởng</button> */}
      </div>
    );
  }
}
