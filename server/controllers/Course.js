const User = require("../models/User");
const Category = require("../models/Category");
const Course = require("../models/Course");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
const Section = require("../models/Section");
const SubSection = require("../models/SubSection");
const CourseProgress = require("../models/CourseProgress");
require("dotenv").config();

async function createCourse(req, res) {
  try {
    const {
      courseName,
      courseDescription,
      whatYouWillLearn,
      price,
      category,
      status,
      instructions,
    } = req.body;
    const thumbnail = req.files?.thumbnail; // Use optional chaining in case files are not present

    // Validate the received data
    if (
      !courseDescription ||
      !courseName ||
      !category ||
      !thumbnail ||
      !whatYouWillLearn ||
      !price ||
      !status ||
      !instructions
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
      status,
      instructions,
    });
    console.log("New Course Created:", newCourse);
    // Update the user's course list
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $push: { courses: newCourse._id.toString() } },
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
      updatedUser,
      newCourse,
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
    const allCourses = await Course.find({})
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

async function editCourse(req, res) {
  try {
    const {
      courseName,
      category,
      courseId,
      courseDescription,
      whatYouWillLearn,
      price,
      status,
      instructions,
    } = req.body;

    let thumbnail;
    if (req.files) {
      thumbnail = req.files.thumbnail;
    } else {
      thumbnail = req.body.thumbnail;
    }

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "No CourseId Provided",
      });
    }
    const updatedField = {};
    if (thumbnail) {
      const thumbnailImage = await uploadImageToCloudinary(
        thumbnail,
        process.env.FOLDER_NAME
      );
      updatedField.thumbnail = thumbnailImage.secure_url;
    }
    if (category) {
      updatedField.category = category;
    }
    if (courseName) {
      updatedField.courseName = courseName;
    }
    if (courseDescription) {
      updatedField.courseDescription = courseDescription;
    }
    if (whatYouWillLearn) {
      updatedField.whatYouWillLearn = whatYouWillLearn;
    }
    if (price) {
      updatedField.price = price;
    }
    if (status) {
      updatedField.status = status;
    }
    if (instructions) {
      updatedField.instructions = instructions;
    }
    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      updatedField,
      { new: true }
    )
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
    return res.status(200).json({
      success: true,
      message: "Course Edited Successfully",
      updatedCourse,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Couldn't Edit Course",
    });
  }
}

async function getCourseDetails(req, res) {
  try {
    const { courseId } = req.body;
    console.log(courseId);
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
      data: courseDetails,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

async function getFullCourseDetails(req, res) {
  try {
    const { courseId } = req.body;
    const userId = req.user.id;
    const courseDetails = await Course.findById(courseId)
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();

    let courseProgressCount = await CourseProgress.findOne({
      courseId: courseId,
      userId: userId,
    });

    console.log("courseProgressCount : ", courseProgressCount);

    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find course with id: ${courseId}`,
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        courseDetails,
        completedVideos: courseProgressCount?.completedVideos
          ? courseProgressCount?.completedVideos
          : [],
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

async function deleteCourse(req, res) {
  try {
    const { courseId } = req.body;

    // Find the course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Unenroll students from the course
    const studentsEnrolled = course.studentsEnrolled;
    for (const studentId of studentsEnrolled) {
      await User.findByIdAndUpdate(studentId, {
        $pull: { courses: courseId },
      });
    }

    // Delete sections and sub-sections
    const courseSections = course.courseContent;
    for (const sectionId of courseSections) {
      // Delete sub-sections of the section
      const section = await Section.findById(sectionId);
      if (section) {
        const subSections = section.subSection;
        for (const subSectionId of subSections) {
          await SubSection.findByIdAndDelete(subSectionId);
        }
      }

      // Delete the section
      await Section.findByIdAndDelete(sectionId);
    }

    // Delete the course
    await Course.findByIdAndDelete(courseId);

    // Removing course from instructor courses array
    await User.findByIdAndUpdate(course.instructor, {
      $pull: { courses: courseId },
    });
    //removing course from category array
    await Category.findByIdAndUpdate(course.category, {
      $pull: { courses: courseId },
    });

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
}

module.exports = {
  createCourse,
  getAllCourses,
  editCourse,
  deleteCourse,
  getCourseDetails,
  getFullCourseDetails,
};
