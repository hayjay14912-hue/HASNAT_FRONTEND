import React from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
// internal
import ErrorMsg from "../common/error-msg";
import { useResetPasswordMutation } from "@/redux/features/auth/authApi";
import { notifyError, notifySuccess } from "@/utils/toast";

// schema
const schema = Yup.object().shape({
  email: Yup.string().required().email().label("Email"),
});

const ForgotForm = () => {
  const [resetPassword, {}] = useResetPasswordMutation();
    // react hook form
    const {register,handleSubmit,formState: { errors },reset} = useForm({
      resolver: yupResolver(schema), 
    });
    // onSubmit
    const onSubmit = (data) => {
      resetPassword({
        verifyEmail: data.email,
      }).then((result) => {
        if(result?.error){
          notifyError(result?.error?.data?.message)
        }
        else {
          notifySuccess(result.data?.message);
        }
      });
      reset();
    };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="tp-form-pro">
      <div className="tp-field">
        <label htmlFor="email">Your Email</label>
        <input
          {...register("email", { required: `Email is required!` })}
          name="email"
          id="email"
          type="email"
          placeholder="you@example.com"
        />
        <ErrorMsg msg={errors.email?.message} />
      </div>
      <div className="tp-actions" style={{marginTop:16}}>
        <button type="submit" className="tp-btn-primary w-100">
          Send Mail
        </button>
      </div>
    </form>
  );
};

export default ForgotForm;
