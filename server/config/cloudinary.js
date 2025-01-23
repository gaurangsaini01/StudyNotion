var cloudinary = require("cloudinary").v2;
require("dotenv").config();
async function connectWithCloudinary() {
  try {
    cloudinary.config({
      cloud_name:process.env.CLOUD_NAME,
      api_key: process.env.API_KEY,
      api_secret: process.env.API_SECRET,
    });
    ("Connection Successfull with cloudinary");
  } catch (error) {
    (err);
  }
}

module.exports = connectWithCloudinary;
