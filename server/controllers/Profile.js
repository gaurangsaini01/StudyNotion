const User = require("../models/User");
const Profile = require("../models/Profile");
const Course = require("../models/Course");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
require("dotenv").config();

async function updateProfile(req, res) {
  try {
    const { dateOfBirth = "", gender, contactNumber, about = "" } = req.body;
    //userid nikal lo
    const id = req.user.id;
    //validate
    if (!id || !contactNumber || !gender) {
      return res.status(400).json({
        success: false,
        message: "All fields Required",
      });
    }
    //find Profile
    const userDetails = await User.findById(id);
    const profileId = userDetails.additionalDetails;
    const profileDetails = await Profile.findById(profileId);

    //updateProfile
    profileDetails.dateOfBirth = dateOfBirth;
    profileDetails.about = about;
    profileDetails.gender = gender;
    profileDetails.contactNumber = contactNumber;
    await profileDetails.save();

    return res.status(200).json({
      success: true,
      message: "Profile Updated Successfully",
      profileDetails,
    });
  } catch (err) {
    return res.status(500).json({
      success: true,
      message: "Profile cannot be updated",
    });
  }
}

async function deleteAccount(req, res) {
  try {
    //get id
    const id = req.user.id;
    //validate
    const userDetails = await User.findById(id);
    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "Cannot Find a user with this Id",
      });
    }
    //delete profile model
    const profileId = userDetails.additionalDetails;
    const deletedProfile = await Profile.findByIdAndDelete(profileId);
    //deleting user id from course model (studentEnrolled array if user exists there)
    await Course.updateMany(
      { _id: { $in: userDetails.courses } },
      { $pull: { studentsEnrolled: id } }
    );

    //delete User model
    const deletedUser = await User.findByIdAndDelete(id);

    //send response
    return res.status(200).json({
      success: true,
      message: "Both user and its additional Details are Deleted From DB",
      deletedUser,
      deletedProfile,
    });
  } catch (err) {
    return res.status(500).json({
      success: true,
      message: "Error Deleting Account",
    });
  }
}

async function getAllUserDetails(req, res) {
  try {
    const id = req.user.id;
    const userDetails = await User.findById(id)
      .populate("additionalDetails")
      .exec();
    // console.log(userDetails);
    res.status(200).json({
      success: true,
      message: "User Data fetched successfully",
      data: userDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
