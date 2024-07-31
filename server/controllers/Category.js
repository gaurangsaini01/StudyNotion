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
async function categoryPageDetails(req, res) {
  try {
    //get CategoryId
    const { categoryId } = req.body;
    //get all courses with that category
    const selectedCategoryCourses = await Category.findById(
      categoryId
    ).populate({
      path: "courses",
      match: { status: "published" },
      populate: [{ path: "ratingAndReviews" }, { path: "instructor" }],
    });
    //validate if there is no category of such type
    if (!selectedCategoryCourses) {
      return res.status(401).json({
        success: false,
        message: "No  such Category",
      });
    }

    // Handle the case when there are no courses
    //  if (selectedCategoryCourses.courses.length === 0) {
    //   console.log("No courses found for the selected category.")
    //   return res.status(200).json({
    //     success: true,
    //     message: "No courses found for the selected category.",
    //     data:selectedCategoryCourses
    //   })
    // }

    //get courses for different categories
    const differentCategoryCourses = await Category.find({
      _id: { $ne: categoryId },
    }).populate({
      path: "courses",
      match: { status: "published" },
      populate: [{ path: "ratingAndReviews" }, { path: "instructor" }],
    });
    // get top Selling Courses
    // const topSellingCourses =await Course.aggregate([
    //     {$match:}
    // ])
    // return all 3 types of courses
    return res.status(200).json({
      success: true,
      message: "All Retrieved",
      data: {
        selectedCategoryCourses,
        differentCategoryCourses,
        // topSellingCourses
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Cannot get category page details",
    });
  }
}

module.exports = { getAllCategories, createCategory, categoryPageDetails };
