import "./App.css";
import Footer from "./Components/Footer/Footer";
import Home from "./Components/Home/Home";
import Menu from "./Components/Menu/Menu";
import Nav from "./Components/Navbar/Nav";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProductDetail from "./Components/Productdetail/Productdetail";
import Searchedprod from "./Components/Searchedprod/Searchedprod";
import { useEffect, useState } from "react";
import Login from "./Components/User/Login";
import Register from "./Components/User/Register";
import store from "./Store";
import { existuser } from "./Actions/Useraction";
import Profile from "./Components/Profile/Profile";
import Firstroute from "./Components/Route/Firstroute";
import Updatepro from "./Components/User/Updatepro";
import Forgotpass from "./Components/User/Forgotpass";
import Cart from "./Components/Cart/Cart";
import Shipping from "./Components/Cart/Shipping";
import Confirmorder from "./Components/Cart/Confirmorder";
import Ordersuccess from "./Components/Cart/Ordersuccess";
import axios from "axios";
import Payment from "./Components/Cart/Payment";
import UserOrders from "./Components/Cart/Userorder";
import Orderdetail from "./Components/Cart/Orderdetails";
import Dashboard from "./Components/Admin/Dashboard";
import Productlist from "./Components/Admin/Productslist";
import Newproduct from "./Components/Admin/Newproduct";
import Updateproduct from "./Components/Admin/Updateproduct";
import Orderlist from "./Components/Admin/Orderlist";
import Updateorder from "./Components/Admin/Updateorder";
import Userlist from "./Components/Admin/Userlist";
import Updateuser from "./Components/Admin/Updateuser";
import Reviewlist from "./Components/Admin/Reviewlist";
import { useSelector } from "react-redux";
import OtpVerification from "./Components/User/Otpverify";
import PasswordReset from "./Components/User/Passwordreset";

function App() {
  const [brand, setBrand] = useState("All");
  const [rating, setRating] = useState("");
  const [cartcount, setCartcount] = useState(1);
  const { items: things } = useSelector((state) => state.cartState);
  const [razorpayApiKey, setRazorpayApiKey] = useState("");
  const [word, setWord] = useState([]);
  const [category, setCategory] = useState([]);
  useEffect(() => {
    store.dispatch(existuser);
    async function getRazorpayApiKey() {
      try {
        const { data } = await axios.get("/api/v1/razorpayapi");
        setRazorpayApiKey(data.razorpayApiKey);
      } catch (error) {
        console.error("Failed to fetch Razorpay API key:", error);
      }
    }

    getRazorpayApiKey();
  }, []);
  useEffect(() => {
    setCartcount(things.length);
  }, [things]);
  return (
    <>
      <HelmetProvider>
        <Router>
          <Nav
            brand={brand}
            setBrand={setBrand}
            setWord={setWord}
            cartcount={cartcount}
          />
          <ToastContainer theme="dark" />
          <Menu
            setBrand={setBrand}
            setRating={setRating}
            setWord={setWord}
            setCategory={setCategory}
          />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route
              path="/search/:keyword"
              element={
                <Searchedprod
                  word={word}
                  brand={brand}
                  setBrand={setBrand}
                  rating={rating}
                  setRating={setRating}
                  category={category}
                />
              }
            />
            <Route
              path="/Category/:Category"
              element={
                <Searchedprod
                  word={word}
                  brand={brand}
                  setBrand={setBrand}
                  rating={rating}
                  setRating={setRating}
                  category={category}
                />
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/myprofile"
              element={
                <Firstroute>
                  <Profile />
                </Firstroute>
              }
            />
            <Route
              path="/myprofile/update"
              element={
                <Firstroute>
                  <Updatepro />
                </Firstroute>
              }
            />
            <Route path="/password/forgot" element={<Forgotpass />} />
            <Route
              path="/password/otpverification"
              element={<OtpVerification />}
            />
            <Route path="/password/reset/:token" element={<PasswordReset />} />
            <Route path="/cart" element={<Cart />} />
            <Route
              path="/shipping"
              element={
                <Firstroute>
                  <Shipping />
                </Firstroute>
              }
            />
            <Route
              path="/order/confirm"
              element={
                <Firstroute>
                  <Confirmorder />
                </Firstroute>
              }
            />
            <Route
              path="/order/success"
              element={
                <Firstroute>
                  <Ordersuccess />
                </Firstroute>
              }
            />
            {razorpayApiKey && (
              <Route
                path="/payment"
                element={
                  <Firstroute>
                    <Payment razorpayApiKey={razorpayApiKey} />
                  </Firstroute>
                }
              />
            )}
            <Route
              path="/orders"
              element={
                <Firstroute>
                  <UserOrders />
                </Firstroute>
              }
            />
            <Route
              path="/order/:id"
              element={
                <Firstroute>
                  <Orderdetail />
                </Firstroute>
              }
            />
          </Routes>
          {/* Admin Routes */}
          <Routes>
            <Route
              path="/admin/dashboard"
              element={
                <Firstroute isAdmin={true}>
                  <Dashboard />
                </Firstroute>
              }
            />
            <Route
              path="/admin/products"
              element={
                <Firstroute isAdmin={true}>
                  <Productlist />
                </Firstroute>
              }
            />
            <Route
              path="/admin/products/create"
              element={
                <Firstroute isAdmin={true}>
                  <Newproduct />
                </Firstroute>
              }
            />
            <Route
              path="/admin/product/:id"
              element={
                <Firstroute isAdmin={true}>
                  <Updateproduct />
                </Firstroute>
              }
            />
            <Route
              path="/admin/orders"
              element={
                <Firstroute isAdmin={true}>
                  <Orderlist />
                </Firstroute>
              }
            />
            <Route
              path="/admin/order/:id"
              element={
                <Firstroute isAdmin={true}>
                  <Updateorder />
                </Firstroute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <Firstroute isAdmin={true}>
                  <Userlist />
                </Firstroute>
              }
            />
            <Route
              path="/admin/user/:id"
              element={
                <Firstroute isAdmin={true}>
                  <Updateuser />
                </Firstroute>
              }
            />
            <Route
              path="/admin/reviews"
              element={
                <Firstroute isAdmin={true}>
                  <Reviewlist />
                </Firstroute>
              }
            />
          </Routes>
        </Router>
      </HelmetProvider>
      <Footer />
    </>
  );
}

export default App;
