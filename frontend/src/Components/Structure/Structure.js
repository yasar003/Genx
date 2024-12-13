import { Link } from "react-router-dom";
import "./Structure.css";
import { useDispatch } from "react-redux";
import { addCartItem } from "../../Actions/Cartaction";
import { useState } from "react";
import { useEffect } from "react";

export default function Structure({ product }) {
  const dispatch = useDispatch();
  const [userAverageRating, setUserAverageRating] = useState(0);

  // Calculate user average rating if there are reviews "productdetail" page also have
  useEffect(() => {
    if (product.reviews && product.reviews.length > 0) {
      // Get the last 7 reviews (if there are at least 7, otherwise take all)
      const reviewsToConsider =
        product.reviews.length > 7
          ? product.reviews.slice(-7) // Slices the last 7 reviews
          : product.reviews;

      // Ensure that review.rating is a number
      const totalRating = reviewsToConsider.reduce((acc, review) => {
        const rating = parseFloat(review.rating); // Ensure rating is treated as a number
        return acc + rating;
      }, 0);

      const userCount = reviewsToConsider.length;

      // Calculate and set average rating, rounding to 1 decimal place
      setUserAverageRating(
        userCount > 0 ? (totalRating / userCount).toFixed(1) : 0
      );
    }
  }, [product.reviews]);

  const truncatedName =
    product.name.length > 20 ? product.name.slice(0, 20) + "..." : product.name;
  return (
    <div className="card ">
      <div className="image-con">
        {product.images.length > 0 && (
          <Link to={`/product/${product._id}`}>
            <img
              className="card-img"
              src={product.images[0].image}
              alt={product.name}
            />
          </Link>
        )}
      </div>

      <div className=" container-fluid">
        <h5 className="card-title">
          <Link to={`/product/${product._id}`}>{truncatedName}</Link>
        </h5>
        <div className="ratings mt-auto">
          {product.numOfReviews >= 8 ? (
            <div className="rating-outer">
              <div
                className="rating-inner"
                style={{ width: `${(userAverageRating / 5) * 100}%` }}
              ></div>
            </div>
          ) : (
            <div className="rating-outer">
              <div
                className="rating-inner"
                style={{ width: `${(product.owner_ratings / 5) * 100}%` }}
              ></div>
            </div>
          )}

          <span id="no_of_reviews">({product.numOfReviews})</span>
        </div>
        <span className="price-box">
          <del className="card-text">
            <i className="fa fa-rupee"></i>
            {product.actualprice}
          </del>
          <p className="card-text">
            <i className="fa fa-rupee"></i>
            {product.price}
          </p>
        </span>

        <div
          id="act_container"
          className="d-flex justify-content-center align-items-center "
        >
          <button
            to={`/product/${product._id}`}
            id="act_btn"
            className="btn btn-block atc_text"
            onClick={() => {
              dispatch(addCartItem(product._id, 1));
            }}
          >
            Add To Cart
          </button>
        </div>
      </div>
    </div>
  );
}
