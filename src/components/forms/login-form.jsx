import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useRouter } from 'next/router';
import Link from 'next/link';
// internal
import { CloseEye, OpenEye } from '@/svg';
import ErrorMsg from '../common/error-msg';
import { useLoginUserMutation } from '@/redux/features/auth/authApi';
import { notifyError, notifySuccess } from '@/utils/toast';


// schema
const schema = Yup.object().shape({
  email: Yup.string().required().email().label("Email"),
  password: Yup.string().required().min(6).label("Password"),
});
const LoginForm = () => {
  const [showPass, setShowPass] = useState(false);
  const [loginUser, { }] = useLoginUserMutation();
  const router = useRouter();
  const { redirect } = router.query;
  // react hook form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });
  // onSubmit
  const onSubmit = (data) => {
    loginUser({
      email: data.email,
      password: data.password,
    })
      .then((data) => {
        if (data?.data) {
          notifySuccess("Login successfully");
          router.push(redirect || "/");
        }
        else {
          notifyError(data?.error?.data?.error)
        }
      })
    reset();
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="tp-form-pro">
      <div className="tp-form-grid">
        <div className="tp-field">
          <label htmlFor="email">Your Email</label>
          <input {...register("email", { required: `Email is required!` })} name="email" id="email" type="email" placeholder="you@example.com" />
          <ErrorMsg msg={errors.email?.message} />
        </div>
        <div className="tp-field">
          <label htmlFor="password">Password</label>
          <div className="p-relative">
            <input
              {...register("password", { required: `Password is required!` })}
              id="password"
              type={showPass ? "text" : "password"}
              placeholder="Min. 6 character"
            />
            <div className="tp-login-input-eye" id="password-show-toggle">
              <span className="open-eye" onClick={() => setShowPass(!showPass)}>
                {showPass ? <CloseEye /> : <OpenEye />}
              </span>
            </div>
          </div>
          <ErrorMsg msg={errors.password?.message}/>
        </div>
      </div>
      <div className="tp-check" style={{justifyContent:'space-between',marginTop:12}}>
        <label className="tp-check"><input id="remeber" type="checkbox" /> Remember me</label>
        <div className="tp-login-forgot">
          <Link href="/forgot">Forgot Password?</Link>
        </div>
      </div>
      <div className="tp-actions" style={{marginTop:16}}>
        <button type='submit' className="tp-btn-primary w-100">Login</button>
      </div>
    </form>
  );
};

export default LoginForm;
