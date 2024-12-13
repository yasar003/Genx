import { Fragment, useEffect } from "react";
import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { deleteProduct, getAdminProducts } from "../../Actions/Productsaction";
import { clearError, clearProductDeleted } from "../../Slices/Productslice";
import Loader from "../Loader/Loader";
import { MDBDataTable } from "mdbreact";
import { toast } from "react-toastify";
import Sidenav from "./Sidenav";
import MetaData from "../Metadata";

export default function Productlist() {
  const {
    products = [],
    loading = true,
    error,
  } = useSelector((state) => state.productsState);
  const { isProductDeleted, error: productError } = useSelector(
    (state) => state.productState
  );
  const dispatch = useDispatch();

  const setProducts = () => {
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
          label: "Price",
          field: "price",
          sort: "asc",
        },
        {
          label: "Stock",
          field: "stock",
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

    products.forEach((product) => {
      data.rows.push({
        id: product._id,
        name: product.name,
        price: `$${product.price}`,
        stock: product.stock,
        actions: (
          <Fragment>
            <div className="edit">
              <Link
                to={`/admin/product/${product._id}`}
                className="pencil-icon"
              >
                <i className="fa fa-pencil"></i>
              </Link>
              <Button
                onClick={(e) => deleteHandler(e, product._id)}
                className="trash-icon"
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
    dispatch(deleteProduct(id));
  };

  useEffect(() => {
    if (error || productError) {
      toast(error || productError, {
        position: "top-center",
        type: "error",
        onOpen: () => {
          dispatch(clearError());
        },
      });
      return;
    }
    if (isProductDeleted) {
      toast("Product Deleted Succesfully!", {
        type: "success",
        position: "top-center",
        onOpen: () => dispatch(clearProductDeleted()),
      });
      return;
    }

    dispatch(getAdminProducts);
  }, [dispatch, error, isProductDeleted]);

  return (
    <div className="row">
      <Sidenav />
      <MetaData title={"Admin productlist"} />

      <div className="col-12 col-md-10">
        <h1 className="my-4">Product List</h1>
        <Fragment>
          {loading ? (
            <Loader />
          ) : (
            <div className="table-responsive">
              <MDBDataTable
                data={setProducts()}
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
