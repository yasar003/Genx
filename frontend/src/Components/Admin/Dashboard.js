import Sidebar from "./Sidenav";
import { Link } from "react-router-dom";
import "./Design.css";
import { getAdminProducts } from "../../Actions/Productsaction";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getUsers } from "../../Actions/Useraction";
import { adminOrders as adminOrdersAction } from "../../Actions/Orderaction";
import MetaData from "../Metadata";
export default function Dashboard() {
  const { products = [] } = useSelector((state) => state.productsState);
  const { adminOrders = [] } = useSelector((state) => state.orderState);
  const { users = [] } = useSelector((state) => state.userState);

  const dispatch = useDispatch();
  let outOfStock = 0;

  if (products.length > 0) {
    products.forEach((product) => {
      if (product.stock === 0) {
        outOfStock = outOfStock + 1;
      }
    });
  }

  let totalAmount = 0;
  if (adminOrders.length > 0) {
    adminOrders.forEach((order) => {
      totalAmount += order.totalPrice;
    });
  }

  useEffect(() => {
    dispatch(getAdminProducts);
    dispatch(getUsers);
    dispatch(adminOrdersAction);
  }, []);

  return (
    <div className="container-fluid p-0">
      <MetaData title={"Admin Dashboard"} />
      <div className="row no-gutters">
        <Sidebar />
        <div className="col-md-10">
          <div className="dashboard-content p-4">
            <h1 className="mb-4">Dashboard</h1>
            <div className="row">
              <div className="col-lg-3 col-sm-6 mb-4">
                <div className="dashboard-box shadow-sm text-white bg-primary">
                  <div className="dashboard-box-body">
                    <h5 className="dashboard-box-title">Total Amount</h5>
                    <p className="dashboard-box-text">${totalAmount}</p>
                  </div>
                </div>
              </div>

              <div className="col-lg-3 col-sm-6 mb-4">
                <div className="dashboard-box shadow-sm text-white bg-success">
                  <div className="dashboard-box-body">
                    <h5 className="dashboard-box-title">Products</h5>
                    <p className="dashboard-box-text">{products.length}</p>
                  </div>
                  <Link
                    className="dashboard-box-footer text-white"
                    to="/admin/products"
                  >
                    View Details
                    <i className="fa fa-angle-right iicon float-right "></i>
                  </Link>
                </div>
              </div>

              <div className="col-lg-3 col-sm-6 mb-4">
                <div className="dashboard-box shadow-sm text-white bg-danger">
                  <div className="dashboard-box-body">
                    <h5 className="dashboard-box-title">Orders</h5>
                    <p className="dashboard-box-text">{adminOrders.length}</p>
                  </div>
                  <Link
                    className="dashboard-box-footer text-white"
                    to="/admin/orders"
                  >
                    View Details
                    <i className="fa fa-angle-right iicon float-right"></i>
                  </Link>
                </div>
              </div>

              <div className="col-lg-3 col-sm-6 mb-4">
                <div className="dashboard-box shadow-sm text-white bg-info">
                  <div className="dashboard-box-body">
                    <h5 className="dashboard-box-title">Users</h5>
                    <p className="dashboard-box-text">{users.length}</p>
                  </div>
                  <Link
                    className="dashboard-box-footer text-white"
                    to="/admin/users"
                  >
                    View Details
                    <i className="fa fa-angle-right iicon float-right"></i>
                  </Link>
                </div>
              </div>

              <div className="col-lg-3 col-sm-6 mb-4">
                <div className="dashboard-box shadow-sm text-white bg-warning">
                  <div className="dashboard-box-body">
                    <h5 className="dashboard-box-title">Out of Stock</h5>
                    <p className="dashboard-box-text">{outOfStock}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
