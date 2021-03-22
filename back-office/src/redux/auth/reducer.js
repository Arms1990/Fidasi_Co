import {
  TOGGLE_AUTHENTICATOR_STATE,
  LOGIN_USER,
  LOGIN_USER_PRE_SUCCESS,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_ERROR,
  REGISTER_USER,
  REGISTER_USER_SUCCESS,
  REGISTER_USER_ERROR,
  LOGOUT_USER,
  FORGOT_PASSWORD,
  FORGOT_PASSWORD_SUCCESS,
  FORGOT_PASSWORD_ERROR,
  RESET_PASSWORD,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_ERROR,
} from "../actions";

export const INIT_STATE = {
  user: localStorage.getItem("user"),
  token: localStorage.getItem("token"),
  baseURL: `${process.env.REACT_APP_APPLICATION_PROTOCOL}://${process.env.REACT_APP_APPLICATION_HOST}:${process.env.REACT_APP_GATEWAY_PORT}`,
  authenticationServer: `${process.env.REACT_APP_APPLICATION_PROTOCOL}://${process.env.REACT_APP_APPLICATION_HOST}:${process.env.REACT_APP_IDENTITY_SERVER_PORT}`,
  webSocketURL: `${process.env.REACT_APP_APPLICATION_PROTOCOL}://${process.env.REACT_APP_APPLICATION_HOST}:${process.env.REACT_APP_NOTIFICATION_SERVICE_PORT}`,
  clientID: process.env.REACT_APP_CLIENT_ID,
  clientSecret: process.env.REACT_APP_CLIENT_SECRET,
  forgotUserMail: "",
  forgotUserMessage: "",
  newPassword: "",
  resetPasswordCode: "",
  resetPasswordMessage: "",
  loading: false,
  error: "",
  qr: "",
  showAuthenticator: false,
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case TOGGLE_AUTHENTICATOR_STATE:
      return { ...state, showAuthenticator: !action.payload.state };
    case LOGIN_USER:
      return { ...state, loading: true, error: "" };
    case LOGIN_USER_PRE_SUCCESS:
      return {
        ...state,
        loading: false,
        qr: action.payload.qr,
        error: "",
        showAuthenticator: true,
      };
    case LOGIN_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        qr: "",
        payload: action.payload,
        error: "",
        showAuthenticator: false,
      };
    case LOGIN_USER_ERROR:
      return {
        ...state,
        loading: false,
        user: "",
        error: action.payload.message,
        showAuthenticator: false,
      };
    case FORGOT_PASSWORD:
      return { ...state, loading: true, error: "" };
    case FORGOT_PASSWORD_SUCCESS:
      return {
        ...state,
        loading: false,
        forgotUserMail: "success",
        forgotUserMessage: action.payload,
        error: "",
      };
    case FORGOT_PASSWORD_ERROR:
      return {
        ...state,
        loading: false,
        forgotUserMail: "",
        error: action.payload.message,
      };
    case RESET_PASSWORD:
      return { ...state, loading: true, error: "" };
    case RESET_PASSWORD_SUCCESS:
      return {
        ...state,
        loading: false,
        newPassword: "success",
        resetPasswordMessage: action.payload,
        resetPasswordCode: "",
        error: "",
      };
    case RESET_PASSWORD_ERROR:
      return {
        ...state,
        loading: false,
        newPassword: "",
        resetPasswordCode: "",
        error: action.payload.message,
      };
    case REGISTER_USER:
      return { ...state, loading: true, error: "" };
    case REGISTER_USER_SUCCESS:
      return { ...state, loading: false, user: action.payload.uid, error: "" };
    case REGISTER_USER_ERROR:
      return {
        ...state,
        loading: false,
        user: "",
        error: action.payload.message,
      };
    case LOGOUT_USER:
      return { ...state, user: null, token: null, error: "" };
    default:
      return { ...state };
  }
};
