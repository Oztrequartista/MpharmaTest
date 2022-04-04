import React, { useState, useReducer, useEffect } from "react";
import axios from "axios";


import reducer from "./UtilityFunctions/reducer";
import {
  createProductDataFromResponse,
  createPriceStoreForEntireApp,
} from "./UtilityFunctions/myUtils";
import ACTIONS from "./UtilityFunctions/actions";


import Inventory from "./components/Inventory/Inventory";
import TableModal from "./components/TableModal/TableModal";
import Form from "./components/Form/Form";
import Products from "./components/Products/Products";
import Alert from "./components/Alert";
import Loader from "./components/Loader/Loader";
import NavBar from "./components/NavBar/NavBar";
import ConfirmDelete from "./components/ConfirmDelete/ConfirmDelete";

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
  const [showDeleteModal, setShowDeleteProducts] = useState(false);
  const [deleteId, setDeleteId] =  useState();




  useEffect(() => {
    dispatch({ type: ACTIONS.LOADING });
    let isMounted = true;
    const fetchProducts = async () => {
      const item_value = localStorage.getItem(sessionKey);

      console.log(item_value);
     
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
      const pricesByProductKey = createPriceStoreForEntireApp(productList, "id");
      const products = createProductDataFromResponse(productList);

     
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
    console.log(state);
    localStorage.setItem(sessionKey, JSON.stringify(state));
  }, [state, isEditing]);

 
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
    window.scrollTo(0, 0);
    const editedProduct = state.products.find((item) => item.priceId === id);
    setIsEditing(true);
    setNewProduct(editedProduct);
  };

  const handleProductDelete = () => {
    window.scrollTo(0, 0);
    dispatch({ type: ACTIONS.ITEM_DELETED, payload: deleteId });
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
        {showDeleteModal && <ConfirmDelete onProductDelete={handleProductDelete} setShowDeleteProducts={setShowDeleteProducts}/>}
        <Products
          state={state}
          handleEditAndAdd={handleEditAndAdd}
          onProductDelete={handleProductDelete}
          handleProductPriceHistory={handleProductPriceHistory}
          setIsModalOpen={setIsModalOpen}
          setShowDeleteProducts={setShowDeleteProducts}
          setDeleteId={setDeleteId}
          
        />
      </div>
    </>
  );
}

export default App;
