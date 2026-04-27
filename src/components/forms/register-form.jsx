import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useRouter } from "next/router";
// internal
import { CloseEye, OpenEye } from "@/svg";
import ErrorMsg from "../common/error-msg";
import { notifyError, notifySuccess } from "@/utils/toast";
import { useRegisterUserMutation } from "@/redux/features/auth/authApi";

// schema
const schema = Yup.object().shape({
  name: Yup.string().required().label("Name"),
  email: Yup.string().required().email().label("Email"),
  password: Yup.string().required().min(6).label("Password"),
  remember: Yup.bool()
    .oneOf([true], "You must agree to the terms and conditions to proceed.")
    .label("Terms and Conditions"),
});

const RegisterForm = () => {
  const [showPass, setShowPass] = useState(false);
  const [registerUser, {}] = useRegisterUserMutation();
  const router = useRouter();
  const { redirect } = router.query;
  // react hook form
  const {register,handleSubmit,formState: { errors },reset} = useForm({
    resolver: yupResolver(schema),
  });
  // on submit
  const onSubmit = (data) => {
    registerUser({
      name: data.name,
      email: data.email,
      password: data.password,
    }).then((result) => {
      if (result?.error) {
        notifyError("Register Failed");
      } else {
        notifySuccess(result?.data?.message);
        // router.push(redirect || "/");
      }
    });
    reset();
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="tp-form-pro">
      <div className="tp-form-grid">
        <div className="tp-field">
          <label htmlFor="name">Your Name</label>
          <input
            {...register("name", { required: `Name is required!` })}
            id="name"
            name="name"
            type="text"
            placeholder="John Doe"
          />
          <ErrorMsg msg={errors.name?.message} />
        </div>
        <div className="tp-field">
          <label htmlFor="email">Your Email</label>
          <input
            {...register("email", { required: `Email is required!` })}
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
          />
          <ErrorMsg msg={errors.email?.message} />
        </div>
        <div className="tp-field">
          <label htmlFor="password">Password</label>
          <div className="p-relative">
            <input
              {...register("password", { required: `Password is required!` })}
              id="password"
              name="password"
              type={showPass ? "text" : "password"}
              placeholder="Min. 6 character"
            />
            <div className="tp-login-input-eye" id="password-show-toggle">
              <span className="open-eye" onClick={() => setShowPass(!showPass)}>
                {showPass ? <CloseEye /> : <OpenEye />}
              </span>
            </div>
          </div>
          <ErrorMsg msg={errors.password?.message} />
        </div>
      </div>
      <div className="tp-check" style={{marginTop:12}}>
        <label className="tp-check">
          <input
            {...register("remember", {
              required: `Terms and Conditions is required!`,
            })}
            id="remember"
            name="remember"
            type="checkbox"
          />
          I accept the terms of the Service & Privacy Policy.
        </label>
        <ErrorMsg msg={errors.remember?.message} />
      </div>
      <div className="tp-actions" style={{marginTop:16}}>
        <button type="submit" className="tp-btn-primary w-100">
          Sign Up
        </button>
      </div>
    </form>
  );
};

export default RegisterForm;
