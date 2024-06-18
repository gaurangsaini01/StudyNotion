const SubSection = require("../models/SubSection.js");
const Section = require("../models/Section.js");
const {uploadImageToCloudinary} = require("../utils/imageUploader.js");
require("dotenv").config();

async function createSubSection(req, res) {
  try {
    //fetch data from req body
    const { timeDuration, title, description, sectionId } = req.body;
    //video
    const video = req.files.videoFile;
    // console.log(video)
    //validate
    if (!timeDuration || !title || !description || !video || !sectionId) {
      return res.status(400).json({
        success: false,
        message: "Field Missing",
      });
    }
    //upload to cloudinary video for getting URL
    const uploadedVideo = await uploadImageToCloudinary(
      video,
      process.env.FOLDER_NAME
    );
    console.log("uploadedVideo:- ",uploadedVideo)
    //create SubSection
    const newSubSection = await SubSection.create({
      title,
      timeDuration,
      description,
      videoURL: uploadedVideo.secure_url,
    });
    //updating Section with Subsection Id
    const updatedSection = await Section.findByIdAndUpdate(
      sectionId,
      {
        $push: { subSection: newSubSection._id },
      },
      { new: true }
    ).populate("subSection");
    return res.status(200).json({
      success: true,
      message: "SubSection Created Successfully",
      updatedSection,
      newSubSection,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
}

async function updateSubSection(req, res) {
    try {
      const {
        timeDuration,
        title,
        description,
        subSectionId,
      } = req.body;
      const video = req.files.video;
      if (
        !timeDuration ||
        !title ||
        !description ||
        !subSectionId
      ) {
        return res.status(400).json({
          success: false,
          message: "Incomplete Fields",
        });
      }
  
      const subSection = await SubSection.findById(subSectionId);
  
      if (!subSection) {
        return res.status(404).json({
          success: false,
          message: "SubSection not found",
        });
      }
  
      if (video) {
        const uploadedVideo = await uploadImageToCloudinary(
          video,
          process.env.FOLDER_NAME,
        );
        subSection.videoURL = uploadedVideo.secure_url;
      }
  
      if (title !== undefined) {
        subSection.title = title
      }
      if (description !== undefined) {
        subSection.description = description
      }
      if (timeDuration !== undefined) {
        subSection.timeDuration = timeDuration
      }
  
      await subSection.save();
  
      return res.status(200).json({
        success: true,
        message: "SubSection updated successfully",
        updatedSubSection: subSection,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }

  async function deleteSubSection(req, res) {
    try {
      const { subSectionId, sectionId } = req.body;
      if (!subSectionId) {
        return res.status(400).json({
          success: false,
          message: "Field Missing",
        });
      }
      const deletedSubSection = await SubSection.findByIdAndDelete(subSectionId, {
        new: true,
      });
  
      if (!deletedSubSection) {
        return res.status(404).json({
          success: false,
          message: "SubSection not found",
        });
      }
  
      const updatedSection = await Section.findByIdAndUpdate(
        sectionId,
        {
          $pull: { subSection: deletedSubSection._id },
        },
        { new: true }
      ).populate("subSection");
      return res.status(200).json({
        success: true,
        message: "SubSection Deleted successfully",
        updatedSection,
        deletedSubSection,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Error in deleting SubSection",
      });
    }
  }

  module.exports={createSubSection,updateSubSection,deleteSubSection}