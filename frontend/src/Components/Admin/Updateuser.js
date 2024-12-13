import { Fragment, useEffect, useState } from "react";
import Sidenav from "./Sidenav";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getUser, updateUser } from "../../Actions/Useraction";
import { clearError, clearUserUpdated } from "../../Slices/Userslice";
import { toast } from "react-toastify";
import "./Design.css";
import MetaData from "../Metadata";
export default function Updateuser() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  const { id: userId } = useParams();

  const { loading, isUserUpdated, error, user } = useSelector(
    (state) => state.userState
  );
  const { user: authUser } = useSelector((state) => state.authState);

  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("role", role);
    dispatch(updateUser(userId, formData));
  };

  useEffect(() => {
    if (isUserUpdated) {
      toast("User Updated Succesfully!", {
        type: "success",
        position: "top-center",
        onOpen: () => dispatch(clearUserUpdated()),
      });
      return;
    }

    if (error) {
      toast(error, {
        position: "top-center",
        type: "error",
        onOpen: () => {
          dispatch(clearError());
        },
      });
      return;
    }

    dispatch(getUser(userId));
  }, [isUserUpdated, error, dispatch]);

  useEffect(() => {
    if (user._id) {
      setName(user.name);
      setEmail(user.email);
      setRole(user.role);
    }
  }, [user]);

  return (
    <div className="row">
      <Sidenav />
      <MetaData title={"Admin Update Users"} />

      <div className="col-12 col-md-10">
        <Fragment>
          <div className="update-wrapper my-5">
            <form
              onSubmit={submitHandler}
              className="form-shadow"
              encType="multipart/form-data"
            >
              <h1 className="form-heading mb-4">Update User</h1>

              <div className="form-group">
                <label htmlFor="name_field" className="form-label">
                  Name
                </label>

                <input
                  type="text"
                  id="name_field"
                  className="form-input"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                />
              </div>
              <div className="form-group">
                <label htmlFor="email_field" className="form-label">
                  Email
                </label>

                <input
                  type="text"
                  id="email_field"
                  className="form-input"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                />
              </div>
              <div className="form-group">
                <label htmlFor="role_field" className="form-label">
                  Role
                </label>
                <select
                  disabled={user._id === authUser._id}
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="form-select"
                  id="role_field"
                >
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
              </div>
              <div className="form-group d-flex justify-content-center">
                <button
                  id="update_button"
                  type="submit"
                  disabled={loading}
                  className="btn-update py-3"
                >
                  UPDATE
                </button>
              </div>
            </form>
          </div>
        </Fragment>
      </div>
    </div>
  );
}
