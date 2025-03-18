import React from "react";
import { useForm } from "react-hook-form";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";
import "./Login.css";

function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      // Sign in the user with email and password
      const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;
      
      console.log(user.displayName + " you are successfully logged in");
      // After login, redirect the user or load their garden data

    } catch (error) {
      console.error("Login failed:", error.message);
    }
  };

  return (
    <>
      <form className="Login" onSubmit={handleSubmit(onSubmit)}>
	  <p>Login</p>
        <h3>Email</h3>
        <input type="email" {...register("email", { required: true })} />
        {errors.email && <span style={{ color: "red" }}>*Email* is mandatory</span>}
        <h3>Password</h3>
        <input type="password" {...register("password", { required: true })} />
        <input type="submit" style={{ backgroundColor: "#a1eafb" }} />
      </form>
    </>
  );
}

export default Login;
