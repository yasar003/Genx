import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { orderCompleted } from "../../Slices/Cartslice";
import { validateShipping } from "../Cart/Shipping";
import { createOrder } from "../../Actions/Orderaction";
import { clearError as clearOrderError } from "../../Slices/Orderslices";
import MetaData from "../Metadata";

export default function Payment() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Ensure orderInfo exists before parsing
  const orderInfo = sessionStorage.getItem("orderInfo")
    ? JSON.parse(sessionStorage.getItem("orderInfo"))
    : null;

  const { user } = useSelector((state) => state.authState);
  const { items: cartItems, shippingInfo } = useSelector(
    (state) => state.cartState
  );
  const { error: orderError } = useSelector((state) => state.orderState);

  const paymentData = {
    amount: orderInfo ? Math.round(orderInfo.totalPrice * 100) : 0, // Safeguard for missing totalPrice
    currency: "INR",
    receipt: `receipt_${Date.now()}`,
    notes: {
      user_name: user.name,
      shipping_address: shippingInfo.address,
    },
  };

  const order = {
    orderItems: cartItems,
    shippingInfo,
    itemsPrice: orderInfo?.itemsPrice || 0, // Safeguard for missing data
    shippingPrice: orderInfo?.shippingPrice || 0,
    taxPrice: orderInfo?.taxPrice || 0,
    totalPrice: orderInfo?.totalPrice || 0,
  };

  useEffect(() => {
    validateShipping(shippingInfo, navigate);
    if (orderError) {
      toast(orderError, {
        position: "top-center",
        type: "error",
        onOpen: () => {
          dispatch(clearOrderError());
        },
      });
      return;
    }
  }, [dispatch]);

  const submitHandler = async (e) => {
    e.preventDefault();
    document.querySelector("#pay_btn").disabled = true;

    try {
      // Step 1: Get Razorpay Order ID from your server
      const { data } = await axios.post("/api/v1/payment/process", paymentData);

      const razorpayOrderId = data.order_id; // Use the correct key from the response

      // Step 2: Open Razorpay Checkout
      const options = {
        key: process.env.RAZORPAY_KEY_ID, // Replace with your Razorpay key ID
        amount: paymentData.amount,
        currency: paymentData.currency,
        name: "Your E-commerce",
        description: "Order Payment",
        order_id: razorpayOrderId,
        handler: async (response) => {
          toast("Payment Success!", {
            type: "success",
            position: "top-center",
          });

          order.paymentInfo = {
            id: response.razorpay_payment_id,
            status: "Paid",
          };

          dispatch(orderCompleted());
          dispatch(createOrder(order));
          navigate("/order/success");
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: shippingInfo.phoneNo,
        },
        theme: {
          color: "#3399cc",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

      document.querySelector("#pay_btn").disabled = false;
    } catch (error) {
      toast(error.message, {
        type: "error",
        position: "top-center",
      });
      document.querySelector("#pay_btn").disabled = false;
    }
  };

  return (
    <div className="row wrapper">
      <MetaData title={"Payment Process"} />

      <div className="col-10 col-lg-5">
        <form onSubmit={submitHandler} className="shadow-lg">
          <h1 className="mb-4">Card Info</h1>
          <button id="pay_btn" type="submit" className="btn btn-block py-3">
            Pay - {`₹${orderInfo ? orderInfo.totalPrice : 0}`}
            {/* Safeguard for totalPrice */}
          </button>
        </form>
      </div>
    </div>
  );
}
