//Reducer Function

const reducer = (state, action) => {
  console.log("data from form field to set to state", action.payload);

  switch (action.type) {
    case "FETCH_PRODUCTS":
      const { pricesByProductKey, products } = action.payload;
      return { ...state, products, itemPrices: pricesByProductKey };
      break;
    case "ITEM_ADDED":
      const {
        newProduct,
        isEditing,
        editedProduct,
      } = action.payload;
      //check if isEditing
      const  { date, name, itemPrice, productId } = newProduct;

      const lastKeyinPricesObject = Object.keys(state.itemPrices).length + 1;
      const getIndexOfLastProductInState = state.products.length - 1;
      const lastItemInProductList =
        state.products[getIndexOfLastProductInState];
      const indexOfLastItemInList =
        lastItemInProductList.priceIdArray.length - 1;
      const lastPriceId =
        lastItemInProductList.priceIdArray[indexOfLastItemInList];
      const increasePriceIdByOne = lastPriceId + 1;
      const newProductId = lastKeyinPricesObject;
      const newItemToAdd = {
        name,
        productId: newProductId,
        itemPrice: parseFloat(itemPrice),
        priceId: increasePriceIdByOne,
        date,
        priceIdArray: [increasePriceIdByOne],
      };
      const addToPricesArray = {
        [lastKeyinPricesObject]: [{ priceId: increasePriceIdByOne, price: parseFloat(itemPrice), date: date }],
        
      };

      if (isEditing) {

        const editPriceObj = state.itemPrices[productId];
        const newItemPrice = {priceId: editPriceObj.length+ 1 , price: parseFloat(itemPrice), date, }
        const newItemPrices = {
            ...state.itemPrices,
            [productId]: [...state.itemPrices[productId], newItemPrice ], 
        }
        console.log("EDITING IS BEING CALLED", newItemPrices );
      
        const editedProducts = state.products.map((item, index ) => item.productId === productId ? newProduct : item);
        return {
          ...state,
          products: editedProducts,
          itemPrices: newItemPrices,
        };
      } else {
        //find lastItem in product array and last item in productId array and add new item to state

  
        console.log("newItemToAdd", newItemToAdd);
        console.log("addToPricesArray", addToPricesArray);
        const newPriceObject = { ...state.itemPrices, ...addToPricesArray };
        //   console.log("normalizedPricesObject", state.itemPrices);
        //   console.log("state products list", state.products);
        return {
          ...state,
          products: [...state.products, newItemToAdd],
          itemPrices: newPriceObject,
        };
      }

    case "ITEM_DELETED":
      const filteredProducts = state.products.filter(
        (item) => item.priceId !== action.payload
      );
      //   console.log("filteredProducts", filteredProducts);
      //   console.log("normalizedPricesObject", state.itemPrices);
      //   console.log("state products list", state.products);
      return { ...state, products: filteredProducts };
      break;

    default:
      return {
        ...state,
      };
      break;
  }
};

export default reducer;
