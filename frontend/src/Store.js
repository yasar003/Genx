import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { thunk } from "redux-thunk";
import productsReducer from "./Slices/Productsslice";
import productReducer from "./Slices/Productslice";
import authReducer from "./Slices/Authslice";
import cartReducer from "./Slices/Cartslice";
import orderReducer from "./Slices/Orderslices";
import userReducer from "./Slices/Userslice";

const reducer = combineReducers({
  productsState: productsReducer,
  productState: productReducer,
  authState: authReducer,
  cartState: cartReducer,
  orderState: orderReducer,
  userState: userReducer,
});

const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});

export default store;
