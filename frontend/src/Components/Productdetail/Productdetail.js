import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createReview, getProduct } from "../../Actions/Productsaction";
import { useParams } from "react-router-dom";
import Loader from "../Loader/Loader";
import { Carousel } from "react-bootstrap";
import { addCartItem } from "../../Actions/Cartaction";
import { Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import { clearProduct, clearReviewSubmitted } from "../../Slices/Productslice";
import { clearError } from "../../Slices/Authslice";
import ProductReview from "../Reviews/Reviews";
import { Fragment } from "react";
import MetaData from "../Metadata";

function Productdetail() {
  const {
    loading,
    product = {},
    isReviewSubmitted,
    error,
  } = useSelector((state) => state.productState);
  const { user } = useSelector((state) => state.authState);
  const dispatch = useDispatch();
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);

  const increaseQty = () => {
    const count = document.querySelector(".count");
    if (product.stock === 0 || count.valueAsNumber >= product.stock) return;
    const qty = count.valueAsNumber + 1;
    setQuantity(qty);
  };
  const decreaseQty = () => {
    const count = document.querySelector(".count");
    if (count.valueAsNumber === 1) return;
    const qty = count.valueAsNumber - 1;
    setQuantity(qty);
  };

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [rating, setRating] = useState(1);
  const [comment, setComment] = useState("");

  const reviewHandler = () => {
    const formData = new FormData();
    formData.append("rating", rating);
    formData.append("comment", comment);
    formData.append("productId", id);
    dispatch(createReview(formData));
  };
  const [userAverageRating, setUserAverageRating] = useState(0);

  // Calculate user average rating if there are reviews
  useEffect(() => {
    if (product.reviews && product.reviews.length > 0) {
      // Get the last 7 reviews (if there are at least 7, otherwise take all)
      const reviewsToConsider =
        product.reviews.length > 7
          ? product.reviews.slice(-7) // Slices the last 7 reviews
          : product.reviews;

      console.log("Reviews considered: ", reviewsToConsider); // Log reviews being considered

      // Ensure that review.rating is a number
      const totalRating = reviewsToConsider.reduce((acc, review) => {
        const rating = parseFloat(review.rating); // Ensure rating is treated as a number
        console.log("Current rating:", rating); // Log each rating to debug
        return acc + rating;
      }, 0);

      const userCount = reviewsToConsider.length;
      console.log("Total rating: ", totalRating, "User count: ", userCount); // Log rating and count

      // Calculate and set average rating, rounding to 1 decimal place
      setUserAverageRating(
        userCount > 0 ? (totalRating / userCount).toFixed(1) : 0
      );
    }
  }, [product.reviews]);

  useEffect(() => {
    if (isReviewSubmitted) {
      handleClose();
      toast("Review Submitted successfully", {
        type: "success",
        position: "top-center",
        onOpen: () => dispatch(clearReviewSubmitted()),
      });
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
    if (!product._id || isReviewSubmitted) {
      dispatch(getProduct(id));
    }

    return () => {
      dispatch(clearProduct());
    };
  }, [dispatch, id, isReviewSubmitted, error]);

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <div className="container">
          <MetaData title={`Product detail-${id} `} />

          <div className="row f-flex justify-content-around">
            <div className="col-12 col-lg-5 col-md-5 mb-4 d-flex justify-content-center align-items-center">
              <Carousel pause="hover">
                {product?.images &&
                  product.images.length > 0 &&
                  product.images.map((image) => (
                    <Carousel.Item key={image._id}>
                      <img
                        className="d-block"
                        src={image?.image}
                        alt={product.name}
                        width="300"
                      />
                    </Carousel.Item>
                  ))}
              </Carousel>
            </div>

            <div className="col-12 col-lg-5 mt-5">
              <h3>{product.name}</h3>
              <p id="product_id">Product # {product._id}</p>

              <hr />

              {product.numOfReviews >= 8 ? ( //if the user review is >=8 so that the last 7 rating is shown
                <div className="user-rating">
                  <p>
                    Rating:
                    <span className="average-rating">
                      ( {userAverageRating} / 5)
                    </span>
                  </p>
                  <div className="rating-outer">
                    <div
                      className="rating-inner"
                      style={{ width: `${(userAverageRating / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ) : (
                <div className="user-rating">
                  <p>
                    Rating:
                    <span className="average-rating">
                      ({product.owner_ratings})
                    </span>
                  </p>
                  <div className="rating-outer">
                    <div
                      className="rating-inner"
                      style={{ width: `${(product.owner_ratings / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}

              <hr />

              <p id="product_price">${product.price}</p>
              <div className="stockCounter d-inline">
                <span className="btn btn-danger minus" onClick={decreaseQty}>
                  -
                </span>

                <input
                  type="number"
                  className="form-control count d-inline"
                  value={quantity}
                  readOnly
                />

                <span className="btn btn-primary plus" onClick={increaseQty}>
                  +
                </span>
              </div>
              <button
                type="button"
                id="cart_btn"
                disabled={product.stock === 0 ? true : false}
                onClick={() => {
                  dispatch(addCartItem(product._id, quantity));
                }}
                className="btn btn-primary d-inline ml-4"
              >
                Add to Cart
              </button>

              <hr />

              <p>
                Status:
                <span
                  className={product.stock > 0 ? "greenColor" : "redColor"}
                  id="stock_status"
                >
                  {product.stock > 0 ? "In Stock" : "Out of Stock"}
                </span>
              </p>

              <hr />

              <h4 className="mt-2">Description:</h4>
              <p>{product.description}</p>
              <hr />
              <p id="product_seller mb-3">
                Sold by: <strong>{product.seller}</strong>
              </p>
              {user ? (
                <button
                  onClick={handleShow}
                  id="review_btn"
                  type="button"
                  className="btn btn-primary mt-4"
                  data-toggle="modal"
                  data-target="#ratingModal"
                >
                  Submit Your Review
                </button>
              ) : (
                <div className="alert alert-danger mt-5">
                  Login to Post Review
                </div>
              )}

              <div className="row mt-2 mb-5">
                <div className="rating w-50">
                  <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                      <Modal.Title>Submit Review</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <ul className="stars list-inline">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <li
                            key={star}
                            value={star}
                            onClick={() => setRating(star)}
                            className={`list-inline-item star ${
                              star <= rating ? "text-warning" : "text-secondary"
                            }`}
                            onMouseOver={(e) =>
                              e.target.classList.replace(
                                "text-secondary",
                                "text-info"
                              )
                            }
                            onMouseOut={(e) =>
                              e.target.classList.replace(
                                "text-info",
                                star <= rating
                                  ? "text-warning"
                                  : "text-secondary"
                              )
                            }
                            style={{ cursor: "pointer", fontSize: "1.5rem" }}
                          >
                            <i className="fa fa-star"></i>
                          </li>
                        ))}
                      </ul>

                      <textarea
                        onChange={(e) => setComment(e.target.value)}
                        value={comment}
                        name="review"
                        id="review"
                        className="form-control mt-3"
                        placeholder="Write your review here..."
                      ></textarea>
                      <button
                        disabled={loading}
                        onClick={reviewHandler}
                        aria-label="Submit Review"
                        className="btn btn-primary my-3 float-right review-btn px-4 text-white"
                      >
                        Submit
                      </button>
                    </Modal.Body>
                  </Modal>
                </div>
              </div>
            </div>
          </div>

          {product.reviews && product.reviews.length > 0 ? (
            <ProductReview reviews={product.reviews} />
          ) : null}
        </div>
      )}
    </Fragment>
  );
}

export default Productdetail;
