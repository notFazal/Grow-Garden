// SignUp.tsx
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "./firebase.ts";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

interface FormData {
  name: string;
  email: string;
  password: string;
}

function SignUp() {
  const { register, handleSubmit, setError, formState: { errors } } = useForm<FormData>();
  const navigate = useNavigate();
  const db = getFirestore();

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
		// if the name is chosen the user will be prompted to redo
		const isAvailable = await checkNameAvailable(data.name);
		if (!isAvailable) {
		  setError("name", {
			type: "manual",
			message: "That garden name is already taken. Please choose another.",
		  });
		  return;
		}
      // Create a new user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: data.name });
      
      console.log("User created successfully:", user);
      
      // Create a Firestore document with the user’s UID as the id.
      await setDoc(doc(db, "users", user.uid), {
        gardenName: data.name,
        dailyTime: 0,
        lifetimeTime: 0,
        weeklyTimes: [0, 0, 0, 0, 0, 0, 0],
        lastUpdated: new Date().toISOString(),
        // You can store the current week number if needed for resets:
        lastWeek: getWeekNumber(new Date())
      });
      
      // Navigate directly to the FocusGarden view.
      navigate("/FocusGarden");

    } catch (error: any) {
        console.error("Error signing up:", error.message);
		setError("password", {
			type: "manual",
			message: "Email must contain valid domain. Password must be a minimum of 6 characters",
		  });
    }
  };
  // checking if the name is available
  const checkNameAvailable = async (name: string): Promise<boolean> => {
	try {
	  const response = await fetch(`http://localhost:5000/check_garden_name?name=${name}`);
	  const data = await response.json();
	  return data.available;
	} catch (err) {
	  console.error("Error checking garden name availability:", err);
	  return false; // default to "taken" if error
	}
  };

// Helper function to get current week number 
function getWeekNumber(date: Date) {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

return (
	<>
	  <form
		className="bg-white p-6 rounded-2xl shadow-xl space-y-4 w-full max-w-md mx-auto"
		onSubmit={handleSubmit(onSubmit)}
	  >
		<h2 className="text-2xl font-semibold text-emerald-800">Create Garden</h2>
  
		{/* Garden Name */}
		<div>
		  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
			Garden Name
		  </label>
		  <input
			id="name"
			type="text"
			{...register("name", { required: "*Garden Name* is mandatory" })}
			className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
		  />
		  {errors.name && (
    	    <span className="text-sm text-red-500 mt-1 block">{errors.name.message}</span>
  		  )}
		</div>
  
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
			{...register("password", { required: "*Password* is mandatory" })}
			className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
		  />
		  {errors.password && ( <span className="text-sm text-red-500 mt-1 block">{errors.password.message}</span>)
		  }
		  
		  
		</div>
  
		{/* Submit */}
		<button
		  type="submit"
		  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
		>
		  Create Garden
		</button>
	  </form>
	</>
  );
  
}

export default SignUp;