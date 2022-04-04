import React from "react";
import ReactDOM from "react-dom";
import "./tablemodal.css";
import { AiFillCloseCircle } from "react-icons/ai";


const overlayStyle = {
  position: "fixed",
  left: "0",
  right: "0",
  top: "0",
  bottom: "0",
  background: "rgba(0,0,0,0.7)",
  zIndex: "1000",
  transition: ".5s ease",
};
const TableModal = ({ open, onModalClose, historicalPrices }) => {
  const {name, prices} = historicalPrices;
  if (!open) return null;
  return ReactDOM.createPortal(
    <>
      <div style={overlayStyle}>
        <div className="modal-styles">
          <h4 style={{ textAlign: "center", fontSize:"14px" }}> {name.toUpperCase()}</h4>
          <div onClick={onModalClose} className="close-btn">
            <AiFillCloseCircle size={24} color="rgb(192, 38, 38)" />
          </div>
          <div className="scroll">
            {prices.map((item) => {
              const { date, priceId, price, } = item;
              return (
                <table key={priceId} className="table">
                  <tr className="tr"> 
                    <th className="th">Date</th>
                    <th className="th">Price</th>
                  </tr>
                  <tr className="tr">
                    <td className="td">{date}</td>
                    <td className="td"> GHS {price}</td>
                  </tr>
                </table>
              );
            })}
          </div>
        </div>
      </div>
    </>,
    document.getElementById("TableModal")
  );
};

export default TableModal;
