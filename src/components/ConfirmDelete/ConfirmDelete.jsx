import React from "react";
import "./confirmDelete.css";
import ReactDOM from "react-dom";

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

const ConfirmDelete = ({
  onProductDelete = () => {},
  setShowDeleteProducts = () => {},
}) => {
  return ReactDOM.createPortal(
    <>
      <div style={overlayStyle}>
        <div className="delete-container">
          <h4 className="delete-heading">Are you sure you want to delete this product?</h4>
          <div className="button-container">
            <button
              onClick={(event) => {
                event.preventDefault();
                onProductDelete();
                setShowDeleteProducts(false);
              }}
              className="confirm-btns"
              style={{background:"#c02626", color:"#fff"}}
              
            >
              YES
            </button>
            <button
              onClick={(event) => {
                event.preventDefault();
                setShowDeleteProducts(false);
              }}
              className="confirm-btns"
              style={{background:"#584c4c", color:"#fff"}}
            >
              NO
            </button>
          </div>
        </div>
      </div>
    </>,
    document.getElementById("delete-modal")
  );
};

export default ConfirmDelete;
