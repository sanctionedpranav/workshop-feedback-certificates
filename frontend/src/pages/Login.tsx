import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../validation/authSchema";
import { z } from "zod";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../api/firebase";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const navigate = useNavigate();
  const [firebaseError, setFirebaseError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      navigate("/admin");
    } catch (err: any) {
      setFirebaseError(err.message);
    }
  };

  return (
    <div style={{ maxWidth: 350, margin: "10% auto" }}>
      <h2>Admin Login</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input placeholder="Email" {...register("email")} />
        {errors.email && <p style={{ color: "red" }}>{errors.email.message}</p>}

        <input type="password" placeholder="Password" {...register("password")} />
        {errors.password && <p style={{ color: "red" }}>{errors.password.message}</p>}

        <button type="submit">Login</button>
      </form>

      {firebaseError && <p style={{ color: "red" }}>{firebaseError}</p>}

      <p style={{ marginTop: 10 }}>
        Don’t have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}
