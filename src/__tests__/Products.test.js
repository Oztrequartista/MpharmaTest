import React from "react";
import Products from "../components/Products/Products";
import {screen, render, fireEvent} from "@testing-library/react"

describe("Products.js", ()=>{
    it("renders a product card list", ()=>{
         
       const  handleEditAndAdd = jest.fn(); 
       const  handleProductDelete= jest.fn(); 
       const  handleProductPriceHistory= jest.fn(); 
       const setIsModalOpen= jest.fn(); 
       const state = { products : [
        {
            "name": "Exforge 10mg",
            "productId": 5,
            "itemPrice": 10.99,
            "priceId": 8,
            "date": "Sun Apr 03 2022",
            "priceIdArray": [
                8
            ]
        },
    ]};

       const { container } = render(<Products handleEditAndAdd={handleEditAndAdd} handleProductDelete={handleProductDelete} handleProductPriceHistory={handleProductPriceHistory} setIsModalOpen={setIsModalOpen} state={state}/>)

       const edit = screen.getByTestId("edit");
       fireEvent.click(edit);
       const filter = screen.getByTestId("filter");
       fireEvent.click(filter);
       const view = screen.getByTestId("view");
       fireEvent.click(view);

       expect(handleEditAndAdd).toBeCalledTimes(1);

       expect(container.parentElement).toMatchSnapshot();

    })
})