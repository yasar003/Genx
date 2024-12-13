import { Fragment, useEffect, useState } from "react";
import Sidenav from "./Sidenav";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getProduct, updateProduct } from "../../Actions/Productsaction";
import { clearError, clearProductUpdated } from "../../Slices/Productslice";
import { toast } from "react-toastify";
import "./Design.css";
import MetaData from "../Metadata";
export default function Updateproduct() {
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState("");
  const [actualprice, setActualprice] = useState("");
  const [description, setDescription] = useState("");
  const [owner_ratings, setOwner_ratings] = useState();
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState(0);
  const [seller, setSeller] = useState("");
  const [images, setImages] = useState([]);
  const [imagesCleared, setImagesCleared] = useState(false);
  const [imagesPreview, setImagesPreview] = useState([]);
  const { id: productId } = useParams();

  const { loading, isProductUpdated, error, product } = useSelector(
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

  const navigate = useNavigate();
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
    formData.append("imagesCleared", imagesCleared);
    dispatch(updateProduct(productId, formData));
  };

  const clearImagesHandler = () => {
    setImages([]);
    setImagesPreview([]);
    setImagesCleared(true);
  };

  useEffect(() => {
    if (isProductUpdated) {
      toast("Product Updated Successfully!", {
        type: "success",
        position: "top-center",
        onOpen: () => dispatch(clearProductUpdated()),
      });
      setImages([]);
      navigate("/admin/products");
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

    dispatch(getProduct(productId));
  }, [isProductUpdated, error, dispatch]);

  useEffect(() => {
    if (product && product._id) {
      setName(product.name);
      setBrand(product.brand);
      setActualprice(product.actualprice);
      setPrice(product.price);
      setStock(product.stock);
      setDescription(product.description);
      setOwner_ratings(product.owner_ratings);
      setCategory(product.category);
      setSeller(product.seller);

      let images = [];
      product.images.forEach((image) => {
        images.push(image.image);
      });
      setImagesPreview(images);
    }
  }, [product]);

  return (
    <div className="row">
      <Sidenav />
      <MetaData title={"Admin Update Product"} />

      <div className="col-12 col-md-10">
        <Fragment>
          <div className="form-wrapper my-5">
            <form
              onSubmit={submitHandler}
              className="product-form shadow-lg"
              encType="multipart/form-data"
            >
              <h1 className="form-title mb-4">Update Product</h1>

              <div className="form-group">
                <label htmlFor="name_field">Name</label>
                <input
                  type="text"
                  id="name_field"
                  className="input-field form-control"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                />
              </div>

              <div className="form-group">
                <label htmlFor="brand_field">Brand</label>
                <input
                  type="text"
                  id="brand_field"
                  className="input-field form-control"
                  onChange={(e) => setBrand(e.target.value)}
                  value={brand}
                />
              </div>

              <div className="form-group">
                <label htmlFor="price_field">Actual Price</label>
                <input
                  type="text"
                  id="price_field"
                  className="input-field form-control"
                  onChange={(e) => setActualprice(e.target.value)}
                  value={actualprice}
                />
              </div>

              <div className="form-group">
                <label htmlFor="price_field">Price</label>
                <input
                  type="text"
                  id="price_field"
                  className="input-field form-control"
                  onChange={(e) => setPrice(e.target.value)}
                  value={price}
                />
              </div>

              <div className="form-group">
                <label htmlFor="description_field">Description</label>
                <textarea
                  className="input-field form-control"
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

              <div className="form-group">
                <label htmlFor="category_field">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="select-field form-control"
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

              <div className="form-group">
                <label htmlFor="stock_field">Stock</label>
                <input
                  type="number"
                  id="stock_field"
                  className="input-field form-control"
                  onChange={(e) => setStock(e.target.value)}
                  value={stock}
                />
              </div>

              <div className="form-group">
                <label htmlFor="seller_field">Seller Name</label>
                <input
                  type="text"
                  id="seller_field"
                  className="input-field form-control"
                  onChange={(e) => setSeller(e.target.value)}
                  value={seller}
                />
              </div>

              <div className="form-group">
                <label>Images</label>
                <div className="custom-file">
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

                {imagesPreview.length > 0 && (
                  <span
                    className="clear-images-icon mr-2"
                    onClick={clearImagesHandler}
                    style={{ cursor: "pointer" }}
                  >
                    <i className="fa fa-trash"></i>
                  </span>
                )}

                {imagesPreview.map((image) => (
                  <img
                    className="image-preview mt-3 mr-2"
                    key={image}
                    src={image}
                    alt={`Image Preview`}
                    width="55"
                    height="52"
                  />
                ))}
              </div>

              <button
                id="update_button"
                type="submit"
                disabled={loading}
                className="btn submit-btn btn-block py-3"
              >
                UPDATE
              </button>
            </form>
          </div>
        </Fragment>
      </div>
    </div>
  );
}
