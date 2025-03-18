import React from "react";
import { useForm } from "react-hook-form";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "./firebase";
import "./SignUp.css";

function SignUp() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      // Create a new user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: data.name });
      
      console.log("User created successfully:", user);

    } catch (error) {
      console.error("Error signing up:", error.message);
    }
  };

  return (
    <>
      <form className="SignUp" onSubmit={handleSubmit(onSubmit)}>
	  <p>Create Garden</p>
        <h3>Garden Name</h3>
        <input type="text" {...register("name")} />
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

export default SignUp;
