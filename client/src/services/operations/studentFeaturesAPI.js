import toast from "react-hot-toast";
import { studentEndPoints } from "../apis";
import { apiConnector } from "../apiconnector";
const { COURSE_PAYMENT_API, COURSE_VERIFY_API, PAYMENT_SUCCESS_EMAIL_API } =
  studentEndPoints;
  import checkImg from "../../assets/Images/check.png"

function loadScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;

    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

export async function buyCourse({ courses, token }) {
  const toastId = toast.loading("Buying...");
  try {
    //load the script
    const response = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );
    if (!response) {
      toast.error("RazorPay Error");
    }
    //initiate the order
    const orderRes = await apiConnector(
      "POST",
      COURSE_PAYMENT_API,
      { courses },
      {
        Authorization: `Bearer ${token}`,
      }
    );
    if (!orderRes?.data?.success) {
      throw new Error(orderRes?.data.message);
    }
    const options = {
        key:import.meta.env.VITE_APP_RAZORPAY_KEY,
        currency:orderRes.data.data.currency,
        amount:orderRes.data.data.amount,
        order_id:orderRes.data.data.id,
        name:"StudyNotion",
        description:"Thank You For purchasing course",
        image:checkImg,
        prefill:{
            name:userDetails.firstName,
            email:userDetails.email
        },
        handler:function(response){
            
        }
    }
  } catch (err) {}
}
