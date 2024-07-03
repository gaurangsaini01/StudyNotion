const Course = require("../models/Course");
const Section = require("../models/Section");
const SubSection = require("../models/SubSection");

async function createSection(req, res) {
  try {
     // Fetch data
     const { sectionName, courseId } = req.body;
    console.log("checkpoint 1");
     // Validate data
     if (!sectionName || !courseId) {
       return res.status(400).json({
         success: false,
         message: "Fields Missing",
       });
     }
     console.log("checkpoint 2");
 
     // Ensure the course exists
     const course = await Course.findById(courseId);
     if (!course) {
       return res.status(404).json({
         success: false,
         message: "Course not found",
       });
     }
     console.log("checkpoint 3");
 
     // Create the new section
     const newSection = await Section.create({ sectionName });
     console.log("checkpoint 4");
 
     // Add section entry in course's courseContent array
     course.courseContent.push(newSection._id);
     await course.save();
     console.log("checkpoint 5");
 
     // Populate course content
     const updatedCourse = await Course.findById(courseId).populate('courseContent');
     console.log("checkpoint 6");
 
     console.log(updatedCourse);

    return res.status(200).json({
      success: true,
      message: "Section Created Successfully",
      data:updatedCourse,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error in Creating Section",
    });
  }
}

async function updateSection(req, res) {
  try {
    const { updatedSectionName, sectionId } = req.body;
    if (!updatedSectionName || !sectionId) {
      return res.status(400).json({
        success: false,
        message: "Field Missing",
      });
    }
    const updatedSection = await Section.findByIdAndUpdate(
      sectionId,
      { sectionName: updatedSectionName },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      message: "Update Section successfull",
      data: updatedSection,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error in Updating Section",
    });
  }
}

async function deleteSection(req, res) {
  try {
    const { sectionId, courseId } = req.body;
    if (!sectionId) {
      return res.status(400).json({
        success: false,
        message: "Field Missing",
      });
    }

    const deletedSection = await Section.findByIdAndDelete(sectionId, {
      new: true,
    });
    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      {
        $pull: { courseContent: deletedSection._id },
      },
      { new: true }
    ).populate("courseContent");

    return res.status(200).json({
      success: true,
      message: "Section Deleted successfully",
      deletedSection,
      updatedCourse,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error in deleting Section",
    });
  }
}

module.exports = { createSection, updateSection, deleteSection };
