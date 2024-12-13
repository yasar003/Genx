import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const Cartslice = createSlice({
  name: "cart",
  initialState: {
    items: localStorage.getItem("cartItems")
      ? JSON.parse(localStorage.getItem("cartItems"))
      : [],
    loading: false,
    shippingInfo: localStorage.getItem("shippingInfo")
      ? JSON.parse(localStorage.getItem("shippingInfo"))
      : {},
  },
  reducers: {
    acrequest(state) {
      return {
        ...state,
        loading: true,
      };
    },
    acsuccess(state, action) {
      const item = action.payload;

      const isItemExist = state.items.find((i) => i.product === item.product);

      if (isItemExist) {
        toast.info("Item already in the cart", {
          position: "top-center",
          autoClose: 1500,
        });
      } else {
        state.items.push(item);
        toast.success("Item added to cart", {
          position: "top-center",
          autoClose: 1500,
        });

        localStorage.setItem("cartItems", JSON.stringify(state.items));
      }

      state.loading = false;
    },
    increaseCartQty(state, action) {
      state.items = state.items.map((item) => {
        if (item.product === action.payload) {
          item.quantity = item.quantity + 1;
        }
        return item;
      });
      localStorage.setItem("cartItems", JSON.stringify(state.items));
    },
    decreaseCartQty(state, action) {
      state.items = state.items.map((item) => {
        if (item.product === action.payload) {
          item.quantity = item.quantity - 1;
        }
        return item;
      });
      localStorage.setItem("cartItems", JSON.stringify(state.items));
    },
    removeitemfromCart(state, action) {
      const filterItems = state.items.filter((item) => {
        return item.product !== action.payload;
      });
      localStorage.setItem("cartItems", JSON.stringify(filterItems));
      return {
        ...state,
        items: filterItems,
      };
    },
    saveShippingInfo(state, action) {
      localStorage.setItem("shippingInfo", JSON.stringify(action.payload));
      return {
        ...state,
        shippingInfo: action.payload,
      };
    },
    orderCompleted(state, action) {
      localStorage.removeItem("shippingInfo");
      localStorage.removeItem("cartItems");
      sessionStorage.removeItem("orderInfo");
      return {
        items: [],
        loading: false,
        shippingInfo: {},
      };
    },
  },
});

const { actions, reducer } = Cartslice;

export const {
  acrequest,
  acsuccess,
  increaseCartQty,
  decreaseCartQty,
  removeitemfromCart,
  saveShippingInfo,
  orderCompleted,
} = actions;

export default reducer;
