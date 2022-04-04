 const sortedPrices = (array, name) => {
  const sorted = array.sort((a, b) => new Date(a.date) - new Date(b.date));
  const convertDates = sorted.map((item) => ({
    priceId: item.id,
    price: item.price,
    date: new Date(item.date).toDateString(),
    name:name,
    
  }));
  return convertDates;
};

 const createPriceStoreForEntireApp = (array, key) => {
  const initialValue = {};
  return array.reduce((object, arrayItem) => {
    const sortedPricesByDates = sortedPrices(arrayItem.prices, arrayItem.name);
    return {
      ...object,
      [arrayItem[key]]: sortedPricesByDates,
      
    };
  }, initialValue);
};

 const createProductDataFromResponse = (array) => {
  return array.map((item, index) => {
    const sorted = sortedPrices(item.prices);
    //last Index of Price after sorting by dates points to the current price
    const lastPriceIndex = sorted.length - 1;
    return {
      name: item.name,
      productId:item.id,
      itemPrice: sorted[lastPriceIndex].price,
      priceId: sorted[lastPriceIndex].priceId,
      date: new Date(sorted[lastPriceIndex].date).toDateString(),
      priceIdArray: [...item.prices.map((i) => i.id)],
    };
  });
};

 const formattedDate = (date) => {
  return new Date(date).toDateString();
};

export {sortedPrices, createPriceStoreForEntireApp, createProductDataFromResponse, formattedDate}