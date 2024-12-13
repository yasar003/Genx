import { useDispatch, useSelector } from "react-redux";
import Structure from "../Structure/Structure";
import "./Home.css";
import { useEffect, useState } from "react";
import { getProducts } from "../../Actions/Productsaction";
import Loader from "../Loader/Loader";
import { toast } from "react-toastify";
import Pagination from "react-js-pagination";
import MetaData from "../Metadata";

function Home() {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);

  const { products, loading, error, productsCount, resPerPage } = useSelector(
    (state) => state.productsState
  );
  const setCurrentPageNo = (pageNo) => {
    setCurrentPage(pageNo);
    console.log(pageNo);
  };

  useEffect(() => {
    if (error) {
      return toast.error(error, {
        position: "top-center",
      });
    }
    dispatch(getProducts(null, null, null, null, currentPage, null));
  }, [error, dispatch, currentPage]);

  return (
    <>
      <MetaData title={"Buy Best Products"} />
      {loading ? (
        <Loader />
      ) : (
        <div className="container">
          <section className="contain ">
            <div className=" product-container">
              {products &&
                products.map((product) => (
                  <Structure key={product._id} product={product} />
                ))}
            </div>
          </section>
          {productsCount > 0 && productsCount > resPerPage ? (
            <div className="d-flex justify-content-center mt-5">
              <Pagination
                activePage={currentPage}
                onChange={setCurrentPageNo}
                totalItemsCount={productsCount}
                itemsCountPerPage={resPerPage}
                nextPageText={<span>&raquo;</span>}
                prevPageText={<span>&laquo;</span>}
                firstPageText={"First"}
                lastPageText={"Last"}
                itemClass={"page-item"}
                linkClass={"page-link"}
                disabledClass={"disabled"}
              />
            </div>
          ) : null}
        </div>
      )}
    </>
  );
}

export default Home;
