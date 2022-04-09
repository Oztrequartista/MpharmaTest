import ACTIONS from "./actions";

const reducer = (state, action) => {
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
      const lastPriceIDArray = Object.values(state.itemPrices).flat();
      const sortedPriceIds = lastPriceIDArray.sort(
        (a, b) => a.priceId - b.priceId
      );
      const setNewPriceID =
        sortedPriceIds[sortedPriceIds.length - 1].priceId + 1;

      const lastKeyinPricesObject = Object.keys(state.itemPrices).length + 1;  
      const setNewProductID = lastKeyinPricesObject ;  
    

      const newProductToAddToProductState = {
        name,
        productId: setNewProductID,
        itemPrice: priceValueToBeAddedToState,
        priceId: setNewPriceID,
        date,
        priceIdArray: [setNewPriceID],
      };

     
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

      console.log(typeof priceValueToBeAddedToState);

    
      if (isNaN(priceValueToBeAddedToState) || typeof priceValueToBeAddedToState === "number" || priceValueToBeAddedToState < 0) {
        return {
          ...state,
          isAlertOpen: true,
          alertContent: "Please Enter a Valid Amount",
        };
      }

     

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


        const newItemPricesWhenProductToBeEditedIsDeleted = {
          ...state.itemPrices,
          [lastKeyinPricesObject ]: [ newItemPrice],
        };
        const editedProductWithNewPriceId = {
          ...newProduct,
          priceId: setNewPriceID,
      }

        const editedProducts = state.products.map((item, index) =>
          item.productId === productId ? editedProductWithNewPriceId : item
        );
  
        const whenSelectedProductIsDeletedWhileBeingEdited =
          state.products.find((item) => item.productId === productId);

      
        return {
          ...state,
          products:
            whenSelectedProductIsDeletedWhileBeingEdited === undefined
              ? [...state.products, newProductToAddToProductState]
              : editedProducts,
        itemPrices: whenSelectedProductIsDeletedWhileBeingEdited === undefined ? newItemPricesWhenProductToBeEditedIsDeleted : newItemPrices,
          isAlertOpen: true,
          alertContent: `${name} is the current product name`,
        };
      } else {
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
