import { Fragment, useEffect, useState } from "react";
import Sidenav from "./Sidenav";
import { useDispatch, useSelector } from "react-redux";
import { createNewProduct } from "../../Actions/Productsaction";
import { clearError, clearProductCreated } from "../../Slices/Productslice";
import { toast } from "react-toastify";
import "./Design.css";
import MetaData from "../Metadata";

export default function Newproduct() {
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [actualprice, setActualprice] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [owner_ratings, setOwner_ratings] = useState();
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState();
  const [seller, setSeller] = useState("");
  const [images, setImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);

  const { loading, isProductCreated, error } = useSelector(
    (state) => state.productState
  );

  const categories = [
    "Electronics",
    "Mobile",
    "Laptops",
    "Accessories",
    "Headphones",
    "Shoes",
    "Home",
  ];

  const dispatch = useDispatch();

  const onImagesChange = (e) => {
    const files = Array.from(e.target.files);

    files.forEach((file) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagesPreview((oldArray) => [...oldArray, reader.result]);
          setImages((oldArray) => [...oldArray, file]);
        }
      };

      reader.readAsDataURL(file);
    });
  };

  const submitHandler = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("brand", brand);
    formData.append("actualprice", actualprice);
    formData.append("price", price);
    formData.append("owner_ratings", owner_ratings);
    formData.append("stock", stock);
    formData.append("description", description);
    formData.append("seller", seller);
    formData.append("category", category);
    images.forEach((image) => {
      formData.append("images", image);
    });
    dispatch(createNewProduct(formData));
  };

  useEffect(() => {
    if (isProductCreated) {
      toast("Product Created Succesfully!", {
        type: "success",
        position: "top-center",
        onOpen: () => {
          dispatch(clearProductCreated());
          window.location.reload();
        },
      });

      return;
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
  }, [isProductCreated, error, dispatch]);

  return (
    <div className="new-product-row">
      <Sidenav />
      <MetaData title={"Admin New product"} />

      <div className="new-product-content">
        <Fragment>
          <div className="new-product-wrapper my-5">
            <form
              onSubmit={submitHandler}
              className="new-product-form shadow-lg"
              encType="multipart/form-data"
            >
              <h1 className="new-product-title mb-4">New Product</h1>

              <div className="new-product-group">
                <label htmlFor="name_field" className="new-product-label">
                  Name
                </label>
                <input
                  type="text"
                  id="name_field"
                  className="new-product-input form-control"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                />
              </div>

              <div className="new-product-group">
                <label htmlFor="brand_field" className="new-product-label">
                  Brand
                </label>
                <input
                  type="text"
                  id="brand_field"
                  className="new-product-input form-control"
                  onChange={(e) => setBrand(e.target.value)}
                  value={brand}
                />
              </div>

              <div className="new-product-group">
                <label htmlFor="price_field" className="new-product-label">
                  Actual Price
                </label>
                <input
                  type="text"
                  id="price_field"
                  className="new-product-input form-control"
                  onChange={(e) => setActualprice(e.target.value)}
                  value={actualprice}
                />
              </div>

              <div className="new-product-group">
                <label htmlFor="price_field" className="new-product-label">
                  Price
                </label>
                <input
                  type="text"
                  id="price_field"
                  className="new-product-input form-control"
                  onChange={(e) => setPrice(e.target.value)}
                  value={price}
                />
              </div>

              <div className="new-product-group">
                <label
                  htmlFor="description_field"
                  className="new-product-label"
                >
                  Description
                </label>
                <textarea
                  className="new-product-textarea form-control"
                  id="description_field"
                  rows="8"
                  onChange={(e) => setDescription(e.target.value)}
                  value={description}
                ></textarea>
              </div>

              <div className="new-product-group">
                <label htmlFor="rating_field" className="new-product-label">
                  Rating
                </label>
                <input
                  type="text"
                  id="rating_field"
                  className="new-product-input form-control"
                  onChange={(e) => setOwner_ratings(e.target.value)}
                  value={owner_ratings}
                />
              </div>

              <div className="new-product-group">
                <label htmlFor="category_field" className="new-product-label">
                  Category
                </label>
                <select
                  onChange={(e) => setCategory(e.target.value)}
                  className="new-product-select form-control"
                  id="category_field"
                >
                  <option value="">Select</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div className="new-product-group">
                <label htmlFor="stock_field" className="new-product-label">
                  Stock
                </label>
                <input
                  type="number"
                  id="stock_field"
                  className="new-product-input form-control"
                  onChange={(e) => setStock(e.target.value)}
                  value={stock}
                />
              </div>

              <div className="new-product-group">
                <label htmlFor="seller_field" className="new-product-label">
                  Seller Name
                </label>
                <input
                  type="text"
                  id="seller_field"
                  className="new-product-input form-control"
                  onChange={(e) => setSeller(e.target.value)}
                  value={seller}
                />
              </div>

              <div className="new-product-group">
                <label className="new-product-label">Images</label>

                <div className="new-product-file-input custom-file">
                  <input
                    type="file"
                    name="product_images"
                    className="custom-file-input"
                    id="customFile"
                    multiple
                    onChange={onImagesChange}
                  />

                  <label className="custom-file-label" htmlFor="customFile">
                    Choose Images
                  </label>
                </div>
                {imagesPreview.map((image) => (
                  <img
                    className="new-product-preview mt-3 mr-2"
                    key={image}
                    src={image}
                    alt={`Image Preview`}
                    width="55"
                    height="52"
                  />
                ))}
              </div>

              <button
                id="create_button"
                type="submit"
                disabled={loading}
                className="new-product-btn btn-block py-3"
              >
                CREATE
              </button>
            </form>
          </div>
        </Fragment>
      </div>
    </div>
  );
}
