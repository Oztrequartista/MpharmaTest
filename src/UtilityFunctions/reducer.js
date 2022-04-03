//Reducer Function
import ACTIONS from "./actions";

const reducer = (state, action) => {
  console.log("data from form field to be set to state", action.payload);

  switch (action.type) {
    case ACTIONS.FETCH_PRODUCTS:
      const { pricesByProductKey, products } = action.payload;
      return { ...state, products, itemPrices: pricesByProductKey, isLoading: false, };
      break;
    case ACTIONS.ITEM_ADDED:
      const { newProduct, isEditing } = action.payload;

      const { date, name, itemPrice, productId } = newProduct;

      
      //CREATE CONFIG FOR STATE UPDATES

    
      const priceValueToBeAddedToState = parseFloat(itemPrice);

      //find last price id
      const lastPriceIDArray = Object.values(state.itemPrices).flat();
      const sortedPriceIds = lastPriceIDArray.sort(
        (a, b) => a.priceId - b.priceId
      );
      const setNewPriceID =
        sortedPriceIds[sortedPriceIds.length - 1].priceId + 1;

      //find last product id
      const sortedProductIDlist = state.products.sort(
        (a, b) => a.productId - b.productId
      );

      const setNewProductID = sortedProductIDlist.length ? sortedProductIDlist[sortedProductIDlist.length - 1].productId + 1 : 1 ;      //if all products are deleted, set productID to 1 and then starting filling array with products

      //find last key in itemPricesState Object
      const lastKeyinPricesObject = Object.keys(state.itemPrices).length + 1;

      //createNew product to add to state.products
      const newProductToAddToProductState = {
        name,
        productId: setNewProductID,
        itemPrice: priceValueToBeAddedToState,
        priceId: setNewPriceID,
        date,
        priceIdArray: [setNewPriceID],
      };
      //createNew priceObject to add to state.itemPrices
      const newPriceObjectToAddToItemPricesState = {
        [lastKeyinPricesObject]: [
          {
            priceId: setNewPriceID,
            price: priceValueToBeAddedToState,
            date: date,
            name,
          },
        ],
      };

      console.log("newPriceObjectToAddToItemPricesState", newPriceObjectToAddToItemPricesState)

      // NB Add Button has multiple cases :->

      // 1: check if price value from price field is a number else throw error alert
      if (isNaN(priceValueToBeAddedToState)) {
        return {
          ...state,
          isAlertOpen: true,
          alertContent: "Please Enter a Valid Amount",
        };
      }

      //2:  check if isEditing is true before state update

      if (isEditing) {
        const newItemPrice = {
          priceId: setNewPriceID,
          price: priceValueToBeAddedToState,
          date,
          name,
        };
        const newItemPrices = {
          ...state.itemPrices,
          [productId]: [...state.itemPrices[productId], newItemPrice],
        };
        const editedProducts = state.products.map((item, index) =>
          item.productId === productId ? newProduct : item
        );
        //edge case for when item is deleted while being edited : -> find deleted product
        const whenSelectedProductedIsDeletedWhileBeingEdited =
          state.products.find((item) => item.productId === productId);

        //if the above is undefined, go ahead and add new product to state.products and use edited products
        return {
          ...state,
          products:
            whenSelectedProductedIsDeletedWhileBeingEdited === undefined
              ? [...state.products, newProductToAddToProductState]
              : editedProducts,
          itemPrices: newItemPrices,
          isAlertOpen: true,
          alertContent: `${name} is the current product name`,
        };
      } else {
        // if price is a number and item is not being edited, just add your new product to state.products

        const newPriceObject = {
          ...state.itemPrices,
          ...newPriceObjectToAddToItemPricesState,
        };
        return {
          ...state,
          products: [...state.products, newProductToAddToProductState],
          itemPrices: newPriceObject,
          isAlertOpen: true,
          alertContent: `${name} has been added to list of products !`,
        };
      }

    case ACTIONS.ITEM_DELETED:
      //filter deleted product
      const deletedProduct = state.products.filter(
        (item) => item.priceId === action.payload
      );

      const productsAfterDeletingOne = state.products.filter(
        (item) => item.priceId !== action.payload
      );

      return {
        ...state,
        products: productsAfterDeletingOne,
        isAlertOpen: true,
        alertContent: `${deletedProduct[0].name} has been removed from products !`,
      };
      break;

    case ACTIONS.CLOSE_MODAL:
      return {
        ...state,
        isAlertOpen: false,
        alertContent: "",
      };
      break;
      case ACTIONS.LOADING:
        return {
            ...state,
            isLoading: true,
        }
        break;
    default:
      return {
        ...state,
      };
      break;
  }
};

export default reducer;
