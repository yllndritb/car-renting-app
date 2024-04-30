"use client";

import React from "react";
import { RentLocIcon, ReturnLocIcon } from "@/assets/svgs";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import RentForm from "../general/rentForm";

export default function BookingInfo({
  border,
  label = "diffLocation",
}: {
  border: boolean;
  label?: string;
}) {
  const t = useTranslations("ExploreVehicles");

  const searchParams = useSearchParams();

  return (
    <div
      className={`bg-white p-4 flex flex-col gap-4 
    ${border ? "border-borderBooking border-2" : ""}`}
    >
      <div className="flex justify-between text-lg text-grayFont font-bold">
        {t("bookingInformation")} <RentForm modal={true} id={label} />
      </div>
      {searchParams.get("rentLocation") &&
        searchParams.get("returnLocation") && 
        searchParams.get("pickupDate") &&
        searchParams.get("dropOffDate") && (
          <>
            <div className="flex gap-2 items-center">
              <RentLocIcon className="w-12" />
              <div className="text-grayFont">
                <p className="text-sm leading-none">
                  {searchParams.get("pickupDate")}
                </p>
                <p className="text-xs leading-none">
                  {searchParams.get("rentLocation")}
                </p>
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <ReturnLocIcon className="w-12" />
              <div className="text-grayFont">
                <p className="text-sm leading-none">
                  {searchParams.get("dropOffDate")}
                </p>
                <p className="text-xs leading-none">
                  {searchParams.get("returnLocation")}
                </p>
              </div>
            </div>
          </>
        )}
    </div>
  );
}
