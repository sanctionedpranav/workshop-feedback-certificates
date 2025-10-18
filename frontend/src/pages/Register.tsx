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
        role: "admin", // default role
      });

      navigate("/login");
    } catch (err: any) {
      setFirebaseError(err.message);
    }
  };

  return (
    <div style={{ maxWidth: 350, margin: "10% auto" }}>
      <h2>Register</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input placeholder="Email" {...register("email")} />
        {errors.email && <p style={{ color: "red" }}>{errors.email.message}</p>}

        <input type="password" placeholder="Password" {...register("password")} />
        {errors.password && <p style={{ color: "red" }}>{errors.password.message}</p>}

        <input type="password" placeholder="Confirm Password" {...register("confirmPassword")} />
        {errors.confirmPassword && (
          <p style={{ color: "red" }}>{errors.confirmPassword.message}</p>
        )}

        <button type="submit">Register</button>
      </form>

      {firebaseError && <p style={{ color: "red" }}>{firebaseError}</p>}

      <p style={{ marginTop: 10 }}>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}
