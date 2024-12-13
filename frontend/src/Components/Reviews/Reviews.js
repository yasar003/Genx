export default function ProductReview({ reviews }) {
  return (
    <div className="reviews w-75">
      <h3>Other's Reviews:</h3>
      <hr />
      {reviews && reviews.length > 0 ? (
        reviews.map((review) => (
          <div key={review._id} className="review-card my-3">
            <div className="rating-outer">
              <div
                className="rating-inner"
                style={{ width: `${(review.rating / 5) * 100}%` }}
              ></div>
            </div>
            {/* Safely check for user and name */}
            <p className="review_user">
              by{" "}
              {review.user && review.user.name ? review.user.name : "Anonymous"}
            </p>
            <p className="review_comment">
              {review.comment || "No comment available"}
            </p>
            <hr />
          </div>
        ))
      ) : (
        <p>No reviews available.</p>
      )}
    </div>
  );
}
