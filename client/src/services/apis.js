const BASE_URL = import.meta.env.VITE_APP_BASE_URL;

export const categories = {
  CATEGORIES_API: BASE_URL + "/course/getallcategories",
};

// AUTH ENDPOINTS
export const endpoints = {
  SENDOTP_API: BASE_URL + "/auth/sendotp",
  SIGNUP_API: BASE_URL + "/auth/signup",
  LOGIN_API: BASE_URL + "/auth/login",
  RESETPASSTOKEN_API: BASE_URL + "/auth/reset-password-token",
  RESETPASSWORD_API: BASE_URL + "/auth/reset-password",
};

// export const login = {
//   LOGIN_API: BASE_URL + "/auth/login",
// };
