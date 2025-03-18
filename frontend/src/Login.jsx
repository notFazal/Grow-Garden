import React from "react";
import { useForm } from "react-hook-form";
import "./Login.css";

function Login() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = (data) => {
        const userData = JSON.parse(localStorage.getItem(data.email));
        if (userData) { // getItem can return actual value or null
            if (userData.password === data.password) {
                console.log(userData.name + " You Are Successfully Logged In");
            } else {
                console.log("Email or Password is not matching with our record");
            }
        } else {
            console.log("Did not get data");
        }
    };
    return (
        <>
            <p className="title">Login</p>
            <form className="Login" onSubmit={handleSubmit(onSubmit)}>
				<h3>Email</h3>
                <input type="email" {...register("email", { required: true })} />
                {errors.email && <span style={{ color: "red" }}>
                    *Email* is mandatory </span>}
					<h3>Password</h3>
                <input type="password" {...register("password")} />
				<h3></h3>
                <input type={"submit"} style={{ backgroundColor: "#a1eafb" }} />
            </form>
        </>
    );
}
export default Login;