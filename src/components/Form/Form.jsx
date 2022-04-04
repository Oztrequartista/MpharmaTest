import React from "react";
import "./form.css";

const Form = ({handleFormSubmit=()=>{}, newProduct, handleInputChange=()=>{}}) => {
  const { name, itemPrice } = newProduct;
  return (
    <div className="form-container">
      <form action="" onSubmit={handleFormSubmit} className="form">
        <div className="input-container">
          <label htmlFor="Product" style={{ marginTop: "40px" }}>
            Product Name
          </label>
          <input
           placeholder="Enter A Product"
            type="text"
            name="name"
            value={name}
            onChange={handleInputChange}
            required
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleFormSubmit();
              }
            }}
          />
        </div>

        <div className="input-container">
          <label htmlFor="Product">Price</label>
          <input
             placeholder="Enter A Price"
            type="text"
            name="itemPrice"
            value={itemPrice}
            onChange={handleInputChange}
            required
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleFormSubmit();
              }
            }}
          />
        </div>

        <button className="submit">Add Product</button>
      </form>
    </div>
  );
};

export default Form;
