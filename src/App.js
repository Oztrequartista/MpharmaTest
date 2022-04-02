import React, { useState, useReducer, useEffect } from "react";
import axios from "axios";

//utilities
import reducer from "./UtilityFunctions/reducer";
import {getLatestPriceFromProductList, valuesOfAllPrices} from "./UtilityFunctions/myUtils";
import ACTIONS from "./UtilityFunctions/actions";

//components
import Navbar from "./components/Navbar";
import Modal from "./components/Modal/Modal";
import Form from "./components/Form/Form"
import Products from "./components/Products/Products";

//styles
import "./App.css";


const sessionKey = "initial_app_state";
const apiEndPoint = "https://www.mocky.io/v2/5c3e15e63500006e003e9795";
const initialState = {
  products: [],
  itemPrices: {},
};
//look into window.cache storage
// const item_value = sessionStorage.getItem(sessionKey);
// console.log("item_value", item_value)

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [newProduct, setNewProduct] = useState({
    name: "",
    itemPrice: "",
    date: new Date().toDateString(),
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [historicalPrices, setHistoricalPrices] = useState({
    name: "",
    prices: [],
  });

   //initial page load
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

  //check value of state after each render

  useEffect(() => {
    console.log("state of App", state);
    console.log("state of isEditing after state update", isEditing);
    sessionStorage.setItem(sessionKey, JSON.stringify(state));
  }, [state, isEditing]);

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
  };

  const handleProductDelete = (id) => {
    console.log("product ID", id);
    dispatch({ type: ACTIONS.ITEM_DELETED, payload: id });
  };

  const handleProductPriceHistory = (id) => {
    const selectedProduct = state.products.find(
      (item) => item.productId === id
    );
    const pricesToDisplay = state.itemPrices[id];
    setHistoricalPrices({
      name: selectedProduct.name,
      prices: pricesToDisplay,
    });
  };


  if (state.products.length < 1) return <h2>Loading ....</h2>;

  return (
    <>
      <div className="container">
        <Navbar />
        <Form handleFormSubmit={handleFormSubmit} newProduct={newProduct} handleInputChange={handleInputChange}/>
        <Modal
        open={isModalOpen}
        onModalClose={() => setIsModalOpen(false)}
        historicalPrices={historicalPrices}
      />
      <Products state={state} handleEditAndAdd={handleEditAndAdd} handleProductDelete={handleProductDelete} handleProductPriceHistory={handleProductPriceHistory} setIsModalOpen={setIsModalOpen}/>
      </div>
     
    </>
  );
}

export default App;
