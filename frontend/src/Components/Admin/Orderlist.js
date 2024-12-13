import { Fragment, useEffect } from "react";
import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  deleteOrder,
  adminOrders as adminOrdersAction,
} from "../../Actions/Orderaction";
import { clearError, clearOrderDeleted } from "../../Slices/Orderslices";
import Loader from "../Loader/Loader";
import { MDBDataTable } from "mdbreact";
import { toast } from "react-toastify";
import Sidenav from "./Sidenav";
import MetaData from "../Metadata";

export default function Orderlist() {
  const {
    adminOrders = [],
    loading = true,
    error,
    isOrderDeleted,
  } = useSelector((state) => state.orderState);

  const dispatch = useDispatch();

  const setOrders = () => {
    const data = {
      columns: [
        {
          label: "ID",
          field: "id",
          sort: "asc",
        },
        {
          label: "Number of Items",
          field: "noOfItems",
          sort: "asc",
        },
        {
          label: "Amount",
          field: "amount",
          sort: "asc",
        },
        {
          label: "Status",
          field: "status",
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

    adminOrders.forEach((order) => {
      data.rows.push({
        id: order._id,
        noOfItems: order.orderItems.length,
        amount: `$${order.totalPrice}`,
        status: (
          <p
            style={{
              color: order.orderStatus.includes("Processing") ? "red" : "green",
            }}
          >
            {order.orderStatus}
          </p>
        ),
        actions: (
          <Fragment>
            <div className="edit">
              <Link to={`/admin/order/${order._id}`} className="pencil-icon ">
                <i className="fa fa-pencil"></i>
              </Link>
              <Button
                onClick={(e) => deleteHandler(e, order._id)}
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

  const deleteHandler = (e, id) => {
    e.target.disabled = true;
    dispatch(deleteOrder(id));
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
    if (isOrderDeleted) {
      toast("Order Deleted Succesfully!", {
        type: "success",
        position: "top-center",
        onOpen: () => dispatch(clearOrderDeleted()),
      });
      return;
    }

    dispatch(adminOrdersAction);
  }, [dispatch, error, isOrderDeleted]);

  return (
    <div className="row">
      <Sidenav />
      <MetaData title={"Admin Orderlist"} />

      <div className="col-12 col-md-10">
        <h1 className="my-4">Order List</h1>
        <Fragment>
          {loading ? (
            <Loader />
          ) : (
            <div className="table-responsive">
              <MDBDataTable
                data={setOrders()}
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
