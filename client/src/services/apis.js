const BASE_URL = import.meta.env.VITE_APP_BASE_URL;

export const categories ={
    CATEGORIES_API:BASE_URL+"/course/getallcategories"
};

export const login={
    LOGIN_API:BASE_URL+"/auth/login"
}