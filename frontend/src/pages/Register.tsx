import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../validation/authSchema";
import { z } from "zod";
import { auth, db } from "../api/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";

type RegisterFormData = z.infer<typeof registerSchema>;

export default function Register() {
  const navigate = useNavigate();
  const [firebaseError, setFirebaseError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        email: data.email,
        role: "admin",
      });

      navigate("/login");
    } catch (err: any) {
      setFirebaseError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900">
      <div className="w-full max-w-sm p-8 rounded-2xl shadow-lg bg-gray-800/70 backdrop-blur-md border border-gray-700">
        <h2 className="text-3xl font-semibold text-center text-white mb-6">
          Create Account
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email */}
          <div>
            <input
              type="email"
              placeholder="Email"
              {...register("email")}
              className="w-full px-4 py-2 text-white placeholder-gray-400 bg-gray-700/60 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            {errors.email && (
              <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <input
              type="password"
              placeholder="Password"
              {...register("password")}
              className="w-full px-4 py-2 text-white placeholder-gray-400 bg-gray-700/60 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            {errors.password && (
              <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <input
              type="password"
              placeholder="Confirm Password"
              {...register("confirmPassword")}
              className="w-full px-4 py-2 text-white placeholder-gray-400 bg-gray-700/60 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            {errors.confirmPassword && (
              <p className="text-red-400 text-sm mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Error Message */}
          {firebaseError && (
            <p className="text-red-500 text-sm text-center">{firebaseError}</p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 mt-2 text-lg font-semibold text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 transition-all duration-200 cursor-pointer"
          >
            Register
          </button>
        </form>

        <p className="text-gray-400 text-center mt-4 text-sm">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-indigo-400 hover:text-indigo-300 transition-colors "
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
