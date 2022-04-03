import React from "react";
import ReactDOM from "react-dom";
import "./tablemodal.css";
import { AiFillCloseCircle } from "react-icons/ai";

//used react portal to display a child into a DOM node that exists outside the DOM hierarchy of the parent component

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
          <h4 style={{ textAlign: "center" }}>{name.toUpperCase()}</h4>
          <div onClick={onModalClose} className="close-btn">
            <AiFillCloseCircle size={30} color="rgb(192, 38, 38)" />
          </div>
          <div>
            {prices.map((item) => {
              const { date, priceId, price, } = item;
              // return <div>{date}</div>
              return (
                <table key={priceId}>
                  <tr>
                    
                    <th>Date</th>
                    <th>Price</th>
                  </tr>
                  <tr>
                   
                    <td>{date}</td>
                    <td> GHS {price}</td>
                  </tr>
                </table>
              );
            })}
          </div>
        </div>
      </div>
    </>,
    document.getElementById("portal")
  );
};

export default TableModal;
