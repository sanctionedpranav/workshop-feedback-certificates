import emailjs from "@emailjs/browser";

// 👇 Replace these with your actual EmailJS credentials
const SERVICE_ID = "service_af30a9j";
const TEMPLATE_ID = "template_p16zdha";
const PUBLIC_KEY = "EBEg2mwWIdnA4pbCg";

/**
 * Sends an OTP to the user's email using EmailJS.
 */
export const sendEmailOtp = async (email: string, otp: string) => {
  try {
    if (!email) throw new Error("Email address is empty.");

    const templateParams = {
      email: email, // ✅ This must match the variable name in your EmailJS template
      passcode: otp, // ✅ Match this to your EmailJS template variable (e.g., {{passcode}})
      from_name: "Workshop Feedback System", // Optional
      message: `Your verification code is ${otp}`,
      time: "12:01",
    };

    const response = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      templateParams,
      PUBLIC_KEY
    );

    console.log("Email OTP sent successfully!", response.status, response.text);
    return true;
  } catch (error) {
    console.error("Error sending email OTP:", error);
    return false;
  }
};
