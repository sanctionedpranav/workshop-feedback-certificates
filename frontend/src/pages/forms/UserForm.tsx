// src/pages/admin/UserForm.tsx
import React, { useState } from "react";
import AdminSidebar from "../../components/admin/Sidebar";
import AdminTopbar from "../../components/admin/Topbar";
import DashboardViewport from "../../components/admin";
import AdminFooter from "../../components/admin/Footer";
import { collection, addDoc } from "firebase/firestore";
import { db, auth, RecaptchaVerifier, signInWithPhoneNumber } from "../../api/firebase";
import { sendEmailOtp } from "../../utils/emailService";
import { useNavigate } from "react-router-dom";

interface UserFormProps {
  formId: string;
  formData: {
    workshopName: string;
    collegeName: string;
    date: string;
    instructions: string;
  };
}

const UserForm: React.FC<UserFormProps> = ({ formId, formData }) => {
  const navigate = useNavigate();

  // Basic input states
  const [name, setName] = useState("");
  const [course, setCourse] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [feedback, setFeedback] = useState("");

  // OTP states
  const [phoneOtp, setPhoneOtp] = useState("");
  const [emailOtp, setEmailOtp] = useState("");
  const [emailOtpGenerated, setEmailOtpGenerated] = useState("");
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<any>(null);

  const [loading, setLoading] = useState(false);

  // ✅ STEP 1 — Setup Recaptcha once
  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
      });
    }
  };

  // ✅ STEP 2 — Send OTP to phone
  const sendPhoneOtp = async () => {
    if (!phone) return alert("Enter phone number first!");
    setupRecaptcha();

    try {
      const appVerifier = window.recaptchaVerifier;
      const confirmation = await signInWithPhoneNumber(auth, "+91" + phone, appVerifier);
      setConfirmationResult(confirmation);
      alert("OTP sent to your phone!");
    } catch (error) {
      console.error("Phone OTP Error:", error);
      alert("Failed to send OTP. Try again.");
    }
  };

  // ✅ STEP 3 — Verify phone OTP
  const verifyPhoneOtp = async () => {
    if (!phoneOtp || !confirmationResult) return alert("Enter OTP first!");
    try {
      await confirmationResult.confirm(phoneOtp);
      setPhoneVerified(true);
      alert("✅ Phone verified successfully!");
    } catch (error) {
      console.error(error);
      alert("Invalid phone OTP!");
    }
  };

  // ✅ STEP 4 — Send OTP to email
  const sendEmailOtpHandler = async () => {
    if (!email) return alert("Enter email first!");
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setEmailOtpGenerated(generatedOtp);
    await sendEmailOtp(email, generatedOtp);
    alert("OTP sent to your email!");
  };

  // ✅ STEP 5 — Verify email OTP
  const verifyEmailOtp = () => {
    if (emailOtp === emailOtpGenerated) {
      setEmailVerified(true);
      alert("✅ Email verified successfully!");
    } else {
      alert("Invalid Email OTP!");
    }
  };

  // ✅ STEP 6 — Submit final form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!phoneVerified || !emailVerified) {
      alert("Please verify both phone and email before submitting.");
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, "submissions"), {
        formId,
        name,
        course,
        phone,
        email,
        feedback,
        timestamp: new Date().toISOString(),
      });
      alert("✅ Form submitted successfully!");
      navigate("/thank-you");
    } catch (err) {
      console.error(err);
      alert("Submission failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar role="admin" />
      <div className="flex flex-col flex-1">
        <AdminTopbar />
        <main className="p-6 flex-1">
          <DashboardViewport>
            <div className="max-w-4xl mx-auto mt-10 p-8 shadow-lg rounded-xl bg-white border border-gray-200">
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
                Workshop Feedback Form
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Read-only Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(formData).map(([key, value]) => (
                    <div key={key}>
                      <label className="block text-sm font-semibold text-gray-700 capitalize">
                        {key.replace(/([A-Z])/g, " $1")}
                      </label>
                      <input
                        value={value}
                        readOnly
                        className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
                      />
                    </div>
                  ))}
                </div>

                <hr className="my-6" />

                {/* Name & Course */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    required
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400"
                  />
                  <input
                    required
                    placeholder="Course"
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400"
                  />
                </div>

                {/* Phone OTP */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700">Phone</label>
                  <div className="flex space-x-2">
                    <input
                      required
                      type="tel"
                      placeholder="Enter phone number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full p-2 border rounded"
                    />
                    {!phoneVerified && (
                      <button
                        type="button"
                        onClick={sendPhoneOtp}
                        className="bg-blue-500 text-white px-3 rounded"
                      >
                        Send OTP
                      </button>
                    )}
                  </div>
                  {!phoneVerified && confirmationResult && (
                    <div className="flex mt-2 space-x-2">
                      <input
                        placeholder="Enter OTP"
                        value={phoneOtp}
                        onChange={(e) => setPhoneOtp(e.target.value)}
                        className="w-full p-2 border rounded"
                      />
                      <button
                        type="button"
                        onClick={verifyPhoneOtp}
                        className="bg-green-500 text-white px-3 rounded"
                      >
                        Verify
                      </button>
                    </div>
                  )}
                  {phoneVerified && (
                    <p className="text-green-600 text-sm mt-1 font-semibold">✅ Phone Verified</p>
                  )}
                </div>

                {/* Email OTP */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700">Email</label>
                  <div className="flex space-x-2">
                    <input
                      required
                      type="email"
                      placeholder="Enter email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full p-2 border rounded"
                    />
                    {!emailVerified && (
                      <button
                        type="button"
                        onClick={sendEmailOtpHandler}
                        className="bg-blue-500 text-white px-3 rounded"
                      >
                        Send OTP
                      </button>
                    )}
                  </div>
                  {!emailVerified && emailOtpGenerated && (
                    <div className="flex mt-2 space-x-2">
                      <input
                        placeholder="Enter Email OTP"
                        value={emailOtp}
                        onChange={(e) => setEmailOtp(e.target.value)}
                        className="w-full p-2 border rounded"
                      />
                      <button
                        type="button"
                        onClick={verifyEmailOtp}
                        className="bg-green-500 text-white px-3 rounded"
                      >
                        Verify
                      </button>
                    </div>
                  )}
                  {emailVerified && (
                    <p className="text-green-600 text-sm mt-1 font-semibold">✅ Email Verified</p>
                  )}
                </div>

                {/* Feedback */}
                <textarea
                  required
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Your feedback..."
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400"
                  rows={4}
                />

                <button
                  disabled={!phoneVerified || !emailVerified || loading}
                  type="submit"
                  className={`w-full py-3 rounded text-white font-semibold transition ${
                    phoneVerified && emailVerified
                      ? "bg-purple-600 hover:bg-purple-700"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  {loading ? "Submitting..." : "Submit Feedback"}
                </button>
              </form>

              {/* Firebase Recaptcha */}
              <div id="recaptcha-container"></div>
            </div>
          </DashboardViewport>
        </main>
        <AdminFooter />
      </div>
    </div>
  );
};

export default UserForm;
