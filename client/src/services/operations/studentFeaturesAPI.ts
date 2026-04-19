import toast from "react-hot-toast";
import type { NavigateFunction } from "react-router-dom";

import type { AppDispatch } from "../../redux/store";
import type { Course, User } from "../../types/domain";
import { resetCart } from "../../redux/slices/cartSlice";
import { setPaymentLoading } from "../../redux/slices/courseSlice";
import { apiConnector } from "../apiconnector";
import { studentEndPoints } from "../apis";

const { COURSE_PAYMENT_API, COURSE_VERIFY_API, PAYMENT_SUCCESS_EMAIL_API } =
  studentEndPoints;

interface RazorpayPaymentResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface RazorpayOrderMessage {
  id: string;
  amount: number;
  currency: string;
}

interface OrderResponse {
  success: boolean;
  message?: RazorpayOrderMessage | string;
  ap?: boolean;
}

interface RazorpayOptions {
  key: string;
  currency: string;
  amount: number;
  order_id: string;
  name: string;
  description: string;
  prefill: {
    name: string;
    email: string;
  };
  handler: (response: RazorpayPaymentResponse) => void;
}

interface RazorpayInstance {
  open(): void;
  on(
    event: "payment.failed",
    handler: (response: { error: unknown }) => void
  ): void;
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

function loadScript(src: string): Promise<boolean> {
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

async function sendPaymentSuccessEmail(
  response: RazorpayPaymentResponse,
  amount: number,
  _token: string
): Promise<void> {
  try {
    await apiConnector(
      "POST",
      PAYMENT_SUCCESS_EMAIL_API,
      {
        orderId: response.razorpay_order_id,
        paymentId: response.razorpay_payment_id,
        amount,
      }
    );
  } catch (err) {
    console.error(err);
  }
}

async function verifyPayment(
  bodyData: RazorpayPaymentResponse & { courses: string[] },
  _token: string,
  navigate: NavigateFunction,
  dispatch: AppDispatch
): Promise<void> {
  const toastId = toast.loading("Verifying Payment");
  dispatch(setPaymentLoading(true));
  try {
    const result = await apiConnector<{ success: boolean; message?: string }>(
      "POST",
      COURSE_VERIFY_API,
      bodyData
    );
    if (!result?.data?.success) {
      throw new Error(result?.data?.message);
    }
    toast.success("Enrolled Successfully !");
    navigate("/dashboard/enrolled-courses");
    dispatch(resetCart());
  } catch {
    toast.error("Couldn't Verify");
  }
  toast.dismiss(toastId);
  dispatch(setPaymentLoading(false));
}

export async function buyCourse(
  navigate: NavigateFunction,
  dispatch: AppDispatch,
  courses: string[] | Course[],
  token: string,
  userDetails: Pick<User, "firstName" | "email">
): Promise<void> {
  const toastId = toast.loading("Buying...");
  try {
    const response = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );
    if (!response) {
      toast.error("RazorPay Error");
    }

    const orderRes = await apiConnector<OrderResponse>(
      "POST",
      COURSE_PAYMENT_API,
      { courses }
    );

    if (orderRes?.data?.ap) {
      toast.error("User Already enrolled");
      return;
    }

    if (!orderRes?.data?.success) {
      throw new Error(
        typeof orderRes?.data?.message === "string"
          ? orderRes?.data?.message
          : "Order failed"
      );
    }

    const orderMessage = orderRes.data.message as RazorpayOrderMessage;

    const courseIds: string[] = (courses as unknown[]).map((c) =>
      typeof c === "string" ? c : (c as Course)._id
    );

    const options: RazorpayOptions = {
      key: import.meta.env.VITE_APP_RAZORPAY_KEY as string,
      currency: orderMessage.currency,
      amount: orderMessage.amount,
      order_id: orderMessage.id,
      name: "CourseNova AI",
      description: "Thank You For purchasing course",
      prefill: {
        name: userDetails.firstName,
        email: userDetails.email,
      },
      handler: function (paymentResponse: RazorpayPaymentResponse) {
        sendPaymentSuccessEmail(paymentResponse, orderMessage.amount, token);
        verifyPayment(
          { ...paymentResponse, courses: courseIds },
          token,
          navigate,
          dispatch
        );
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
    paymentObject.on("payment.failed", function () {
      toast.error("oops, payment failed");
    });
  } catch {
    toast.error("Already Purchased");
  }
  toast.dismiss(toastId);
}
