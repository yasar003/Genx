import { Link } from "react-router-dom";
import { FaTruck, FaClipboardCheck, FaCreditCard } from "react-icons/fa"; // Importing icons
import "./Steps.css";
function Steps({ shipping, confirmOrder, payment }) {
  return (
    <div className="checkout-progress d-flex justify-content-center mt-1">
      <Link to="/shipping" aria-label="Shipping Step">
        <div className={`step ${shipping ? "active-step" : "incomplete"}`}>
          <div className="step-icon">{<FaTruck />}</div>

          <span className="step-label">Shipping</span>
        </div>
      </Link>
      <div className={`step-line ${confirmOrder ? "active-line" : ""}`}></div>

      <Link to="/order/confirm" aria-label="Order Confirmation Step">
        <div className={`step ${confirmOrder ? "active-step" : "incomplete"}`}>
          <div className="step-icon">{<FaClipboardCheck />}</div>

          <span className="step-label">Confirm Order</span>
        </div>
      </Link>
      <div className={`step-line ${payment ? "active-line" : ""}`}></div>

      <Link to="/payment" aria-label="Payment Step">
        <div className={`step ${payment ? "active-step" : "incomplete"}`}>
          <div className="step-icon">{<FaCreditCard />}</div>

          <span className="step-label">Payment</span>
        </div>
      </Link>
    </div>
  );
}

export default Steps;
