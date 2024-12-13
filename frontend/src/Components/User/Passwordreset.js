import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { clearAuthError, resetPassword } from "../../Actions/Useraction"; // Import the action
import { toast, ToastContainer } from "react-toastify"; // Import Toast components
import "react-toastify/dist/ReactToastify.css"; // Toastify styles

const PasswordReset = () => {
  const { token } = useParams(); // Extract the token from URL
  const dispatch = useDispatch(); // Dispatch hook for Redux actions
  const navigate = useNavigate();
  // State for form data
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const { loading, error, isAuthenticated } = useSelector(
    (state) => state.authState
  ); // Select the state

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    // Dispatch the resetPassword action
    dispatch(resetPassword(formData, token));
    console.log("Form data:", formData); // Debugging: check formData
    console.log("Reset token:", token); // Debugging: check token
  };

  // useEffect to handle toast notifications and navigate after success
  useEffect(() => {
    if (isAuthenticated) {
      toast("Password reset successful", {
        type: "success",
        position: "top-center",
      });
      navigate("/");
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
  }, [error, dispatch, navigate, isAuthenticated]); // Only re-run the effect when message or error changes

  return (
    <div className="password-reset-container">
      <h2>Reset Your Password</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="password">New Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="confirmPassword">Confirm New Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>

        {error && <div className="error-message">{error}</div>}

        <button type="submit" disabled={loading}>
          {loading ? "Resetting Password..." : "Reset Password"}
        </button>
      </form>
      <ToastContainer /> {/* Add this to render the toast messages */}
    </div>
  );
};

export default PasswordReset;
