import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import Form from "../components/Form/Form";

describe("Form.js", () => {
  it("should successfully add a product", () => {
    const handleInputChange = jest.fn();
    const handleFormSubmit = jest.fn();
    const newProduct = {};
    const { container } = render(
      <Form
        handleFormSubmit={handleFormSubmit}
        handleInputChange={handleInputChange}
        newProduct={newProduct}
      />
    );
    const product = screen.getByPlaceholderText("product");
    fireEvent.change(product, {target: {value: 'Para'}});

    const price = screen.getByPlaceholderText("price");
    fireEvent.change(price, {target: {value: "23"}});

    const submit = screen.getByRole("button", {name:"Add Product"})
    fireEvent.click(submit);
    expect(handleFormSubmit).toBeCalledTimes(1);
    expect(handleInputChange).toBeCalled();


    expect(container.parentElement).toMatchSnapshot();
  
  });
});
