import React, { useState, useReducer, useEffect } from "react";
import axios from "axios";

//utilities
import reducer from "./UtilityFunctions/reducer";
import {
  getLatestPriceFromProductList,
  valuesOfAllPrices,
} from "./UtilityFunctions/myUtils";
import ACTIONS from "./UtilityFunctions/actions";

//components
import Inventory from "./components/Inventory/Inventory";
import TableModal from "./components/TableModal/TableModal";
import Form from "./components/Form/Form";
import Products from "./components/Products/Products";
import Alert from "./components/Alert";
import Loader from "./components/Loader/Loader";
import NavBar from "./components/NavBar/NavBar";

//styles
import "./App.css";

const sessionKey = "initial_app_state";


const apiEndPoint = "https://www.mocky.io/v2/5c3e15e63500006e003e9795";
const initialState = {
  products: [],
  itemPrices: {},
  isAlertOpen: false,
  alertContent: "",
  isLoading: false,
};

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

  const [isInventoryOpen, setIsInventoryOpen] = useState(false);

  //initial page load
  useEffect(() => {
    dispatch({ type: ACTIONS.LOADING });
    let isMounted = true;
    const fetchProducts = async () => {
      const item_value = localStorage.getItem(sessionKey);
     
     if (item_value){
       const {itemPrices : pricesByProductKey, products } = JSON.parse(item_value);
      dispatch({
        type: ACTIONS.FETCH_PRODUCTS,
        payload: { pricesByProductKey, products },
      });
      return ;
     }
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
    localStorage.setItem(sessionKey, JSON.stringify(state));
  }, [state, isEditing]);

  //form functions
  const handleInputChange = (event) => {
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
    //scroll to form field on Edit
    window.scrollTo(0, 0);
    const editedProduct = state.products.find((item) => item.priceId === id);
    setIsEditing(true);
    setNewProduct(editedProduct);
  };

  const handleProductDelete = (id) => {
    window.scrollTo(0, 0);
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

  //Alert
  const closeAlert = () => {
    dispatch({ type: ACTIONS.CLOSE_MODAL });
  };

  const onInventoryClose =()=>{
    setIsInventoryOpen(false)
  }

  if (state.isLoading) return <Loader text="loading..." />;

  return (
    <>
      <div className="container">
        <NavBar setIsInventoryOpen={setIsInventoryOpen}/>
        <Inventory inventory={state.itemPrices} open={isInventoryOpen} onInventoryClose={onInventoryClose}/>
       
        {state.isAlertOpen && (
          <Alert alertContent={state.alertContent} closeAlert={closeAlert} />
        )}
        <Form
          handleFormSubmit={handleFormSubmit}
          newProduct={newProduct}
          handleInputChange={handleInputChange}
        />
        <TableModal
          open={isModalOpen}
          onModalClose={() => setIsModalOpen(false)}
          historicalPrices={historicalPrices}
        />
        <Products
          state={state}
          handleEditAndAdd={handleEditAndAdd}
          handleProductDelete={handleProductDelete}
          handleProductPriceHistory={handleProductPriceHistory}
          setIsModalOpen={setIsModalOpen}
        />
      </div>
    </>
  );
}

export default App;
