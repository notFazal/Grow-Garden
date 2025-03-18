import React from "react";
import { useForm } from "react-hook-form";
import "./SignUp.css";

function SignUp() {
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = (data) => {
		console.log(data);
		localStorage.setItem(data.email, JSON.stringify(data));
	}
    return (
        <>
            <p className="title">Create Garden</p>

            <form className="SignUp" onSubmit={handleSubmit(onSubmit)}>
				<h3>Garden Name</h3>
                <input type="text" {...register("name")} />
				<h3>Email</h3>
                <input type="email" {...register("email", { required: true })} />
                {errors.email && <span style={{ color: "red" }}>
                    *Email* is mandatory </span>}
					<h3>Password</h3>
                <input type="password" {...register("password")} />
				<h3>Password</h3>
                <input type={"submit"} style={{ backgroundColor: "#a1eafb" }} />
            </form>
        </>
    );
}
export default SignUp;