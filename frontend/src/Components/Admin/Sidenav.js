import { Link, useNavigate } from "react-router-dom";
import { NavDropdown } from "react-bootstrap";
import "./Design.css";

export default function Sidenav() {
  const navigate = useNavigate();

  return (
    <nav className="col-md-2 bg-light sidebar">
      <div className="sidebar-sticky">
        <ul className="nav flex-column">
          <li className="nav-item">
            <NavDropdown
              className="dd-title-con d-flex justify-content-start"
              title={
                <span className="producttitle">
                  <i className="fa fa-product-hunt"></i> Product
                </span>
              }
            >
              <NavDropdown.Item onClick={() => navigate("/admin/products")}>
                <i className="fa fa-shopping-basket"></i> All
              </NavDropdown.Item>
              <NavDropdown.Item
                onClick={() => navigate("/admin/products/create")}
              >
                <i className="fa fa-plus"></i> Create
              </NavDropdown.Item>
            </NavDropdown>
          </li>

          <li className="nav-item">
            <Link className="nav-link" to="/admin/orders">
              <i className="fa fa-shopping-basket"></i> Orders
            </Link>
          </li>

          <li className="nav-item">
            <Link className="nav-link" to="/admin/users">
              <i className="fa fa-users"></i> Users
            </Link>
          </li>

          <li className="nav-item">
            <Link className="nav-link" to="/admin/reviews">
              <i className="fa fa-star"></i> Reviews
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
