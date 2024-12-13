import {
  loginRequest,
  loginSuccess,
  loginFail,
  clearError,
  registerRequest,
  registerSuccess,
  registerFail,
  existuserrequest,
  existusersuccess,
  existuserfail,
  logoutsuccess,
  logoutfail,
  updateprofilerequest,
  updateprofilesuccess,
  updateprofilefail,
  forgotPasswordFail,
  forgotPasswordSuccess,
  forgotPasswordRequest,
  resetPasswordFail,
  resetPasswordRequest,
  resetPasswordSuccess,
  otpVerifiedSuccess,
  otpVerifiedFail,
} from "../Slices/Authslice";
import {
  usersRequest,
  usersSuccess,
  usersFail,
  userRequest,
  userSuccess,
  userFail,
  deleteUserRequest,
  deleteUserSuccess,
  deleteUserFail,
  updateUserRequest,
  updateUserSuccess,
  updateUserFail,
} from "../Slices/Userslice";
import axios from "axios";

export const login = (email, password) => async (dispatch) => {
  try {
    dispatch(loginRequest());
    const { data } = await axios.post(`/api/v1/login`, { email, password });
    dispatch(loginSuccess(data));
  } catch (error) {
    dispatch(loginFail(error.response.data.message));
  }
};

export const clearAuthError = () => (dispatch) => {
  dispatch(clearError());
};
export const register = (userData) => async (dispatch) => {
  try {
    dispatch(registerRequest());
    const config = {
      headers: {
        "Content-type": "multipart/form-data",
      },
    };

    const { data } = await axios.post(`/api/v1/register`, userData, config);
    dispatch(registerSuccess(data));
  } catch (error) {
    dispatch(registerFail(error.response.data.message));
  }
};

export const existuser = async (dispatch) => {
  try {
    dispatch(existuserrequest());

    const { data } = await axios.get(`/api/v1/myprofile`);
    dispatch(existusersuccess(data));
  } catch (error) {
    dispatch(existuserfail(error.response.data.message));
  }
};

export const logout = () => {
  return async (dispatch) => {
    try {
      await axios.get(`/api/v1/logout`);
      dispatch(logoutsuccess()); // Dispatch success action if API call is successful
    } catch (error) {
      dispatch(logoutfail()); // Dispatch failure action if API call fails
    }
  };
};
export const updateProfile = (userData) => async (dispatch) => {
  try {
    dispatch(updateprofilerequest());
    const config = {
      headers: {
        "Content-type": "multipart/form-data",
      },
    };

    const { data } = await axios.put(`/api/v1/update`, userData, config);
    dispatch(updateprofilesuccess(data));
  } catch (error) {
    dispatch(updateprofilefail(error.response.data.message));
  }
};

export const forgotPassword = (formData) => async (dispatch) => {
  try {
    dispatch(forgotPasswordRequest());
    const config = {
      headers: {
        "Content-type": "application/json",
      },
    };
    const { data } = await axios.post(
      `/api/v1/password/forgot`,
      formData,
      config
    );
    dispatch(forgotPasswordSuccess(data));
  } catch (error) {
    dispatch(forgotPasswordFail(error.response.data.message));
  }
};

export const verifyOtp = (otpData) => async (dispatch) => {
  try {
    const { data } = await axios.post(
      "/api/v1/password/otpverification",
      otpData
    );
    dispatch(otpVerifiedSuccess({ message: data.message, token: data.token }));
    console.log("Received data:", data.message);
    console.log("Received resetPasswordToken:", data.token);
  } catch (error) {
    dispatch(otpVerifiedFail(error.response.data.message));
  }
};

export const resetPassword = (formData, token) => async (dispatch) => {
  try {
    dispatch(resetPasswordRequest());
    const config = {
      headers: {
        "Content-type": "application/json",
      },
    };
    const { data } = await axios.post(
      `/api/v1/password/reset/${token}`,
      formData,
      config
    );
    dispatch(resetPasswordSuccess({ message: data.message, user: data.user }));
    console.log("message:", data.message);
    console.log("mess:", data.user);
  } catch (error) {
    dispatch(resetPasswordFail(error.response.data.message));
    console.log("error:", error.response.data.message);
  }
};

export const getUsers = async (dispatch) => {
  try {
    dispatch(usersRequest());
    const { data } = await axios.get(`/api/v1/admin/users`);
    dispatch(usersSuccess(data));
  } catch (error) {
    dispatch(usersFail(error.response.data.message));
  }
};

export const getUser = (id) => async (dispatch) => {
  try {
    dispatch(userRequest());
    const { data } = await axios.get(`/api/v1/admin/user/${id}`);
    dispatch(userSuccess(data));
  } catch (error) {
    dispatch(userFail(error.response.data.message));
  }
};

export const deleteUser = (id) => async (dispatch) => {
  try {
    dispatch(deleteUserRequest());
    await axios.delete(`/api/v1/admin/user/${id}`);
    dispatch(deleteUserSuccess());
  } catch (error) {
    dispatch(deleteUserFail(error.response.data.message));
  }
};

export const updateUser = (id, formData) => async (dispatch) => {
  try {
    dispatch(updateUserRequest());
    const config = {
      headers: {
        "Content-type": "application/json",
      },
    };
    await axios.put(`/api/v1/admin/user/${id}`, formData, config);
    dispatch(updateUserSuccess());
  } catch (error) {
    dispatch(updateUserFail(error.response.data.message));
  }
};
