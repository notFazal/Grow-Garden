// SignUp.tsx
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "./firebase.ts";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "./SignUp.css";

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