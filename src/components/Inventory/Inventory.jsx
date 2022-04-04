import React from "react";
import "./inventory.css";
import ReactDOM from "react-dom";
import { AiFillCloseCircle } from "react-icons/ai";

const overlayStyle = {
  position: "fixed",
  left: "0",
  right: "0",
  top: "0",
  bottom: "0",
  background: "rgba(0,0,0,0.7)",
  zIndex: "1000",
};

const Inventory = ({ inventory, open, onInventoryClose }) => {

  const flattenedInventory = Object.values(inventory).flat();

  if (!open) return null;
  return ReactDOM.createPortal(
    <>
      <div style={overlayStyle}>
        <div className="inventory-modal-styles">
        <h4 style={{ textAlign: "center" }}>PRODUCT INVENTORY</h4>
        <div onClick={onInventoryClose} className="invoice-close-btn">
            <AiFillCloseCircle size={30} color="rgb(192, 38, 38)" />
          </div>
         <div className="table-scroll">
         <table>
            <tr>
              <th>Product Name</th>
              <th>Price</th>
              <th>Date</th>
            </tr>

            {flattenedInventory &&
              flattenedInventory.length &&
              flattenedInventory.map((product, index) => {
                const { priceId, price, date, name } = product;
                return (
                  <tr key={priceId}>
                    <td>{name}</td>
                    <td>{price}</td>
                    <td>{date}</td>
                  </tr>
                );
              })}
          </table>
         </div>
        </div>
      </div>
    </>,
    document.getElementById("inventory")
  );
};

export default Inventory;
