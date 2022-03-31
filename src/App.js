import React, { useState, useReducer, useEffect } from "react";
import reducer from "./reducer";
import axios from "axios";
import Navbar from "./Navbar";
import {
  getLatestPriceFromProductList,
  valuesOfAllPrices,
  formattedDate,
} from "./myUtils";

const ACTIONS = {
  FETCH_PRODUCTS: "FETCH_PRODUCTS",
  ITEM_ADDED: "ITEM_ADDED",
  ITEM_DELETED: "ITEM_DELETED",
  ITEM_EDITED: "ITEM_EDITED",
};

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
  // const [productId, setProductId] = useState();
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

     // set fetched data to state with reducer
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
    const { name, itemPrice } = state;

    //REMEMBER go add case to handle empty input values

    //  if(name.length && itemPrice.length){

    //  }

    dispatch({ type: ACTIONS.ITEM_ADDED, payload: newProduct });
    setNewProduct({ name: "", itemPrice: "", date: new Date().toDateString() });
  };

  const handleEditAndAdd = (id) => {
    console.log(
      "product ID",
      state.products.find((item) => item.priceId === id)
    );
    setNewProduct( state.products.find((item) => item.priceId === id))
    // dispatch({ type: ACTIONS.ITEM_EDITED, payload: id });
  };

  const handleProductDelete = (id) => {
    console.log("product ID", id);
    dispatch({ type: ACTIONS.ITEM_DELETED, payload: id });
  };

  //values before rendering
  const { name, itemPrice } = newProduct;
  // console.log("state of App", state);

  if (state.products.length < 1) return <h2>Loading ....</h2>;

  return (
    <>
      <div>
        <Navbar />
        <div>
          <form action="" onSubmit={handleFormSubmit}>
            <input
              type="text"
              name="name"
              value={name}
              onChange={handleInputChange}
            />
            <input
              type="number"
              name="itemPrice"
              value={itemPrice}
              onChange={handleInputChange}
            />
            <button>Add Product</button>
          </form>

          {state.products.length &&
            state.products.map((singleProduct, index) => {
              const { itemPrice, name, date, priceId } = singleProduct;
              const dateAsString = formattedDate(date);
              return (
                <div key={priceId}>
                  <h2>{name}</h2>
                  <h3>GHS {itemPrice}</h3>
                  <h4>{dateAsString}</h4>
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
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
}

export default App;
