import "./Nav.css";
import { useEffect, useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../Actions/Useraction";
import axios from "axios";
import Suggestions from "../Suggestions/Suggestions"; // Updated Suggestions

function Nav({ setBrand, setWord, cartcount }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [keyword, setKeyword] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const { isAuthenticated, user } = useSelector((state) => state.authState);
  const dispatch = useDispatch();

  const suggestionsRef = useRef(null); // Reference for suggestions container
  console.log(user);
  // Handle search submit
  const searchHandler = (e) => {
    e.preventDefault();
    const encodedQuery = encodeURIComponent(keyword);
    navigate(`/search/${encodedQuery}`);
    console.log(encodedQuery);
    setBrand("All");
    setWord(keyword);
    setSuggestions([]);
  };

  // Handle input change and fetch suggestions
  const handleInputChange = (e) => {
    const input = e.target.value;
    setKeyword(input);
    if (input) {
      fetchSuggestions(input);
    } else {
      setSuggestions([]);
    }
  };

  // Fetch search suggestions
  const fetchSuggestions = async (keyword) => {
    try {
      const { data } = await axios.get(
        `/api/v1/products/search-suggestions?keyword=${keyword}`
      );
      setSuggestions(data.suggestions.slice(0, 5)); // Limit suggestions to 5
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    setKeyword(suggestion.name);
    navigate(`/search/${suggestion.name}`);
    setBrand("All");
    setWord(suggestion.name);
    setSuggestions([]);
  };

  const logoutHandler = () => {
    dispatch(logout());
  };

  const clearKeyword = () => setKeyword("");

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target)
      ) {
        setSuggestions([]); // Clear suggestions if click is outside
      }
    };

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (location.pathname === "/") clearKeyword();
    if (location.pathname.includes("Category")) clearKeyword();
    if (location.pathname === "/search/") navigate("/");
  }, [location]);

  return (
    <nav className="navbar">
      <Link to="/">
        <h2 className="logo">GENx</h2>
      </Link>

      <form onSubmit={searchHandler} className="navbar__search">
        <input
          type="text"
          placeholder="Search products..."
          onChange={handleInputChange}
          value={keyword}
          className="navbar__input"
        />
        <button type="submit" className="navbar__button">
          <i className="fa fa-search"></i>
        </button>
        {keyword && (
          <button
            type="button"
            className="navbar__clear-button"
            onClick={clearKeyword}
          >
            <i className="fa fa-times"></i>
          </button>
        )}
        {suggestions.length > 0 && (
          <div ref={suggestionsRef}>
            <Suggestions
              suggestions={suggestions}
              onSelect={handleSuggestionClick}
            />
          </div>
        )}
      </form>

      <div className="navbar__actions">
        {isAuthenticated && user ? (
          <div className="navbar__dropdown">
            <div className="nd_con">
              <img
                src={user?.avatar || "/images/default_avatar.png"}
                alt="User Avatar"
                className="navbar__avatar"
              />
              <span className="navbar__username text-white">{user.name}</span>
              <span className="fa fa-chevron-down "></span>
            </div>

            {/* Added class */}
            <div className="navbar__menu">
              {user.role === "admin" && (
                <button onClick={() => navigate("admin/dashboard")}>
                  Dashboard
                </button>
              )}
              <button onClick={() => navigate("/myprofile")}>My Profile</button>
              <button onClick={logoutHandler}>Logout</button>
            </div>
          </div>
        ) : (
          <Link to="/login" className="navbar__login">
            <button className="login_btn">Login </button>
          </Link>
        )}

        <Link to="/cart" className="navbar__cart">
          <i className="cart-icon fa fa-shopping-cart"></i>
          {cartcount > 0 && (
            <span className="navbar__cart-count">{cartcount}</span>
          )}
        </Link>
      </div>

      <button className="navbar__toggle">=</button>
    </nav>
  );
}

export default Nav;
