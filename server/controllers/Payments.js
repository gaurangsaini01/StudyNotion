const User = require("../models/User");
const Course = require("../models/Course");
const mailSender = require("../utils/mailsender");
const instance = require("../config/razorpay");
const courseEnrollmentEmail = require("../mail/templates/courseEnrollmentTemplate");

//capture payment and initiate the RazorPay order

async function capturePayment(req, res) {
  //get CourseID and userId
  const { courseId } = req.body;
  const userId = req.user.id;
  //validation
  if (!courseId) {
    return res.status(400).json({
      success: false,
      message: "Please provide valid course ID",
    });
  }
  let course;
  try {
    course = await Course.findById(courseId);
    if (!courseId) {
      return res.status(500).json({
        success: false,
        message: "Couldn't Find Course Details",
      });
    }
    //checking If User has already Bought the Course , Check if UserId is present in Course students enrolled or not
    const uid = new mongoose.Types.ObjectId(userId);
    if (course.studentsEnrolled.includes(uid)) {
      return res.status(500).json({
        success: false,
        message: "Student has already purchased this Course",
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }

  //if sab okay , then create order
  const amount = course.price;
  const currency = "INR";
  const options = {
    amount: amount * 100,
    currency,
    receipt: Math.random(Date.now()).toString(),
    //we passed these things in notes because later in verifySignature , when payment will get authorized then we need to give course to user so we will need courseId and UserId there , thats why we send these 2 details as notes.
    notes: {
      courseId,
      userId,
    },
  };
  try {
    const paymentResponse = await instance.orders.create(options);
    console.log(paymentResponse);
    return res.status(200).json({
      success: true,
      course: course.courseName,
      description: course.courseDescription,
      orderId: paymentResponse.id,
      amount: paymentResponse.amount,
      currency: paymentResponse.currency,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Couldnt initiate order",
    });
  }
}

async function verifySignature(req, res) {
  //Secret present in backend(server)
  const webhookSecret = "12345";
  //Razorpay sends signature in this way only , No reasons
  //this signature comes in encrypted format from razorpay and we cannot decrpyt it , so we encrypt our server's webHookSecret and then compare it with razorpay secret to confirm authenticity.
  const signature = req.headers["x-razorpay-signature"];

  //these are some necessary steps (Needed)
  const shasum = crypto.createHmac("sha256", webhookSecret);
  shasum.update(JSON.stringify(req.body));
  //digest is final result
  const digest = shasum.digest("hex");

  if (signature === digest) {
    console.log("payment authorized");

    //now as signature is verified so give course to user
    const { courseId, userId } = req.body.payload.payment.entity.notes;
    try {
      //2 step process:-
      //insert userId in course Model studentsEnrolled array
      const enrolledCourse = await Course.findOneAndUpdate(
        { _id: courseId },
        { $push: { studentsEnrolled: userId } },
        { new: true }
      );
      if (!enrolledCourse) {
        return res.status(500).json({
          success: false,
          message: "Course Not Found",
        });
      }
      console.log(enrolledCourse);
      //insert CourseId in Course inside User Model
      const enrolledStudent = await User.findByIdAndUpdate(
        { _id: userId },
        { $push: { courses: courseId } },
        { new: true }
      );
      console.log(addedCourse);
      //All complete so send mail
      const email = await mailSender(
        enrolledStudent.email,
        "Congratulations you are enrolled",
        courseEnrollmentEmail(enrolledCourse.courseName,enrolledStudent.firstName)
      );
      console.log(email);
      //return res
      return res.status(200).json({
        success: true,
        message: "Course Purchased Successfully",
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Something went wrong when adding the courses",
      });
    }
  } else {
    return res.status(500).json({
      success: false,
      message: "Invalid Request",
    });
  }
}

module.exports = { verifySignature, capturePayment };
