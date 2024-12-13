import { acrequest, acsuccess } from "../Slices/Cartslice";
import axios from "axios";

export const addCartItem = (id, quantity) => async (dispatch) => {
  try {
    dispatch(acrequest());
    const { data } = await axios.get(`/api/v1/product/${id}`);
    dispatch(
      acsuccess({
        product: data.product._id,
        name: data.product.name,
        brand: data.product.brand,
        price: data.product.price,
        image: data.product.images[0].image,
        stock: data.product.stock,
        quantity,
      })
    );
  } catch (error) {}
};
