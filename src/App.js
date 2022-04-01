import React, { useState, useReducer, useEffect } from "react";
import reducer from "./reducer";
import axios from "axios";
import Navbar from "./Navbar";
import {
  getLatestPriceFromProductList,
  valuesOfAllPrices,
  formattedDate,
} from "./myUtils";

import "./App.css";

const ACTIONS = {
  FETCH_PRODUCTS: "FETCH_PRODUCTS",
  ITEM_ADDED: "ITEM_ADDED",
  ITEM_DELETED: "ITEM_DELETED",
  ITEM_EDITED: "ITEM_EDITED",
};

const sessionKey = "initial_app_state";
const apiEndPoint = "http://www.mocky.io/v2/5c3e15e63500006e003e9795";
const initialState = {
  products: [],
  itemPrices: {},
};

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [newProduct, setNewProduct] = useState({
    name: "",
    itemPrice: "",
    date: new Date().toDateString(),
  });
  const [isEditing, setIsEditing] = useState(false);
  const [productId, setProductId] = useState();

  // //initial page load

  useEffect(() => {
    let isMounted = true;
    const fetchProducts = async () => {
      const response = await axios.get(apiEndPoint);
      const data = await response.data;
      const productList = data.products;
      console.log("productList", productList);
      const pricesByProductKey = valuesOfAllPrices(productList, "id");
      console.log("pricesByProductKey", pricesByProductKey);
      const products = getLatestPriceFromProductList(productList);
      console.log("products", products);

      // set fetched data to state with reducer function
      if (isMounted) {
        dispatch({
          type: ACTIONS.FETCH_PRODUCTS,
          payload: { pricesByProductKey, products },
        });
      }
    };
    fetchProducts().catch(console.error);

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    console.log("state of App", state);
    console.log("state of isEditing after state update", isEditing);
    sessionStorage.setItem(sessionKey, JSON.stringify(initialState));
  }, [state]);

  //form functions

  const handleInputChange = (event) => {
    //remember to add alert that tells user to type a number in the itemPrice input field
    const name = event.target.name;
    const value = event.target.value;
    const date = new Date().toDateString();
    setNewProduct((previousProduct) => ({
      ...previousProduct,
      [name]: value,
      date,
    }));
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const { name, itemPrice } = newProduct;

    //REMEMBER go add case to handle empty input values
    //add alert modal that tells user to enter a number for price and remove number field from input

    // if (name.length && itemPrice.length) {
    //   dispatch({ type: ACTIONS.ITEM_ADDED, payload: newProduct });
    //   setNewProduct({
    //     name: "",
    //     itemPrice: "",
    //     date: new Date().toDateString(),
    //   });
    // } else {
    //   alert("enter valid inputs");
    // }

    // isEditing:isEditing

    dispatch({
      type: ACTIONS.ITEM_ADDED,
      payload: { newProduct, isEditing: isEditing },
    });
    setNewProduct({
      name: "",
      itemPrice: "",
      date: new Date().toDateString(),
    });
    setIsEditing(false);
  };

  const handleEditAndAdd = (id) => {
    console.log(
      "selected product",
      state.products.find((item) => item.priceId === id)
    );

    const editedProduct = state.products.find((item) => item.priceId === id);
    setIsEditing(true);
    setNewProduct(editedProduct);

    // dispatch({ type: ACTIONS.ITEM_EDITED, payload: {editedProduct, id, isEditing: true} });
  };

  const handleProductDelete = (id) => {
    console.log("product ID", id);
    dispatch({ type: ACTIONS.ITEM_DELETED, payload: id });
  };

  const handleProductPriceHistory = (id) => {
    console.log("id", id);
    const pricesToDisplay = state.itemPrices[id];
    console.log("pricesToDisplay", pricesToDisplay);
  };

  //values before rendering
  const { name, itemPrice } = newProduct;
  if (state.products.length < 1) return <h2>Loading ....</h2>;

  return (
    <>
      <div>
        <Navbar />
        <div className="container">
          <div className="form-container">
            <form action="" onSubmit={handleFormSubmit}>
              <label htmlFor="Product">Product Name</label>
              <input
                type="text"
                name="name"
                value={name}
                onChange={handleInputChange}
                required
              />
              <label htmlFor="Product">Price</label>
              <input
                type=""
                name="itemPrice"
                value={itemPrice}
                onChange={handleInputChange}
                required
              />
              <button className="submit">Add Product</button>
            </form>
          </div>

          <div className="product-container">
            {state.products.length &&
              state.products.map((singleProduct, index) => {
                const { itemPrice, name, date, priceId, productId } =
                  singleProduct;
                const dateAsString = formattedDate(date);
                return (
                  <div key={priceId} className="product">
                    <h2 className="name">{name}</h2>
                    <button className="price">GHS {itemPrice}</button>
                    <h4 className="date">{dateAsString}</h4>
                    <div className="btn-container">
                      <button
                        onClick={(event) => {
                          event.preventDefault();
                          handleEditAndAdd(priceId);
                        }}
                      >
                        Edit Product
                      </button>
                      <button
                        onClick={(event) => {
                          event.preventDefault();
                          handleProductDelete(priceId);
                        }}
                      >
                        Delete Product
                      </button>
                      <button
                        onClick={(event) => {
                          event.preventDefault();
                          handleProductPriceHistory(productId);
                        }}
                      >
                        Price History
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
