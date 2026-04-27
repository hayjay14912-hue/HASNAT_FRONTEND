import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import ErrorMsg from "@/components/common/error-msg";
import { notifyError, notifySuccess } from "@/utils/toast";

const schema = Yup.object().shape({
  device: Yup.string().required("Device selection is required"),
  role: Yup.string().required("Role is required"),
  clinicName: Yup.string().required("Clinic name is required"),
  clinicType: Yup.string().required("Clinic type is required"),
  city: Yup.string().required("City is required"),
  timeline: Yup.string().required("Purchase timeline is required"),
  budgetRange: Yup.string().required("Budget range is required"),
  message: Yup.string().max(1000, "Message is too long"),
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  email: Yup.string().email("Enter a valid email").required("Email is required"),
  phone: Yup.string().required("Phone number is required"),
  consent: Yup.bool().oneOf([true], "Please accept consent to continue")
});

const RequestQuoteForm = ({
  preselectedDevice = "",
  sourcePage = "",
  title = "Request a Quote",
  submitLabel = "Submit Quote Request",
  formType = "device_quote",
  interestLabel = "Device of Interest",
  interestPlaceholder = "e.g. Lutronic Clarity II",
  interestStepTitle = "Device Interest",
  rolePlaceholder = "Dermatologist, Clinic Owner, Procurement Manager"
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const defaultValues = useMemo(
    () => ({
      device: preselectedDevice,
      role: "",
      clinicName: "",
      clinicType: "",
      city: "",
      timeline: "",
      budgetRange: "",
      message: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      consent: false
    }),
    [preselectedDevice]
  );

  const {
    register,
    handleSubmit,
    trigger,
    reset,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues
  });

  useEffect(() => {
    setValue("device", preselectedDevice || "");
  }, [preselectedDevice, setValue]);

  const steps = [
    { id: 1, title: interestStepTitle, fields: ["device", "role"] },
    { id: 2, title: "Clinic Profile", fields: ["clinicName", "clinicType", "city"] },
    { id: 3, title: "Commercial Details", fields: ["timeline", "budgetRange", "message"] },
    { id: 4, title: "Contact Details", fields: ["firstName", "lastName", "email", "phone", "consent"] }
  ];

  const handleNext = async () => {
    const step = steps[currentStep - 1];
    const valid = await trigger(step.fields);
    if (valid) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const onSubmit = async (formData) => {
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/leads/request-quote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          sourcePage: sourcePage || "request-quote",
          formType,
          ...formData
        })
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.message || "Unable to submit quote request");
      }

      notifySuccess(`Request submitted successfully. Lead ID: ${payload.leadId}`);
      reset(defaultValues);
      setCurrentStep(1);
    } catch (error) {
      notifyError(error.message || "Something went wrong while submitting the form");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFinalStep = currentStep === steps.length;

  return (
    <div className="nees-quote-form-wrap">
      <div className="nees-quote-form-head">
        <h3>{title}</h3>
        <p>Share your clinic details and our specialist team will contact you with pricing and next steps.</p>
      </div>

      <div className="nees-stepper" aria-label="Quote request steps">
        {steps.map((step) => (
          <div
            key={step.id}
            className={`nees-step-item ${currentStep >= step.id ? "is-active" : ""}`}
          >
            <span>{step.id}</span>
            <p>{step.title}</p>
          </div>
        ))}
      </div>

      <form className="nees-quote-form" onSubmit={handleSubmit(onSubmit)}>
        {currentStep === 1 && (
          <div className="row g-3">
            <div className="col-12">
              <label htmlFor="device">{interestLabel}</label>
              <input id="device" type="text" placeholder={interestPlaceholder} {...register("device")} />
              <ErrorMsg msg={errors.device?.message} />
            </div>
            <div className="col-12">
              <label htmlFor="role">Your Role</label>
              <input id="role" type="text" placeholder={rolePlaceholder} {...register("role")} />
              <ErrorMsg msg={errors.role?.message} />
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="row g-3">
            <div className="col-md-6">
              <label htmlFor="clinicName">Clinic Name</label>
              <input id="clinicName" type="text" placeholder="Clinic name" {...register("clinicName")} />
              <ErrorMsg msg={errors.clinicName?.message} />
            </div>
            <div className="col-md-6">
              <label htmlFor="clinicType">Clinic Type</label>
              <input id="clinicType" type="text" placeholder="Dermatology, Aesthetic Center, Multi-specialty" {...register("clinicType")} />
              <ErrorMsg msg={errors.clinicType?.message} />
            </div>
            <div className="col-12">
              <label htmlFor="city">City</label>
              <input id="city" type="text" placeholder="City" {...register("city")} />
              <ErrorMsg msg={errors.city?.message} />
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="row g-3">
            <div className="col-md-6">
              <label htmlFor="timeline">Purchase Timeline</label>
              <select id="timeline" {...register("timeline")}>
                <option value="">Select timeline</option>
                <option value="0-1 month">0-1 month</option>
                <option value="1-3 months">1-3 months</option>
                <option value="3-6 months">3-6 months</option>
                <option value="6+ months">6+ months</option>
              </select>
              <ErrorMsg msg={errors.timeline?.message} />
            </div>
            <div className="col-md-6">
              <label htmlFor="budgetRange">Budget Range</label>
              <select id="budgetRange" {...register("budgetRange")}>
                <option value="">Select range</option>
                <option value="Below PKR 5M">Below PKR 5M</option>
                <option value="PKR 5M - PKR 10M">PKR 5M - PKR 10M</option>
                <option value="PKR 10M - PKR 20M">PKR 10M - PKR 20M</option>
                <option value="Above PKR 20M">Above PKR 20M</option>
              </select>
              <ErrorMsg msg={errors.budgetRange?.message} />
            </div>
            <div className="col-12">
              <label htmlFor="message">Additional Notes</label>
              <textarea id="message" placeholder="Tell us about your goals, procedure focus, or installation timeline" {...register("message")} />
              <ErrorMsg msg={errors.message?.message} />
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="row g-3">
            <div className="col-md-6">
              <label htmlFor="firstName">First Name</label>
              <input id="firstName" type="text" placeholder="First name" {...register("firstName")} />
              <ErrorMsg msg={errors.firstName?.message} />
            </div>
            <div className="col-md-6">
              <label htmlFor="lastName">Last Name</label>
              <input id="lastName" type="text" placeholder="Last name" {...register("lastName")} />
              <ErrorMsg msg={errors.lastName?.message} />
            </div>
            <div className="col-md-6">
              <label htmlFor="email">Work Email</label>
              <input id="email" type="email" placeholder="name@clinic.com" {...register("email")} />
              <ErrorMsg msg={errors.email?.message} />
            </div>
            <div className="col-md-6">
              <label htmlFor="phone">Phone</label>
              <input id="phone" type="text" placeholder="+92..." {...register("phone")} />
              <ErrorMsg msg={errors.phone?.message} />
            </div>
            <div className="col-12">
              <label className="nees-checkbox" htmlFor="consent">
                <input id="consent" type="checkbox" {...register("consent")} />
                I agree to be contacted by NEES Medical sales team regarding this inquiry.
              </label>
              <ErrorMsg msg={errors.consent?.message} />
            </div>
          </div>
        )}

        <div className="nees-quote-form-actions">
          <button type="button" className="nees-btn nees-btn-ghost" onClick={handleBack} disabled={currentStep === 1 || isSubmitting}>
            Back
          </button>

          {!isFinalStep && (
            <button type="button" className="nees-btn nees-btn-primary" onClick={handleNext}>
              Continue
            </button>
          )}

          {isFinalStep && (
            <button type="submit" className="nees-btn nees-btn-primary" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : submitLabel}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default RequestQuoteForm;
