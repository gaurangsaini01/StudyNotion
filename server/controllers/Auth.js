const OTP = require("../models/OTP")
const User = require("../models/User")
const otpGenerator = require("otp-generator");

//send OTP
async function sendOTP(req, res) {
    try {
      //fetch email from req body
      const { email } = req.body;
      //check if user exist or not
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(401).json({
          success: false,
          message: "User already exists , Please Login",
        });
      }
      //generate otp
      var otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      const result = await OTP.findOne({ otp });
      console.log("Result is Generate OTP Func");
      console.log("OTP", otp);
      console.log("Result", result);
      while (result) {
        otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
          });
      }
  
      //creating entry in DB
      const otpBody = await OTP.create({
        email,
        otp,
      });
      console.log("otp body:", otpBody);
  
      res.status(200).json({
        success: true,
        message: "OTP Sent Successfully",
        otp,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }