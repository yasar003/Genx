import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "./Profile.css";
function Profile() {
  const { user } = useSelector((state) => state.authState);

  return (
    <div className="profile-con">
      <div className="row justify-content-around mt-1 user-info ">
        <div className="col-12 col-md-5 ">
          <figure className="avatar avatar-profile">
            <img
              className="rounded-circle img-fluid"
              src={user.avatar ?? "./images/default_avatar.png"}
              alt=""
            />
          </figure>
          <Link
            to="/myprofile/update"
            id="edit_profile"
            className="btn btn-primary btn-block w-20 my-5"
          >
            Edit Profile
          </Link>
        </div>

        <div className="col-12 col-md-5 ">
          <h4>Full Name</h4>
          <p>{user.name}</p>

          <h4>Email Address</h4>
          <p>{user.email}</p>

          <h4>Joined</h4>
          <p>{String(user.createdAt).substring(0, 10)}</p>

          <Link to="/orders" className="btn btn-danger  btn-block mt-5">
            My Orders
          </Link>
        </div>
      </div>
    </div>
  );
}
export default Profile;
