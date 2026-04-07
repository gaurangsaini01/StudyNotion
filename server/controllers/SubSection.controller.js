const SubSection = require("../models/SubSection.js");
const Section = require("../models/Section.js");
const {
  deleteFileFromCloudinary,
  uploadImageToCloudinary,
} = require("../utils/imageUploader.js");
require("dotenv").config();

async function createSubSection(req, res) {
  try {
    //fetch data from req body
    const { timeDuration, title, description, sectionId } = req.body;
    //video
    const video = req.files?.video;
    const notesPdf = req.files?.notesPdf;
    //validate
    if ( !title || !description || !video || !sectionId) {
      return res.status(400).json({
        success: false,
        message: "Field Missing",
      });
    }
    //upload to cloudinary video for getting URL
    // Check video size (assuming size is in bytes)
    if (video.size > 10 * 1024 * 1024) { // 10MB
      return res.status(400).json({
      success: false,
      message: "Video size should not exceed 10MB",
      });
    }

    const uploadedVideo = await uploadImageToCloudinary(
      video,
      process.env.FOLDER_NAME
    );

    let uploadedNotesPdfUrl = "";
    let uploadedNotesPdfName = "";
    let uploadedNotesPdfPublicId = "";
    if (notesPdf) {
      const uploadedNotesPdf = await uploadImageToCloudinary(
        notesPdf,
        process.env.FOLDER_NAME
      );
      uploadedNotesPdfUrl = uploadedNotesPdf.secure_url;
      uploadedNotesPdfName = notesPdf.name;
      uploadedNotesPdfPublicId = uploadedNotesPdf.public_id;
    }
    //create SubSection
    const newSubSection = await SubSection.create({
      title,
      timeDuration,
      description,
      videoURL: uploadedVideo.secure_url,
      videoPublicId: uploadedVideo.public_id,
      notesPdfUrl: uploadedNotesPdfUrl,
      notesPdfName: uploadedNotesPdfName,
      notesPdfPublicId: uploadedNotesPdfPublicId,
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
      data:updatedSection,
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
    const { title, description, subSectionId, sectionId, removeNotesPdf } = req.body;
    let video = req.body.video;
    const notesPdf = req.files?.notesPdf;
    // if (!title || !description || !subSectionId) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Incomplete Fields",
    //   });
    // }

    const subSection = await SubSection.findById(subSectionId);

    if (!subSection) {
      return res.status(404).json({
        success: false,
        message: "SubSection not found",
      });
    }

    // Check if video is a URL or file
    if (req.files && req.files.video) {
      // Check video size (assuming size is in bytes)
      if (req.files.video.size > 10 * 1024 * 1024) { // 10MB
      return res.status(400).json({
        success: false,
        message: "Video size should not exceed 10MB",
      });
      }
      const uploadedVideo = await uploadImageToCloudinary(
      req.files.video,
      process.env.FOLDER_NAME,
      );
      if (subSection.videoURL) {
        await deleteFileFromCloudinary({
          publicId: subSection.videoPublicId,
          fileUrl: subSection.videoURL,
          resourceTypes: ["video"],
        });
      }
      subSection.videoURL = uploadedVideo.secure_url;
      subSection.videoPublicId = uploadedVideo.public_id;
    } else if (video && !video.startsWith('http')) {
      // Handle case when video is not a valid URL
      return res.status(400).json({
      success: false,
      message: "Invalid video URL",
      });
    } else if (video) {
      subSection.videoURL = video;
    }

    if (notesPdf) {
      const uploadedNotesPdf = await uploadImageToCloudinary(
        notesPdf,
        process.env.FOLDER_NAME
      );
      if (subSection.notesPdfUrl) {
        await deleteFileFromCloudinary({
          publicId: subSection.notesPdfPublicId,
          fileUrl: subSection.notesPdfUrl,
        });
      }
      subSection.notesPdfUrl = uploadedNotesPdf.secure_url;
      subSection.notesPdfName = notesPdf.name;
      subSection.notesPdfPublicId = uploadedNotesPdf.public_id;
    } else if (removeNotesPdf === "true") {
      if (subSection.notesPdfUrl) {
        await deleteFileFromCloudinary({
          publicId: subSection.notesPdfPublicId,
          fileUrl: subSection.notesPdfUrl,
        });
      }
      subSection.notesPdfUrl = "";
      subSection.notesPdfName = "";
      subSection.notesPdfPublicId = "";
    }

    if (title !== undefined) {
      subSection.title = title;
    }
    if (description !== undefined) {
      subSection.description = description;
    }

    await subSection.save();
    const updatedSection = await Section.findById(sectionId).populate("subSection");

    return res.status(200).json({
      success: true,
      message: "SubSection updated successfully",
      updatedSubSection: subSection,
      data: updatedSection,
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

      if (deletedSubSection.notesPdfUrl) {
        await deleteFileFromCloudinary({
          publicId: deletedSubSection.notesPdfPublicId,
          fileUrl: deletedSubSection.notesPdfUrl,
        });
      }

      if (deletedSubSection.videoURL) {
        await deleteFileFromCloudinary({
          publicId: deletedSubSection.videoPublicId,
          fileUrl: deletedSubSection.videoURL,
          resourceTypes: ["video"],
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
        data:updatedSection,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Error in deleting SubSection",
      });
    }
  }

  module.exports={createSubSection,updateSubSection,deleteSubSection}
