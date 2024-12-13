import { useNavigate } from "react-router-dom";
import "./Menu.css";

function Menu({ setBrand, setRating, setWord, setCategory }) {
  const navigate = useNavigate();

  const handleCategory = (Category) => {
    setBrand("All");
    setRating("");
    setCategory(Category); // Set the selected category
    navigate(`/Category/${Category}`);
    setWord(Category);
  };

  const menu_btn = [
    "Electronics",
    "Mobile",
    "Laptops",
    "Accessories",
    "Headphones",
    "Shoes",
    "Home",
  ];

  return (
    <>
      <div className="button-container">
        {menu_btn.map((Category, i) => (
          <button
            key={i}
            className="menu_btn"
            onClick={() => handleCategory(Category)}
          >
            {Category}
          </button>
        ))}
      </div>
    </>
  );
}

export default Menu;
