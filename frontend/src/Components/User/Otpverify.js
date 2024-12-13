import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { verifyOtp, clearAuthError } from "../../Actions/Useraction";
import { useLocation, useNavigate } from "react-router-dom";
import { cleartoken } from "../../Slices/Authslice";

function OtpVerification() {
  const [otp, setOtp] = useState("");
  const dispatch = useDispatch();
  const { error, message, token } = useSelector((state) => state.authState); // Assuming token will be in the state if OTP is verified
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email; // Get email from state passed in navigation

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(verifyOtp({ email, otp })); // Dispatch action to verify OTP
  };

  useEffect(() => {
    if (message) {
      if (message === "OTP verified successfully") {
        toast(message, {
          type: "success",
          position: "top-center",
        });
      }
    }
    if (token) {
      navigate(`/password/reset/${token}`, { replace: true });
      console.log("Navigating to reset password page with token:", token);
      dispatch(cleartoken());
    }

    if (error) {
      toast(error, {
        position: "top-center",
        type: "error",
        onOpen: () => {
          dispatch(clearAuthError()); // Clear the error after showing the toast
        },
      });
      return;
    }
  }, [message, error, dispatch, navigate, token]); // Ensure token is included in dependency array

  return (
    <div className="row wrapper">
      <div className="col-10 col-lg-5">
        <form onSubmit={submitHandler} className="shadow-lg">
          <h1 className="mb-3">Verify OTP</h1>

          <div className="form-group">
            <label htmlFor="otp_field">Enter OTP</label>
            <input
              type="text"
              id="otp_field"
              className="form-control"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          </div>

          <button
            id="verify_otp_button"
            type="submit"
            className="btn btn-block py-3"
          >
            Verify OTP
          </button>
        </form>
      </div>
    </div>
  );
}

export default OtpVerification;
