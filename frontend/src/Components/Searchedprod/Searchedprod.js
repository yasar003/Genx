import { useDispatch, useSelector } from "react-redux";
import Structure from "../Structure/Structure";
import { useEffect, useState } from "react";
import { getProducts } from "../../Actions/Productsaction";
import Loader from "../Loader/Loader";
import { toast } from "react-toastify";
import Pagination from "react-js-pagination";
import { useParams } from "react-router-dom";
import "./Searchedprod.css";
import Sidebar from "../Sidebar/Sidebar";
import MetaData from "../Metadata";

function Searchedprod({ brand, setBrand, rating, setRating, word, category }) {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [priceChanged, setPriceChanged] = useState([1, 19999]);
  const [disstar, setDisstar] = useState("");

  const { keyword, Category } = useParams();
  const { products, loading, error, productsCount, resPerPage } = useSelector(
    (state) => state.productsState
  );

  const setCurrentPageNo = (pageNo) => {
    setCurrentPage(pageNo);
  };

  useEffect(() => {
    setDisstar(rating);
    if (error) {
      return toast.error(error, { position: "top-center" });
    }

    if (!brand || brand === "All") {
      dispatch(
        getProducts(keyword, priceChanged, Category, rating, currentPage, null)
      );
    } else {
      dispatch(
        getProducts(keyword, priceChanged, Category, rating, currentPage, brand)
      );
    }
  }, [
    error,
    dispatch,
    keyword,
    priceChanged,
    currentPage,
    brand,
    Category,
    rating,
  ]);

  return (
    <>
      <MetaData title={`Search/-${word} `} />
      {loading ? (
        <Loader />
      ) : (
        <div className="main-container ">
          <h3 className="home-heading text-success">Searched products</h3>

          <section className="search_container">
            <div className="side_con">
              <Sidebar
                price={priceChanged}
                setPriceChanged={setPriceChanged}
                setBrand={setBrand}
                setCurrentPage={setCurrentPage}
                setRating={setRating}
                disstar={disstar}
                category={category}
              />

              <div className=" product-container">
                {products &&
                  products.map((product) => (
                    <Structure key={product._id} product={product} />
                  ))}
              </div>
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

export default Searchedprod;
