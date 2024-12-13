import { Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import Loader from "../Loader/Loader";
import { orderDetail as orderDetailAction } from "../../Actions/Orderaction";
import "./Orderdetails.css";
import MetaData from "../Metadata";
export default function Orderdetail() {
  const { orderDetail, loading } = useSelector((state) => state.orderState);
  const {
    shippingInfo = {},
    user = {},
    orderStatus = "Processing",
    orderItems = [],
    totalPrice = 0,
    paymentInfo = {},
  } = orderDetail;
  const isPaid =
    paymentInfo && paymentInfo.status === "succeeded" ? true : false;
  const dispatch = useDispatch();
  const { id } = useParams();

  useEffect(() => {
    dispatch(orderDetailAction(id));
  }, [id]);

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <div className="row d-flex justify-content-center container-fluid">
            <MetaData  title={"User's orders"} />

            <div
              id={`order-details-${orderDetail._id}`}
              className="col-12 col-lg-8 mt-5"
            >
              <h1 id={`order-id-${orderDetail._id}`} className="my-5">
                Order # {orderDetail._id}
              </h1>

              <h4 id={`shipping-info-${orderDetail._id}`} className="mb-4">
                Shipping Info
              </h4>
              <p id={`shipping-name-${user._id}`}>
                <b>Name:</b> {user.name}
              </p>
              <p id={`shipping-phone-${user._id}`}>
                <b>Phone:</b> {shippingInfo.phoneNo}
              </p>
              <p id={`shipping-address-${orderDetail._id}`} className="mb-4">
                <b>Address:</b>
                {shippingInfo.address}, {shippingInfo.city},
                {shippingInfo.postalCode}, {shippingInfo.state},
                {shippingInfo.country}
              </p>
              <p id={`total-amount-${orderDetail._id}`}>
                <b>Amount:</b> ${totalPrice}
              </p>

              <hr />

              <h4
                id={`payment-status-title-${orderDetail._id}`}
                className="my-4"
              >
                Payment
              </h4>
              <p
                id={`payment-status-${orderDetail._id}`}
                className={isPaid ? "greenColor" : "redColor"}
              >
                <b>{isPaid ? "PAID" : "NOT PAID"}</b>
              </p>

              <h4 id={`order-status-title-${orderDetail._id}`} className="my-4">
                Order Status:
              </h4>
              <p
                id={`order-status-${orderDetail._id}`}
                className={
                  orderStatus.includes("Delivered") ? "greenColor" : "redColor"
                }
              >
                <b>{orderStatus}</b>
              </p>

              <h4 id={`order-items-title-${orderDetail._id}`} className="my-4">
                Order Items:
              </h4>

              <hr />
              <div
                id={`cart-items-${orderDetail._id}`}
                className="cart-item my-1"
              >
                {orderItems.map((item) => (
                  <div id={`order-item-${item.product}`} className="row my-5">
                    <div
                      id={`item-image-${item.product}`}
                      className="col-4 col-lg-2"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        height="45"
                        width="65"
                      />
                    </div>

                    <div
                      id={`item-name-${item.product}`}
                      className="col-5 col-lg-5"
                    >
                      <Link to={`/product/${item.product}`}>{item.name}</Link>
                    </div>

                    <div
                      id={`item-price-${item.product}`}
                      className="col-4 col-lg-2 mt-4 mt-lg-0"
                    >
                      <p>${item.price}</p>
                    </div>

                    <div
                      id={`item-quantity-${item.product}`}
                      className="col-4 col-lg-3 mt-4 mt-lg-0"
                    >
                      <p>{item.quantity} Piece(s)</p>
                    </div>
                  </div>
                ))}
              </div>
              <hr />
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
}
