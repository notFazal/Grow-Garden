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
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
 const navigate = useNavigate();
 const db = getFirestore();

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
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
    }
  };

// Helper function to get current week number (optional)
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
			{...register("name")}
			className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
		  />
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
			{...register("password", { required: true })}
			className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
		  />
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