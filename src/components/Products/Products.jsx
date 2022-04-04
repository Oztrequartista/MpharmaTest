import React from "react";
import "./products.css";
import { formattedDate } from "../../UtilityFunctions/myUtils";
import { BsFillTrashFill, BsEyeFill } from "react-icons/bs";
import { BiEdit } from "react-icons/bi";

const Products = ({
  state,
  handleEditAndAdd = () => {},
  handleProductPriceHistory = () => {},
  setIsModalOpen = () => {},
  setDeleteId=()=>{},
  setShowDeleteProducts=()=>{}

}) => {
  return (
    <div className="product-container">
      {state.products.length > 0 &&
        state.products.map((singleProduct, index) => {
          const { itemPrice, name, date, priceId, productId } = singleProduct;
          const dateAsString = formattedDate(date);
          return (
            <div key={index} className="product">
              <h2 className="name">{name.toLowerCase()}</h2>
              <button className="price">GHS {itemPrice}</button>
              <h4 className="date">{dateAsString}</h4>
              <div className="btn-container">
                <div
                  onClick={(event) => {
                    event.preventDefault();
                    handleEditAndAdd(priceId);
                  }}
                  className="btn tooltip"
                  data-testid ="edit"
                >
                  <BiEdit color="#0a0ac0" size={22} />
                  <span className="tooltiptext">Edit Product</span>
                </div>
                <div
                  onClick={(event) => {
                    event.preventDefault();
                    setDeleteId(priceId);
                    setShowDeleteProducts(true);
                  }}
                  className="btn tooltip"
                  data-testid ="filter"
                >
                  <BsFillTrashFill color="#c02626" size={22} />
                  <span className="tooltiptext">Delete Product</span>
                </div>
                <div
                  onClick={(event) => {
                    event.preventDefault();
                    handleProductPriceHistory(productId);
                    setIsModalOpen(true);
                  }}
                  className="btn tooltip"
                  data-testid ="view"
                >
                  <BsEyeFill color="#584c4c" size={22} />
                  <span className="tooltiptext">Previous Prices</span>
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default Products;
