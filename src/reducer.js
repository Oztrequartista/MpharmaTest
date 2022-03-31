//Reducer Function

const reducer = (state, action) => {
  console.log("form input", action.payload);
  const { pricesByProductKey, products, date, name, itemPrice } = action.payload;
  switch (action.type) {
    case "FETCH_PRODUCTS":
      // const newState = { ...state, products, itemPrices: pricesByProductKey };
      return { ...state, products, itemPrices: pricesByProductKey };
      break;
    case "ITEM_ADDED":
      //find lastItem in product array and last item in productId array and add new item to state
      const getIndexOfLastProductInState = state.products.length - 1;
      const lastItemInProductList =
        state.products[getIndexOfLastProductInState];
      const indexOfLastItemInList = lastItemInProductList.productIDs.length - 1;
      const lastProductId =
        lastItemInProductList.productIDs[indexOfLastItemInList];
      const increaseProductIdByOne = lastProductId + 1;
      const newItemToAdd = {
        itemPrice,
        name,
        priceId: increaseProductIdByOne,
        date,
        productIDs: [increaseProductIdByOne],
      };
      const addToPricesArray = {
        [state.products.length + 1]: {
            [name]: [{ id: increaseProductIdByOne, price:itemPrice, date:date }]
        },
      };
      console.log("newItemToAdd", newItemToAdd)
     console.log("addToPricesArray", addToPricesArray);
    const newPriceObject = { ...state.itemPrices, ...addToPricesArray };
      console.log("normalizedPricesObject", state.itemPrices);
      console.log("state products list", state.products);
      return {
        ...state,
        products: [...state.products, newItemToAdd],
        itemPrices: newPriceObject,
      };

    case "ITEM_DELETED":
      const filteredProducts = state.products.filter(
        (item) => item.priceId !== action.payload
      );
      console.log("filteredProducts", filteredProducts);
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
