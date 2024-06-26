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

export const CONTACT_US_API= BASE_URL+'/reach/contact'

// SETTINGS PAGE API
export const settingsEndpoints = {
  UPDATE_DISPLAY_PICTURE_API: BASE_URL + "/profile/updatedisplaypicture",
  UPDATE_PROFILE_API: BASE_URL + "/profile/updateprofile",
  CHANGE_PASSWORD_API: BASE_URL + "/auth/changepassword",
  DELETE_PROFILE_API: BASE_URL + "/profile/deleteaccount",
}



