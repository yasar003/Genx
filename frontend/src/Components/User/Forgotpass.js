import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { forgotPassword, clearAuthError } from "../../Actions/Useraction";
import { useNavigate } from "react-router-dom"; // Use useNavigate for v6+
import "./Forgotpass.css";

function Forgotpass() {
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();
  const { error, message } = useSelector((state) => state.authState);
  const navigate = useNavigate(); // Ensure you're using useNavigate()

  const submitHandler = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("email", email);
    dispatch(forgotPassword(formData));
  };

  useEffect(() => {
    if (message) {
      toast(message, {
        type: "success",
        position: "top-center",
      });
      setEmail(""); // Clear email after success
      navigate("/password/otpverification", { state: { email } }); // Navigate to OTP verification page
      return;
    }

    if (error) {
      toast(error, {
        position: "top-center",
        type: "error",
        onOpen: () => {
          dispatch(clearAuthError());
        },
      });
      return;
    }
  }, [message, error, dispatch, navigate, email]); // Ensure email is included in dependency array

  return (
    <>
      <div id="forgotpass-wrapper" className="row wrapper">
        <div
          className="col-10 col-md-4 col-lg-4"
          style={{ marginTop: "100px" }}
        >
          <form
            id="forgotpass-form"
            onSubmit={submitHandler}
            className="shadow-lg"
          >
            <h1 id="forgotpass-title" className="mb-3">
              Forgot Password
            </h1>
            <div className="form-group">
              <label htmlFor="email_field">Enter Email</label>
              <input
                type="email"
                id="email_field"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button
              id="forgot_password_button"
              type="submit"
              className="btn btn-block py-3"
            >
              Send OTP
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Forgotpass;
