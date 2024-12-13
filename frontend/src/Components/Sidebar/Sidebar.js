import React, { useState, useEffect } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import "./Sidebar.css";

function Sidebar({
  price,
  setPriceChanged,
  setBrand,
  setCurrentPage,
  setRating,
  disstar,
  category,
}) {
  const [localPrice, setLocalPrice] = useState(price);
  const [categoryBrands, setCategoryBrands] = useState([]);

  // Define category-specific brands
  const allBrands = {
    Electronics: ["All", "Canon", "Intel", "Ryzen", "Portronics", "Nova"],
    Mobile: ["All", "Apple", "Samsung", "OnePlus", "Oppo"],
    Laptops: ["All", "Dell", "HP", "Lenovo", "Apple"],
    Accessories: ["All", "Apple", "Minix", "Boat"],
    Headphones: ["All", "Sony", "Bose", "PTron", "Boat"],
    Shoes: ["All", "Nike", "Adidas", "Puma", "Reebok", "Campus"],
    Home: ["All", "Haier", "Whirlpool", "Samsung", "LG"],
  };

  // Update brands based on the selected category
  useEffect(() => {
    if (category) {
      setCategoryBrands(allBrands[category] || ["All"]);
    } else {
      setCategoryBrands(["All"]);
    }
  }, [category]);

  const selectedBrand = (brand) => {
    setPriceChanged([1, 20000]);
    setCurrentPage(1);
    setBrand(brand);
    setRating("");
  };

  const handleStarClick = (selectedRating) => {
    setRating(selectedRating);
  };

  return (
    <>
      <div className="sidebar">
        {/* Price Filter */}
        <div
          className="px-1 custom-slider"
          onMouseUp={() => setPriceChanged(localPrice)}
        >
          <h5 className="price-header">Price</h5>
          <div className="slider-values">
            <span className="value">
              <strong>${localPrice[0]}</strong>
            </span>
            <span className="middle">
              <strong>-</strong>
            </span>
            <span className="value">
              <strong>${localPrice[1]}</strong>
            </span>
          </div>
          <Slider
            range={true}
            style={{ width: "150px", marginLeft: "17px" }}
            min={1}
            max={20000}
            defaultValue={localPrice}
            onChange={(price) => setLocalPrice(price)}
          />
        </div>
        <hr className="my-3" />

        {/* Brand Filter */}
        <div className="brand-container">
          <h5 className="price-header">Brands</h5>
          {categoryBrands.map((brand, i) => (
            <div key={i} className="mx-2">
              <input
                type="radio"
                id={`brand-${i}`}
                name="brand"
                className="brand-btn"
                onClick={() => selectedBrand(brand)}
              />
              <label htmlFor={`brand-${i}`}>{brand}</label>
            </div>
          ))}
        </div>

        {/* Star Rating Filter */}
        <div className="star-container">
          <h5 className="price-header">Rating</h5>
          <div className="star-rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                onClick={() => handleStarClick(star)}
                className={`star ${disstar >= star ? "selected" : ""}`}
              >
                &#9733;
              </span>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
