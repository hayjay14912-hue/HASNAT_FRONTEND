import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import ErrorMsg from "../common/error-msg";
import { notifyError, notifySuccess } from "@/utils/toast";

const schema = Yup.object().shape({
  name: Yup.string().required("Name is required").max(120, "Name is too long"),
  email: Yup.string().required("Email is required").email("Enter a valid email"),
  subject: Yup.string().required("Subject is required").max(220, "Subject is too long"),
  message: Yup.string().required("Message is required").max(5000, "Message is too long"),
  remember: Yup.bool(),
});

const CONTACT_API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "";

const ContactForm = () => {
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    setSubmitting(true);
    setApiError("");

    if (!CONTACT_API_BASE) {
      const msg = "Contact API is not configured. Please set NEXT_PUBLIC_API_BASE_URL.";
      setApiError(msg);
      notifyError(msg);
      setSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`${CONTACT_API_BASE}/api/contact-us`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          subject: data.subject,
          message: data.message,
          sourcePage: "contact",
        }),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        const issue =
          Array.isArray(payload?.errorMessages) && payload.errorMessages.length
            ? payload.errorMessages.map((entry) => entry?.message).filter(Boolean).join(", ")
            : "Unable to send message right now. Please try again.";
        throw new Error(payload?.message || issue);
      }

      notifySuccess("Message sent successfully. Our team will contact you soon.");
      reset();
    } catch (error) {
      const msg = error?.message || "Unable to send message right now. Please try again.";
      setApiError(msg);
      notifyError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} id="contact-form" className="tp-form-pro">
      <div className="tp-form-grid">
        <div className="tp-field">
          <label htmlFor="name">Your Name</label>
          <input {...register("name")} id="name" type="text" placeholder="John Doe" />
          <ErrorMsg msg={errors.name?.message} />
        </div>

        <div className="tp-field">
          <label htmlFor="email">Your Email</label>
          <input {...register("email")} id="email" type="email" placeholder="you@example.com" />
          <ErrorMsg msg={errors.email?.message} />
        </div>

        <div className="tp-field">
          <label htmlFor="subject">Subject</label>
          <input {...register("subject")} id="subject" type="text" placeholder="Write your subject" />
          <ErrorMsg msg={errors.subject?.message} />
        </div>

        <div className="tp-field tp-field-full">
          <label htmlFor="message">Your Message</label>
          <textarea {...register("message")} id="message" placeholder="Write your message here..." />
          <ErrorMsg msg={errors.message?.message} />
        </div>
      </div>

      <div className="tp-contact-remember">
        <label className="tp-contact-remember-label" htmlFor="remember">
          <input {...register("remember")} id="remember" type="checkbox" />
          <span className="tp-contact-remember-text">
            Save my name, email, and website in this browser for the next time I comment.
          </span>
        </label>
        <ErrorMsg msg={errors.remember?.message} />
      </div>

      {apiError ? <p className="tp-form-inline-error">{apiError}</p> : null}

      <div className="tp-actions">
        <button type="submit" className="tp-btn-primary" disabled={submitting}>
          {submitting ? "Sending..." : "Send Message"}
        </button>
      </div>
    </form>
  );
};

export default ContactForm;
