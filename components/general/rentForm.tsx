"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { clearAppliedFilters } from "@/lib/utils";
import { X } from "lucide-react";
import { EditBookingIcon, SearchIcon } from "@/assets/svgs";
import { usePathname, useRouter } from "next/navigation";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import LocationsSelect from "./locationsSelect";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/de";
import "dayjs/locale/en-gb";

interface IFormInputs {
  rentLocation: string;
  returnLocation: string;
  pickupDate: Dayjs | null;
  dropOffDate: Dayjs | null;
}

interface Location {
  attributes: {
    name: string;
  };
}

export default function RentForm({
  isModal,
  id,
}: {
  isModal: boolean;
  id?: string;
}) {
  const t = useTranslations("RentForm");
  const router = useRouter();

  const isHomePage = usePathname() === "/en" || usePathname() === "/de";

  const [showReturnLocation, setShowReturnLocation] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showRentSelect, setShowRentSelect] = useState(false);
  const [showReturnSelect, setShowReturnSelect] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [rentLocations, setRentLocations] = useState<Location[]>([]);
  const [returnLocations, setReturnLocations] = useState<Location[]>([]);

  const [formData, setFormData] = useState<IFormInputs>({
    rentLocation: "",
    returnLocation: "",
    pickupDate: dayjs().add(1, "day").set("hour", 10).set("minute", 0),
    dropOffDate: dayjs().add(2, "day").set("hour", 18).set("minute", 0),
  });

  const handleInputChange =
    (field: keyof IFormInputs) =>
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setFormData({ ...formData, [field]: value });

      if (value.length >= 3) {
        const type = field === "rentLocation" ? "rent" : "return";
        await fetchLocations(value, type);
        if (type === "rent") setShowRentSelect(true);
        else setShowReturnSelect(true);
      } else {
        if (field === "rentLocation") setShowRentSelect(false);
        else setShowReturnSelect(false);
      }
    };

  const handleDateChange =
    (field: keyof IFormInputs) => (date: Dayjs | null) => {
      setFormData({ ...formData, [field]: date });
    };

  const fetchLocations = async (query: string, type: "rent" | "return") => {
    const url = new URL("https://rent-api.rubik.dev/api/locations");
    url.searchParams.append("filter[search]", query);

    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    const response = await fetch(url, { method: "GET", headers });
    const data = await response.json();
    console.log(data);

    if (type === "rent") {
      setRentLocations(data.data);
    } else {
      setReturnLocations(data.data);
    }
  };

  const submitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { rentLocation, returnLocation, pickupDate, dropOffDate } = formData;

    const isValidRentLocation = rentLocations.some(
      (location) => location.attributes.name === rentLocation
    );
    const isValidReturnLocation = returnLocations.some(
      (location) => location.attributes.name === returnLocation
    );

    if (rentLocation.length < 3) {
      setErrorMessage(t("rentLocation.minLength"));
      return;
    } else if (showReturnLocation && returnLocation.length < 3) {
      setErrorMessage(t("returnLocation.minLength"));
      return;
    } else if (
      !isValidRentLocation ||
      (!isValidReturnLocation && showReturnLocation)
    ) {
      setErrorMessage(t("invalidLocationError"));
      return;
    }

    if (pickupDate && dropOffDate) {
      const timeDifferenceHours = dropOffDate.diff(pickupDate, "hours");

      if (timeDifferenceHours < 1) {
        setErrorMessage(t("invalidDateError"));
        return;
      }
    }

    if (!pickupDate || !dropOffDate) {
      setErrorMessage(t("noDateError"));
      return;
    }

    const queryParams = new URLSearchParams(window.location.search);

    queryParams.set("rentLocation", rentLocation);
    queryParams.set("pickupDate", pickupDate.format("DD/MM/YYYY HH:mm"));
    queryParams.set("dropOffDate", dropOffDate.format("DD/MM/YYYY HH:mm"));

    if (showReturnLocation) {
      queryParams.set("returnLocation", returnLocation);
    } else {
      queryParams.set("returnLocation", rentLocation);
    }

    const queryString = queryParams.toString();

    if (isHomePage) {
      router.push(`/explore?${queryString}`);
    } else {
      router.push(`?${queryString}`);
    }

    setShowModal(false);
    setShowRentSelect(false);
    setShowReturnSelect(false);
  };

  const toggleModal = () => setShowModal(!showModal);
  const toggleRentSelect = () => setShowRentSelect(!showRentSelect);
  const toggleReturnSelect = () => setShowReturnSelect(!showReturnSelect);
  const handleCheckboxClick = () => setShowReturnLocation(!showReturnLocation);
  const handleLocationSelect = (location: Location) => {
    const updatedField = showRentSelect ? "rentLocation" : "returnLocation";
    setFormData({ ...formData, [updatedField]: location.attributes.name });
    if (showRentSelect) setShowRentSelect(false);
    else setShowReturnSelect(false);
  };

  return isModal ? (
    <>
      <span title={t("editBooking")}>
        <EditBookingIcon
          className="w-6 h-6 cursor-pointer"
          onClick={toggleModal}
        />
      </span>
      <div
        className={`fixed top-0 right-0 left-0 bottom-0  z-10 w-full fill-mode-forwards rounded ${
          showModal ? "animate-show-overlay" : "hidden"
        }`}
        onClick={toggleModal}
      ></div>
      <div
        className={`fixed z-50 max-w-lg bg-white w-[90vw] top-1/2 right-1/2 p-8 translate-x-1/2 -translate-y-1/2 rounded-xl ${
          showModal ? "block" : "hidden"
        }`}
      >
        <div className="w-full text-xl text-center">{t("search")}</div>
        <div className="absolute top-4 right-4 rounded-full p-2 flex hover:bg-neutral-100 active:bg-neutral-200 cursor-pointer">
          <X onClick={toggleModal} />
        </div>
        <form onSubmit={submitForm}>
          <div className="w-full desktop:rounded-none">
            <div className="flex flex-col w-full gap-2">
              <div
                className={`flex flex-col ${
                  showReturnLocation ? "gap-2" : "gap-0"
                }`}
              >
                <div className="w-full relative border-b font-normal text-base">
                  <input
                    type="text"
                    autoComplete="off"
                    placeholder={t("rentLocation.placeholder")}
                    className="w-full p-2"
                    value={formData.rentLocation}
                    onChange={handleInputChange("rentLocation")}
                  />
                  <LocationsSelect
                    showSelect={showRentSelect}
                    toggleSelect={toggleRentSelect}
                    locations={rentLocations}
                    handleLocationSelect={handleLocationSelect}
                  />
                </div>
                <div
                  className={`w-full relative font-normal text-base ${
                    showReturnLocation
                      ? "h-full duration-300 w-full border-b "
                      : "w-0 h-0 duration-100"
                  } `}
                >
                  <input
                    type="text"
                    autoComplete="off"
                    placeholder={t("returnLocation.placeholder")}
                    className={` ${
                      showReturnLocation
                        ? "h-full duration-300 w-full p-2"
                        : "w-0 h-0 duration-100"
                    } `}
                    value={formData.returnLocation}
                    onChange={handleInputChange("returnLocation")}
                  />
                  <LocationsSelect
                    showSelect={showReturnSelect}
                    toggleSelect={toggleReturnSelect}
                    locations={returnLocations}
                    handleLocationSelect={handleLocationSelect}
                  />
                </div>
                <LocalizationProvider
                  dateAdapter={AdapterDayjs}
                  adapterLocale={t("locale")}
                >
                  <div className="w-full border-b">
                    <DateTimePicker
                      className="w-full"
                      disablePast
                      value={formData.pickupDate}
                      onChange={handleDateChange("pickupDate")}
                      slotProps={{
                        textField: { placeholder: t("pickupDate") },
                      }}
                      sx={{
                        ".MuiInputBase-root input": {
                          padding: "8px",
                          fontWeight: "300",
                          cursor: "pointer",
                        },
                        ".MuiInputBase-root fieldset": {
                          border: "none !important",
                        },
                      }}
                    />
                  </div>
                  <div className="w-full border-b">
                    <DateTimePicker
                      className="w-full"
                      value={formData.dropOffDate}
                      disablePast
                      onChange={handleDateChange("dropOffDate")}
                      slotProps={{
                        textField: { placeholder: t("dropOffDate") },
                      }}
                      sx={{
                        ".MuiInputBase-root input": {
                          padding: "8px",
                          fontWeight: "300",
                          cursor: "pointer",
                        },
                        ".MuiInputBase-root fieldset": {
                          border: "none !important",
                        },
                      }}
                    />
                  </div>
                </LocalizationProvider>
              </div>
              <p
                className={`mt-2 text-base font-medium transition-opacity text-primary ${
                  errorMessage ? "opacity-100" : "opacity-0"
                } `}
              >
                {errorMessage}
              </p>
              <button
                type="submit"
                className="w-24 flex items-center justify-center bg-primary hover:bg-secondary text-white px-4 py-2 transition"
              >
                <SearchIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="flex items-center space-x-2 pt-4">
            <input
              id={id}
              type="checkbox"
              className="w-4 h-4 cursor-pointer"
              onClick={handleCheckboxClick}
            />
            <label
              htmlFor={id}
              className="text-sm font-medium text-grayFont leading-none cursor-pointer"
            >
              {t("deliverAtDifferentPoint")}
            </label>
          </div>
        </form>
      </div>
    </>
  ) : (
    <div className="w-full tablet:w-1/2 h-screen relative p-4 mobile:p-8 bigDesktop:pr-0 flex flex-col justify-center">
      <p className="pb-4 font-bold leading-4 text-white tablet:text-grayFont text-lg">
        {t("findYourCar")}
      </p>
      <form className="w-full" onSubmit={submitForm}>
        <div className="shadow-grayPrimary w-full p-4 pt-2 rounded-md bg-white">
          <div className="flex flex-col relative w-full">
            <div className="w-full flex flex-col bg-white items-start">
              <div className="w-full relative border-b">
                <input
                  type="text"
                  autoComplete="off"
                  placeholder={t("rentLocation.placeholder")}
                  className="w-full p-2"
                  value={formData.rentLocation}
                  onChange={handleInputChange("rentLocation")}
                />
                <LocationsSelect
                  showSelect={showRentSelect}
                  toggleSelect={toggleRentSelect}
                  locations={rentLocations}
                  handleLocationSelect={handleLocationSelect}
                />
              </div>
              <div
                className={`w-full relative ${
                  showReturnLocation
                    ? "h-full transition-all duration-300 w-full border-b "
                    : "w-0 h-0 transition-all duration-100"
                } `}
              >
                <input
                  type="text"
                  autoComplete="off"
                  placeholder={t("returnLocation.placeholder")}
                  className={` ${
                    showReturnLocation
                      ? "h-full transition-all duration-300 w-full p-2"
                      : "w-0 h-0 transition-all duration-100"
                  } `}
                  value={formData.returnLocation}
                  onChange={handleInputChange("returnLocation")}
                />
                <LocationsSelect
                  showSelect={showReturnSelect}
                  toggleSelect={toggleReturnSelect}
                  locations={returnLocations}
                  handleLocationSelect={handleLocationSelect}
                />
              </div>
              <LocalizationProvider
                dateAdapter={AdapterDayjs}
                adapterLocale={t("locale")}
              >
                <div className="w-full border-b">
                  <DateTimePicker
                    className="w-full"
                    disablePast
                    value={formData.pickupDate}
                    onChange={handleDateChange("pickupDate")}
                    slotProps={{ textField: { placeholder: t("pickupDate") } }}
                    sx={{
                      ".MuiInputBase-root input": {
                        padding: "8px",
                        fontWeight: "300",
                        cursor: "pointer",
                      },
                      ".MuiInputBase-root fieldset": {
                        border: "none !important",
                      },
                    }}
                  />
                </div>
                <div className="w-full border-b">
                  <DateTimePicker
                    className="w-full"
                    value={formData.dropOffDate}
                    disablePast
                    onChange={handleDateChange("dropOffDate")}
                    slotProps={{ textField: { placeholder: t("dropOffDate") } }}
                    sx={{
                      ".MuiInputBase-root input": {
                        padding: "8px",
                        fontWeight: "300",
                        cursor: "pointer",
                      },
                      ".MuiInputBase-root fieldset": {
                        border: "none !important",
                      },
                    }}
                  />
                </div>
              </LocalizationProvider>
            </div>
            <p
              className={`pl-2 mt-2 transition-opacity text-primary ${
                errorMessage ? "opacity-100" : "opacity-0"
              } `}
            >
              {errorMessage}
            </p>
            <button
              type="submit"
              onClick={clearAppliedFilters}
              aria-label="Search"
              className="w-fit mt-4 flex items-center justify-center bg-primary hover:bg-secondary text-white px-10 py-2 transition"
            >
              <SearchIcon className="w-5 h-5" />
            </button>
            <h1 className="hidden tablet:block absolute -top-16 laptop:-top-24 -right-2 laptop:-right-9 font-bold text-[54px] laptop:text-[84px] text-gray-100 -z-10">
              {t("findNow")}
            </h1>
          </div>
        </div>
        <div className="flex items-center space-x-2 pt-4">
          <input
            id="diffLocation"
            type="checkbox"
            className="w-4 h-4 cursor-pointer"
            onClick={handleCheckboxClick}
          />
          <label
            htmlFor="diffLocation"
            className="text-sm font-medium text-white tablet:text-grayFont leading-none cursor-pointer"
          >
            {t("deliverAtDifferentPoint")}
          </label>
        </div>
      </form>
    </div>
  );
}
