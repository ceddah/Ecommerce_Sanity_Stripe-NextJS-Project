import React, { createContext, useContext, useState } from "react";
import { toast } from "react-hot-toast";

const Context = createContext();

export const StateContext = ({ children }) => {
  const [showCart, setShowCart] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalQuantities, setTotalQuantities] = useState(0);
  const [qty, setQty] = useState(1);

  const incQty = () => {
    setQty((prevQty) => prevQty + 1);
  };

  const decQty = () => {
    setQty((prevQty) => {
      if (prevQty - 1 < 1) return 1;

      return prevQty - 1;
    });
  };

  const onAdd = (product, quantity) => {
    const checkProductInCart = cartItems.find((item) => item._id === product._id);

    setTotalPrice((prevTotalPrice) => prevTotalPrice + product.price * quantity);
    setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + quantity);

    if (checkProductInCart) {
      const updatedCartItems = cartItems.map((cartProduct) => {
        if (cartProduct._id === product._id)
          return {
            ...cartProduct,
            quantity: cartProduct.quantity + quantity,
          };
        return cartProduct;
      });

      setCartItems(updatedCartItems);
    } else {
      product.quantity = quantity;

      setCartItems([...cartItems, { ...product }]);
    }
    setQty(1);
    toast.success(`${qty} ${product.name} added to the cart.`);
  };

  const toggleCartItemQuantity = (id, value) => {
    const productPrice = cartItems.find((cartItem) => cartItem._id === id)?.price;
    if (value === "inc") {
      setCartItems(
        cartItems.map((cartItem) => {
          if (cartItem._id === id) {
            cartItem.quantity += 1;
            return cartItem;
          }
          return cartItem;
        })
      );
      setTotalPrice((prevTotalPrice) => prevTotalPrice + productPrice);
      setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + 1);
    } else if (value === "dec") {
      setCartItems(
        cartItems
          .map((cartItem) => {
            if (cartItem._id === id) {
              cartItem.quantity -= 1;
              return cartItem;
            }
            return cartItem;
          })
          .filter((cartItem) => cartItem.quantity >= 1)
      );
      if (cartItems.length >= 1) {
        setTotalPrice((prevTotalPrice) => prevTotalPrice - productPrice);
        setTotalQuantities((prevTotalQuantities) => prevTotalQuantities - 1);
      }
    }
  };

  const onRemoveCartItem = (id) => {
    const product = cartItems.find((cartItem) => cartItem._id === id);
    setCartItems(cartItems.filter((cartItem) => cartItem._id !== id));
    setTotalPrice((prevTotalPrice) => prevTotalPrice - product.price * product.quantity);
    setTotalQuantities((prevTotalQuantities) => prevTotalQuantities - product.quantity);
  };

  return (
    <Context.Provider
      value={{
        showCart,
        cartItems,
        totalPrice,
        totalQuantities,
        qty,
        incQty,
        decQty,
        onAdd,
        setShowCart,
        toggleCartItemQuantity,
        onRemoveCartItem,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useStateContext = () => useContext(Context);
