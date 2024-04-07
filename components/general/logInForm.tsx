"use client";

import { CheckIcon, FacebookIcon, GoogleIcon } from "@/assets/svgs";
import { useTranslations } from "next-intl";
import { useState } from "react";
import {
  LoginFormValidation,
  LoginFormValues,
  isEmailValid,
  isPasswordValid,
} from "../utils/formValidations";

interface FormValues {
  email: string;
  password: string;
}

export default function LoginForm() {
  const t = useTranslations("Account");
  const translations = {
    emailRequired: t("validation.emailRequired"),
    emailInvalid: t("validation.emailInvalid"),
    passwordRequired: t("validation.passwordRequired"),
    passwordInvalid: t("validation.passwordInvalid")
  };

  const [formData, setFormData] = useState<FormValues>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<Partial<LoginFormValues>>({});

  const handleInputChange = (fieldName: keyof FormValues, value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [fieldName]: "",
    }));
  };

  const submitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const errors = LoginFormValidation(formData,translations);
    setErrors(errors);

    if (Object.keys(errors).length === 0) {
      console.log("Form submitted:", formData);
    } else {
      console.log("Form not submitted due to errors:", errors);
    }
  };

  return (
    <div className="flex mobile:bg-white w-full">
      <div className="items-start flex flex-col flex-grow tablet:w-1/3 min-h-64 gap-6 justify-between mobile:p-16">
        <h1 className="text-grayFont font-bold text-4xl mb-2">
          {t("login.title")}
        </h1>
        <div className="w-20 h-0.5 bg-primary"></div>
        <p className="text-grayFont">{t("login.description")}</p>
        <div className="flex flex-col gap-4 w-full">
          <div className="flex flex-col tablet:flex-row gap-6 w-full px-8 tablet:px-0">
            <button className="flex gap-4 p-4 justify-center w-full bg-white shadow-btnShadow hover:bg-slate-50 active:bg-slate-100">
              <FacebookIcon />
              <p className="text-grayFont"> {t("login.facebookButton")}</p>
            </button>
            <button className="flex gap-4 p-4 justify-center w-full bg-white shadow-btnShadow hover:bg-slate-50 active:bg-slate-100">
              <GoogleIcon />
              <p className="text-grayFont">{t("login.googleButton")}</p>
            </button>
          </div>
          <div className="flex items-center w-full my-8">
            <div className=" border-b border-zinc-200 w-full"></div>
            <span className="px-4 text-slate-400 italic">{t("login.or")}</span>
            <div className=" border-b border-zinc-200 w-full"></div>
          </div>
          <div className="w-full">
            <form className="flex flex-col gap-4" onSubmit={submitForm}>
              <div>
                <div className="mt-2 relative">
                  <label className="block text-sm font-medium leading-6 text-grayFont">
                    {t("login.emailLabel")}
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={`block w-full rounded-sm border-zinc-300 border p-4 text-grayFont focus-visible:outline-primary pr-8 ${
                      errors.email && "outline outline-2 outline-red-500"
                    }`}
                  />
                  <CheckIcon
                    className={`absolute transition-opacity right-4 bottom-[22px] ${
                      isEmailValid(formData.email) ? "opacity-100" : "opacity-0"
                    }`}
                  />
                </div>
                <p
                  className={`text-xs p-2 opacity-0 text-red-500 w-full transition-opacity
                    ${errors.email && "opacity-100"}`}
                >
                  {errors.email}
                </p>
              </div>
              <div>
                <div>
                  <div className="mt-2 relative">
                    <label className="block text-sm font-medium leading-6 text-grayFont">
                      {t("login.passwordLabel")}
                    </label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) =>
                        handleInputChange("password", e.target.value)
                      }
                      className={`block w-full rounded-sm border-zinc-300 border p-4 text-grayFont focus-visible:outline-primary pr-8 ${
                        errors.password && "outline outline-2 outline-red-500"
                      }`}
                    />
                    <CheckIcon
                      className={`absolute transition-opacity right-4 bottom-[22px] ${
                        isPasswordValid(formData.password)
                          ? "opacity-100"
                          : "opacity-0"
                      }`}
                    />
                  </div>
                  <p
                    className={`text-xs p-2 opacity-0 text-red-500 w-full transition-opacity
                    ${errors.password && "opacity-100"}`}
                  >
                    {errors.password}
                  </p>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-sm">
                  <a
                    href="/account/password-reset"
                    className="font-bold text-grayFont hover:underline"
                  >
                    {t("login.forgotPassword")}
                  </a>
                </div>
                <button
                  type="submit"
                  className="flex justify-center bg-primary w-[150px] mobile:w-[200px] p-3 text-sm font-semibold leading-6 text-white hover:bg-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary"
                >
                  {t("login.loginButton")}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}