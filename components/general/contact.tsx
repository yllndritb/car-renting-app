"use client";

import { useTranslations } from "next-intl";
import { Breadcrumbs, HeadingTitle } from "../common/headingParts";
import {
  CallUsIcon,
  CheckIcon,
  LocationMapIcon,
  MailIcon,
  VisitUsIcon,
} from "@/assets/svgs";
import Image from "next/image";
import ScrollToTop from "../common/scrollToTop";
import SideMenu from "../common/sideMenu";
import { useState } from "react";

interface FormValues {
  fullName: string;
  email: string;
  phoneNumber: string;
  message: string;
}

export default function Contact() {
  const t = useTranslations("Contact");

  const [formData, setFormData] = useState<FormValues>({
    fullName: "",
    email: "",
    phoneNumber: "",
    message: "",
  });

  const handleInputChange = (fieldName: keyof FormValues, value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <>
      <HeadingTitle translations={t("heading")} />
      <div className="bg-bgSecondary w-full pb-16">
        <Breadcrumbs translations={t} />
        <div className=" max-w-[1440px] m-auto">
          <div className="relative bg-white mx-0 mobile:mx-8 bigDesktop:mx-0 px-4 desktop:px-8 pb-8 flex flex-col">
            <SideMenu />
            <div className="flex flex-col tablet:flex-row w-full laptop:w-3/4 gap-8 py-8">
              <div className="flex flex-col hover:justify-center flex-grow tablet:w-1/3 min-h-64 gap-6 justify-between items-center p-8 transition-all group hover:relative hover:border-none hover:shadow-grayPrimary border-primary border-b-[3px]">
                <VisitUsIcon className="text-primary group-hover:text-[#f3f3f3] group-hover:scale-[2.3] group-hover:absolute group-hover:top-12 group-hover:right-14 transition-all" />
                <h1 className="text-center text-grayFont font-bold text-2xl group-hover:hidden">
                  {t("visitUs")}
                </h1>
                <h1 className="text-center relative text-primary group-hover:flex hidden">
                  {t("visitUsLocation")}
                </h1>
                <p className="text-center text-grayFont text-sm group-hover:hidden">
                  {t("visitUsDescription")}
                </p>
              </div>
              <div className="flex flex-col hover:justify-center flex-grow tablet:w-1/3 min-h-64 gap-6 justify-between items-center py-8 px-12 transition-all group hover:relative hover:border-none hover:shadow-grayPrimary border-primary border-b-[3px]">
                <CallUsIcon className="text-primary group-hover:text-[#f3f3f3] group-hover:scale-[2.3] group-hover:absolute group-hover:top-12 group-hover:right-14 transition-all" />
                <h1 className="text-center text-grayFont font-bold text-2xl group-hover:hidden">
                  {t("callUs")}
                </h1>
                <h1 className="text-center relative text-primary group-hover:flex hidden">
                  +383123456789
                </h1>
                <p className="text-center text-grayFont text-sm group-hover:hidden">
                  {t("callUsDescription")}
                </p>
              </div>
              <div className="flex flex-col hover:justify-center flex-grow tablet:w-1/3 min-h-64 gap-6 justify-between items-center py-8 px-12 transition-all group hover:relative hover:border-none hover:shadow-grayPrimary border-primary border-b-[3px]">
                <MailIcon className="text-primary group-hover:text-[#f3f3f3] group-hover:scale-[2.3] group-hover:absolute group-hover:top-12 group-hover:right-14 transition-all" />
                <h1 className="text-center text-grayFont font-bold text-2xl group-hover:hidden">
                  {t("mailUs")}
                </h1>
                <div className="relative hidden flex-col gap-2 group-hover:flex">
                  <a
                    href="mailto:rentgo@rentgotheme.com"
                    className="text-primary"
                  >
                    rentgo@rentgotheme.com
                  </a>
                  <a
                    href="mailto:support@rentgotheme.com"
                    className="text-primary"
                  >
                    support@rentgotheme.com
                  </a>
                </div>
                <p className="text-center text-grayFont text-sm group-hover:hidden">
                  {t("mailUsDescription")}
                </p>
              </div>
            </div>
            <div className="py-8 w-full laptop:w-3/4">
              <div className="flex flex-col tablet:flex-row gap-8">
                <div className="relative flex-shrink-0 w-full tablet:w-1/2 h-80 tablet:h-auto">
                  <Image
                    src="/map.png"
                    alt="map"
                    priority
                    width={100}
                    height={100}
                    sizes="100%"
                    className="object-cover absolute w-full h-full left-0 top-0 "
                  />
                  <LocationMapIcon className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                </div>
                <div className="flex flex-col w-full tablet:w-1/2">
                  <h1 className="text-grayFont text-2xl font-bold">
                    {t("formHeading")}
                  </h1>
                  <p className="text-grayFontSecondary text-sm mt-2 mb-10">
                    {t("formDescription")}
                  </p>
                  <form
                    onSubmit={onSubmit}
                    className="flex flex-col gap-2 text-right"
                  >
                    <div className="relative">
                      <input
                        type="text"
                        placeholder={t("fullNamePlaceholder")}
                        className="w-full px-8 py-3 border border-borderGray rounded outline-primary"
                        value={formData.fullName}
                        onChange={(e) =>
                          handleInputChange("fullName", e.target.value)
                        }
                      />
                      <CheckIcon
                        className={`absolute transition-opacity right-5 top-5
                      ${
                        formData.fullName.trim() !== ""
                          ? "opacity-100"
                          : "opacity-0"
                      }`}
                      />
                    </div>
                    <div className="relative">
                      <input
                        type="email"
                        placeholder={t("emailPlaceholder")}
                        className="w-full px-8 py-3 border border-borderGray rounded outline-primary"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                      />
                      <CheckIcon
                        className={`absolute transition-opacity right-5 top-5
                      ${
                        formData.email.trim() !== ""
                          ? "opacity-100"
                          : "opacity-0"
                      }`}
                      />
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder={t("phoneNumberPlaceholder")}
                        className="w-full px-8 py-3 border border-borderGray rounded outline-primary"
                        value={formData.phoneNumber}
                        onChange={(e) =>
                          handleInputChange("phoneNumber", e.target.value)
                        }
                      />
                      <CheckIcon
                        className={`absolute transition-opacity right-5 top-5
                      ${
                        formData.phoneNumber.trim() !== ""
                          ? "opacity-100"
                          : "opacity-0"
                      }`}
                      />
                    </div>

                    <div className="relative">
                      <textarea
                        placeholder={t("messagePlaceholder")}
                        rows={4}
                        className="w-full px-8 py-3 border border-borderGray rounded outline-primary resize-none"
                        value={formData.message}
                        onChange={(e) =>
                          handleInputChange("message", e.target.value)
                        }
                      />
                      <CheckIcon
                        className={`absolute transition-opacity right-5 top-5
                      ${
                        formData.message.trim() !== ""
                          ? "opacity-100"
                          : "opacity-0"
                      }`}
                      />
                    </div>
                    <div className="w-full text-right">
                      <button
                        type="submit"
                        className="w-full mobile:w-fit transition text-white bg-primary hover:bg-secondary px-8 py-3"
                      >
                        {t("sendMessage")}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <ScrollToTop />
          </div>
        </div>
      </div>
    </>
  );
}
