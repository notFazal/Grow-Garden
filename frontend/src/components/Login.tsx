// Login.tsx

import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase.ts";

interface LoginFormInputs {
  email: string;
  password: string;
}

function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>();
  const navigate = useNavigate();
  
  const FocusGardenPath = () => {
    navigate('/FocusGarden'); 
  };

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    try {
      // Sign in the user with email and password
      const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;
      
      console.log(user.displayName + " you are successfully logged in");
      // After login, redirect the user or load their garden data
      FocusGardenPath();
    } catch (error: any) {
      console.error("Login failed:", error.message);
    }
  };

  return (
	<>
	  <form
		onSubmit={handleSubmit(onSubmit)}
		className="bg-white p-6 rounded-2xl shadow-xl space-y-4 w-full max-w-md mx-auto"
	  >
		<h2 className="text-2xl font-semibold text-emerald-800">Login</h2>
  
		{/* Email */}
		<div>
		  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
			Email
		  </label>
		  <input
			id="email"
			type="email"
			{...register("email", { required: true })}
			className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
		  />
		  {errors.email && (
			<span className="text-sm text-red-500 mt-1 block">*Email* is mandatory</span>
		  )}
		</div>
  
		{/* Password */}
		<div>
		  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
			Password
		  </label>
		  <input
			id="password"
			type="password"
			{...register("password", { required: true })}
			className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
		  />
		  {errors.password && (
			<span className="text-sm text-red-500 mt-1 block">*Password* is mandatory</span>
		  )}
		</div>
  
		{/* Submit */}
		<button
		  type="submit"
		  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
		>
		  Login
		</button>
	  </form>
	</>
  );
}

export default Login;