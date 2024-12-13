import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearAuthError, login } from "../../Actions/Useraction";
import { toast } from "react-toastify";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { loading, error, isAuthenticated } = useSelector(
    (state) => state.authState
  );
  const redirect = location.search ? "/" + location.search.split("=")[1] : "/";

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(login(email, password));
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirect);
    }
    console.log(isAuthenticated);
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
  }, [error, isAuthenticated, redirect, dispatch, navigate]);

  return (
    <Fragment>
      <div className="container login-container mt-5">
        <div className="row justify-content-center">
          <div className="col-10 col-lg-6">
            <form onSubmit={submitHandler} className="shadow-lg p-4 login-form">
              <h2 className="text-center mb-4 login-title">
                Welcome Back, Please Login
              </h2>
              <p className="text-center login-description">
                Enter your email and password to continue
              </p>

              <div className="form-group">
                <label htmlFor="email_field">Email</label>
                <input
                  type="email"
                  id="email_field"
                  className="form-control login-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="password_field">Password</label>
                <input
                  type="password"
                  id="password_field"
                  className="form-control login-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="d-flex justify-content-between mb-3">
                <Link to="/password/forgot" className="text-muted">
                  Forgot Password?
                </Link>
                <Link to="/register" className="text-muted">
                  New User?
                </Link>
              </div>

              <button
                id="login_button"
                type="submit"
                className="btn btn-primary btn-block login-button"
                disabled={loading}
              >
                LOGIN
              </button>
            </form>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
