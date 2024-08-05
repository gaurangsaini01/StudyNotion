const mongoose = require("mongoose");
const {mailSender} = require("../utils/mailsender")
const otpTemplate = require("../mail/templates/emailVerification")
const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  }, 
  otp: {
    type: String,
    required: true,
  },
  // expires-> deletes the document from mongoDB after createdTime + expiresTime Completes
  createdAt: {
    type: Date,
    default: Date.now(),
    expires: 10 * 60,
  },
});

otpSchema.pre("save", async function (next) {
  try {
    const mailResponse = await mailSender(
      this.email,
      "Verification E-mail from StudyNotion",
      otpTemplate(this.otp)
    );
    console.log('Email sent successfully',mailResponse)
    next();
  } catch (err) {
    console.log(`Error in sending email`,err);
  }
});

module.exports = mongoose.model("OTP", otpSchema);

