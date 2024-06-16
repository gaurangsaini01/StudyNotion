const Category = require("../models/Category");
// const Course = require("../models/Course")

async function createCategory(req, res) {
  try {
    const { name, description } = req.body;
    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: "Field Missing",
      });
    }
    //create entry in DB
    const categoryDetails = await Category.create({ name, description });
    console.log(categoryDetails);
    //return response
    return res.status(200).json({
      success: true,
      message: "Category Created Successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}
async function getAllCategories(req, res) {
  try {
    const getAllCategories = await Category.find({});
    return res.status(200).json({
      success: true,
      message: "All Categories returned Successfully",
      data: getAllCategories,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}