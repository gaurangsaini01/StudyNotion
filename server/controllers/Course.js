const User = require("../models/Course");
const Category = require("../models/Category");
const Course = require("../models/Course");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
require("dotenv").config();

async function createCourse(req, res) {
  try {
    const { courseName, courseDescription, whatYouWillLearn, price, category } =
      req.body;
    const thumbnail = req.files?.thumbnail; // Use optional chaining in case files are not present

    // Validate the received data
    if (
      !courseDescription ||
      !courseName ||
      !category ||
      !thumbnail ||
      !whatYouWillLearn ||
      !price
    ) {
      return res.status(400).json({
        success: false,
        message: "All Fields Are Required",
      });
    }
    // Validate the category
    const categoryDetails = await Category.findById(category);
    if (!categoryDetails) {
      return res.status(401).json({
        success: false,
        message: "Category Details Not Found",
      });
    }
    // Upload the image to Cloudinary
    const thumbnailImage = await uploadImageToCloudinary(
      thumbnail,
      process.env.FOLDER_NAME
    );

    // Create an entry for the new course in the DB
    const newCourse = await Course.create({
      courseName,
      courseDescription,
      instructor: req.user.id,
      whatYouWillLearn,
      price,
      category,
      thumbnail: thumbnailImage.secure_url,
    });
    console.log("New Course Created:", newCourse);
    // Update the user's course list
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $push: { courses: newCourse._id } },
      { new: true }
    );

    // Update the category's course list
    const updatedCategory = await Category.findByIdAndUpdate(
      category,
      { $push: { courses: newCourse._id } },
      { new: true }
    );

    // Send response
    return res.status(200).json({
      success: true,
      message: "New Course Created Successfully",
    });
  } catch (error) {
    // Log the error
    console.error("Error in createCourse:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error in creating Course",
      error: err.message,
    });
  }
}
async function getAllCourses(req, res) {
  try {
    const allCourses = await Course.find({}).populate("instructor");
    return res.status(200).json({
      success: true,
      message: "All Courses Fetched Successfully",
      data: allCourses,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Cannot get Courses Data",
    });
  }
}

async function getCourseDetails(req, res) {
  try {
    const { courseId } = req.body;
    if (!courseId) {
      return res.status(404).json({
        success: false,
        message: "No courseId provided",
      });
    }
    //find course with this Id
    const courseDetails = await Course.findById(courseId)
      .populate({
        path: "courseContent",
        populate: { path: "subSection" },
      })
      .populate("ratingAndReviews")
      .populate("category")
      .populate("studentsEnrolled")
      .populate({
        path: "instructor",
        populate: { path: "additionalDetails" },
      });
    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: "No course Found with this CourseId",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Details Fetched Successfully",
      courseDetails,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

module.exports = { createCourse, getAllCourses, getCourseDetails };
