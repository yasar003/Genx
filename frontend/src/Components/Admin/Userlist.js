import { Fragment, useEffect } from "react";
import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { deleteUser, getUsers } from "../../Actions/Useraction";
import { clearError, clearUserDeleted } from "../../Slices/Userslice";
import Loader from "../Loader/Loader";
import { MDBDataTable } from "mdbreact";
import { toast } from "react-toastify";
import Sidenav from "./Sidenav";
import MetaData from "../Metadata";

export default function Userlist() {
  const {
    users = [],
    loading = true,
    error,
    isUserDeleted,
  } = useSelector((state) => state.userState);

  const dispatch = useDispatch();

  const setUsers = () => {
    const data = {
      columns: [
        {
          label: "ID",
          field: "id",
          sort: "asc",
        },
        {
          label: "Name",
          field: "name",
          sort: "asc",
        },
        {
          label: "Email",
          field: "email",
          sort: "asc",
        },
        {
          label: "Role",
          field: "role",
          sort: "asc",
        },
        {
          label: "Actions",
          field: "actions",
          sort: "asc",
        },
      ],
      rows: [],
    };

    // Count the number of admins
    const adminCount = users.filter((user) => user.role === "admin").length;

    users.forEach((user) => {
      const isAdmin = user.role === "admin";

      data.rows.push({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        actions: (
          <Fragment>
            <div className="edit">
              <Link to={`/admin/user/${user._id}`} className=" pencil-icon ">
                <i className="fa fa-pencil"></i>
              </Link>
              <Button
                onClick={(e) => deleteHandler(e, user._id, isAdmin, adminCount)}
                className=" trash-icon "
              >
                <i className="fa fa-trash"></i>
              </Button>
            </div>
          </Fragment>
        ),
      });
    });

    return data;
  };

  const deleteHandler = (e, id, isAdmin, adminCount) => {
    if (isAdmin && adminCount === 1) {
      toast("Cannot delete the last admin!", {
        type: "error",
        position: "top-center",
      });
      return;
    }
    dispatch(deleteUser(id));
  };

  useEffect(() => {
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
    if (isUserDeleted) {
      toast("User Deleted Successfully!", {
        type: "success",
        position: "top-center",
        onOpen: () => dispatch(clearUserDeleted()),
      });
      return;
    }

    dispatch(getUsers);
  }, [dispatch, error, isUserDeleted]);

  return (
    <div className="row">
      <Sidenav />
      <MetaData title={"Admin Userslist"} />

      <div className="col-12 col-md-10">
        <h1 className="my-4">User List</h1>
        <Fragment>
          {loading ? (
            <Loader />
          ) : (
            <div className="table-responsive">
              <MDBDataTable
                data={setUsers()}
                bordered
                striped
                hover
                className="px-3"
              />
            </div>
          )}
        </Fragment>
      </div>
    </div>
  );
}
