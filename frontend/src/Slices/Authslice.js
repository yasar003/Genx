import { createSlice } from "@reduxjs/toolkit";

const authslice = createSlice({
  name: "auth",
  initialState: {
    loading: true,
    isAuthenticated: false,
    token: null,
  },
  reducers: {
    loginRequest(state, action) {
      return {
        ...state,
        loading: true,
      };
    },
    loginSuccess(state, action) {
      return {
        loading: false,
        isAuthenticated: true,
        user: action.payload.user,
      };
    },
    loginFail(state, action) {
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    },
    clearError(state, action) {
      return {
        ...state,
        error: null,
      };
    },
    registerRequest(state, action) {
      return {
        ...state,
        loading: true,
      };
    },
    registerSuccess(state, action) {
      return {
        loading: false,
        isAuthenticated: true,
        user: action.payload.user,
      };
    },
    registerFail(state, action) {
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    },
    existuserrequest(state, action) {
      return {
        ...state,
        isAuthenticated: false,
        loading: true,
      };
    },
    existusersuccess(state, action) {
      return {
        loading: false,
        isAuthenticated: true,
        user: action.payload.user,
      };
    },
    existuserfail(state, action) {
      return {
        ...state,
        loading: false,
      };
    },
    logoutsuccess(state, action) {
      return {
        loading: false,
        isAuthenticated: false,
        isupdate: true,
      };
    },
    logoutfail(state, action) {
      return {
        ...state,
        error: action.payload,
      };
    },
    updateprofilerequest(state, action) {
      return {
        ...state,
        loading: true,
        isUpdated: false,
      };
    },
    updateprofilesuccess(state, action) {
      return {
        ...state,
        loading: false,
        user: action.payload.user,
        isUpdated: true,
      };
    },
    updateprofilefail(state, action) {
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    },
    clearupdateprofile(state, action) {
      return {
        ...state,
        isUpdated: false,
      };
    },
    forgotPasswordRequest(state, action) {
      return {
        ...state,
        loading: true,
        message: null,
      };
    },
    forgotPasswordSuccess(state, action) {
      return {
        ...state,
        loading: false,
        message: action.payload.message,
      };
    },
    forgotPasswordFail(state, action) {
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    },
    resetPasswordRequest(state, action) {
      return {
        ...state,
        loading: true,
      };
    },
    resetPasswordSuccess(state, action) {
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        message: action.payload,
        user: action.payload.user,
      };
    },
    resetPasswordFail(state, action) {
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    },
    otpVerifiedSuccess(state, action) {
      return {
        ...state,
        loading: false,
        message: action.payload,
        token: action.payload.token,
      };
    },
    otpVerifiedFail(state, action) {
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    },
    cleartoken(state, action) {
      return {
        ...state,
        token: null,
      };
    },
  },
});

const { actions, reducer } = authslice;

export const {
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
  clearupdateprofile,
  forgotPasswordFail,
  forgotPasswordSuccess,
  forgotPasswordRequest,
  resetPasswordFail,
  resetPasswordRequest,
  resetPasswordSuccess,
  otpVerifiedSuccess,
  otpVerifiedFail,
  cleartoken,
} = actions;

export default reducer;
