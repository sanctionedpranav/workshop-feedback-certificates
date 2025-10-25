import React, { useState } from "react";
import AdminSidebar from "../../components/admin/Sidebar";
import AdminTopbar from "../../components/admin/Topbar";
import DashboardViewport from "../../components/admin";
import AdminFooter from "../../components/admin/Footer";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../api/firebase";
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
  const [name, setName] = useState("");
  const [course, setCourse] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [feedback, setFeedback] = useState("");

  const [phoneOtp, setPhoneOtp] = useState("");
  const [emailOtp, setEmailOtp] = useState("");
  const [generatedPhoneOtp, setGeneratedPhoneOtp] = useState("");
  const [generatedEmailOtp, setGeneratedEmailOtp] = useState("");
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  // --- Mock OTP send functions (to be replaced with Firebase Cloud Functions) ---
  const sendPhoneOtp = () => {
    if (!phone) return alert("Enter phone number first");
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedPhoneOtp(otp);
    alert(`OTP sent to phone (mock): ${otp}`);
  };

  const sendEmailOtp = () => {
    if (!email) return alert("Enter email first");
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedEmailOtp(otp);
    alert(`OTP sent to email (mock): ${otp}`);
  };

  const verifyPhoneOtp = () => {
    if (phoneOtp === generatedPhoneOtp) {
      setPhoneVerified(true);
      alert("Phone verified successfully!");
    } else {
      alert("Invalid phone OTP!");
    }
  };

  const verifyEmailOtp = () => {
    if (emailOtp === generatedEmailOtp) {
      setEmailVerified(true);
      alert("Email verified successfully!");
    } else {
      alert("Invalid email OTP!");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!phoneVerified || !emailVerified) {
      alert("Please verify both phone and email before submitting.");
      return;
    }

    setLoading(true);
    setMessage("");

    // Mock save to Firestore (to be implemented in Day 5)
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
      alert("Form submitted successfully ✅");
      navigate("/thank-you");
    } catch (err) {
      console.error(err);
      alert("Submission failed ❌");
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
                {/* Read-only Workshop Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700">Workshop Name</label>
                    <input
                      value={formData.workshopName}
                      readOnly
                      className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700">College Name</label>
                    <input
                      value={formData.collegeName}
                      readOnly
                      className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700">Date</label>
                    <input
                      value={formData.date}
                      readOnly
                      className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700">Instructions</label>
                    <input
                      value={formData.instructions}
                      readOnly
                      className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
                    />
                  </div>
                </div>

                <hr className="my-6" />

                {/* Student Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700">Full Name</label>
                    <input
                      required
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400"
                      placeholder="Enter your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700">Course</label>
                    <input
                      required
                      type="text"
                      value={course}
                      onChange={(e) => setCourse(e.target.value)}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400"
                      placeholder="Enter your course"
                    />
                  </div>
                </div>

                {/* Phone + OTP */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700">Phone Number</label>
                  <div className="flex  space-x-2">
                    <input
                      required
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400"
                      placeholder="Enter phone number"
                    />
                    {!phoneVerified && (
                      <button
                        type="button"
                        onClick={sendPhoneOtp}
                        className="bg-blue-500 text-white px-3 rounded hover:bg-blue-600"
                      >
                        Send OTP
                      </button>
                    )}
                  </div>

                  {!phoneVerified && generatedPhoneOtp && (
                    <div className="flex mt-2 space-x-2">
                      <input
                        type="text"
                        placeholder="Enter OTP"
                        value={phoneOtp}
                        onChange={(e) => setPhoneOtp(e.target.value)}
                        className="w-full p-2 border rounded"
                      />
                      <button
                        type="button"
                        onClick={verifyPhoneOtp}
                        className="bg-green-500 text-white px-3 rounded hover:bg-green-600"
                      >
                        Verify
                      </button>
                    </div>
                  )}

                  {phoneVerified && (
                    <p className="text-green-600 text-sm mt-1 font-semibold">
                      ✅ Phone Verified
                    </p>
                  )}
                </div>

                {/* Email + OTP */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700">Email Address</label>
                  <div className="flex space-x-2">
                    <input
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400"
                      placeholder="Enter email address"
                    />
                    {!emailVerified && (
                      <button
                        type="button"
                        onClick={sendEmailOtp}
                        className="bg-blue-500 text-white px-3 rounded hover:bg-blue-600"
                      >
                        Send OTP
                      </button>
                    )}
                  </div>

                  {!emailVerified && generatedEmailOtp && (
                    <div className="flex mt-2 space-x-2">
                      <input
                        type="text"
                        placeholder="Enter OTP"
                        value={emailOtp}
                        onChange={(e) => setEmailOtp(e.target.value)}
                        className="w-full p-2 border rounded"
                      />
                      <button
                        type="button"
                        onClick={verifyEmailOtp}
                        className="bg-green-500 text-white px-3 rounded hover:bg-green-600"
                      >
                        Verify
                      </button>
                    </div>
                  )}

                  {emailVerified && (
                    <p className="text-green-600 text-sm mt-1 font-semibold">
                      ✅ Email Verified
                    </p>
                  )}
                </div>

                {/* Feedback */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700">Feedback</label>
                  <textarea
                    required
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400"
                    rows={4}
                    placeholder="Your feedback..."
                  />
                </div>

                {/* Submit */}
                <button
                  disabled={!phoneVerified || !emailVerified || loading}
                  type="submit"
                  className={`w-full py-3 rounded text-white font-semibold transition ${phoneVerified && emailVerified
                    ? "bg-purple-600 hover:bg-purple-700"
                    : "bg-gray-400 cursor-not-allowed"
                    }`}
                >
                  {loading ? "Submitting..." : "Submit Feedback"}
                </button>

                {message && <p className="text-center text-green-600 mt-3">{message}</p>}
              </form>
            </div>
          </DashboardViewport>
        </main >
        <AdminFooter />
      </div >
    </div >
  );
};

export default UserForm;
