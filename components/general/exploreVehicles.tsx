"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import {
  CloseMenuIcon,
  FilterIcon,
  GridViewIcon,
  ListViewIcon,
} from "@/assets/svgs";
import { useEffect, useMemo, useState } from "react";
import { useBooking } from "../context/bookingContext";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Breadcrumbs } from "../common/headingParts";
import { VehicleData } from "@/lib/types";
import { VehiclePagination } from "../other/vehiclePagination";
import BookingInfo from "../common/bookingInfo";
import VehicleCard from "../common/vehicleCard";
import VehicleFilters from "../common/vehicleFilters";
import VehicleSort from "../common/vehicleSort";
import ExploreVehiclesSkeleton from "../loader/exploreVehiclesSkeleton";
import NoVehiclesFound from "../loader/noVehiclesFound";
import RentForm from "./rentForm";

export default function ExploreVehicles() {
  const t = useTranslations("ExploreVehicles");
  const locale = useTranslations()("Locale");

  const [loading, setLoading] = useState(true);

  const searchParams = useSearchParams();

  const { rentLocationId, returnLocationId } = useBooking();
  const pickupDate = searchParams.get("pickupDate") || "";
  const dropOffDate = searchParams.get("dropOffDate") || "";

  let bookDates = null;

  if (pickupDate || dropOffDate) {
    bookDates = `${pickupDate},${dropOffDate}`;
  }

  const params: { [key: string]: string } = useMemo(
    () => ({
      "filter[carType]": searchParams.get("filter[carType]") || "",
      "filter[carClass]": searchParams.get("filter[carClass]") || "",
      "filter[gearType]": searchParams.get("filter[gearType]") || "",
      "filter[fuelType]": searchParams.get("filter[fuelType]") || "",
      "filter[pickUpLocation]": rentLocationId || "",
      "filter[dropOffLocation]": returnLocationId || "",
      "filter[isAvailable]": bookDates || "",
    }),
    [searchParams, rentLocationId, returnLocationId, bookDates]
  );

  const [vehicles, setVehicles] = useState<VehicleData>({
    data: [],
    links: {},
    meta: { last_page: 1 },
  });
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const url = new URL(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/cars?page=${currentPage}`
        );

        Object.keys(params).forEach((key) =>
          url.searchParams.append(key, params[key])
        );

        const sortBy = searchParams.get("sort");
        if (sortBy) {
          switch (sortBy) {
            case "yearDesc":
              url.searchParams.append("sort", "-year");
              break;
            case "yearAsc":
              url.searchParams.append("sort", "year");
              break;
            case "priceDesc":
              url.searchParams.append("sort", "-base_price_in_cents");
              break;
            case "priceAsc":
              url.searchParams.append("sort", "base_price_in_cents");
              break;
            default:
              break;
          }
        }

        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Accept-Language": locale,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });
        const data = await response.json();

        setVehicles(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
        setLoading(false);
      }
    };

    fetchVehicles();
  }, [currentPage, params, searchParams]);

  const totalPages = vehicles.meta?.last_page || 1;

  const [showFilters, setShowFilters] = useState(false);
  const [showFiltersAnimation, setShowFiltersAnimation] = useState(false);
  const [viewMode, setViewMode] = useState("grid");

  const toggleViewMode = () => {
    setViewMode(viewMode === "list" ? "grid" : "list");
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
    setShowFiltersAnimation(true);
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    if (currentPage !== pageNumber) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevChange = (pageNumber: number) => {
    if (pageNumber === 1) return;
    else {
      setCurrentPage(pageNumber - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNextChange = (pageNumber: number) => {
    if (pageNumber === totalPages) return;
    else {
      setCurrentPage(pageNumber + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="bg-bgSecondary w-full pb-16">
      <div className="w-full bg-white ">
        <div className="max-w-[1440px] m-auto flex justify-between px-4 mobile:px-8 bigDesktop:px-0 py-8">
          <div className="text-primary font-bold text-4xl w-full items-center flex cursor-default">
            {t("heading")}
          </div>
          <div className="laptop:flex gap-6 hidden">
            <div className="flex gap-2 items-center text-sm">
              <VehicleSort />
            </div>
            <div className="flex gap-4 items-center text-sm">
              <p className="text-grayFont font-medium text-nowrap">
                {t("changeListView")}
              </p>
              <div className="flex gap-2">
                <div title={t("gridView")}>
                  <GridViewIcon
                    onClick={() => viewMode !== "grid" && toggleViewMode()}
                    className={`text-[#c2c2c2] hover:text-primary cursor-pointer ${
                      viewMode === "grid" && "text-primary"
                    }`}
                  />
                </div>
                <div title={t("listView")}>
                  <ListViewIcon
                    onClick={() => viewMode !== "list" && toggleViewMode()}
                    className={`text-[#c2c2c2] hover:text-primary cursor-pointer ${
                      viewMode === "list" && "text-primary"
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-[1440px] m-auto">
        <Breadcrumbs translations={t} />
        <div className="bg-white flex mb-4 mx-0 mobile:mx-8 p-3 laptop:hidden">
          <div className="flex gap-4 mobile:gap-6 overflow-auto p-1">
            <div className="flex gap-2 p-2 h-8 text-sm text-grayFont cursor-pointer items-center border-borderGray border-2 rounded-full">
              <RentForm isModal={true} id="vehicleDetailsBooking" />
            </div>
            <div
              className="border-borderGray h-8 border-2 cursor-pointer rounded-full px-2 text-grayFont font-medium text-xs flex gap-2 items-center"
              onClick={toggleFilters}
            >
              {t("filters")}
              <FilterIcon className="text-primary" />
            </div>
            <div
              className={`fixed top-0 right-0 left-0 bottom-0  z-10 w-full fill-mode-forwards	${
                showFilters ? "animate-show-overlay" : "hidden"
              }`}
              onClick={toggleFilters}
            ></div>
            <div
              className={`fill-mode-forwards bg-white fixed h-full overflow-y-scroll top-0 w-3/4 z-10 ${
                showFilters
                  ? "animate-show-filters"
                  : showFiltersAnimation
                  ? "animate-hide-filters"
                  : "hidden"
              }`}
            >
              <div className="bg-white p-4 h-screen">
                <div className="flex justify-between text-lg text-grayFont font-bold mb-4">
                  {t("filterVehicles")}
                  <CloseMenuIcon
                    className="text-primary cursor-pointer"
                    onClick={toggleFilters}
                  />
                </div>
                <VehicleFilters filtersId="1" />
              </div>
            </div>
            <VehicleSort />
          </div>
        </div>
        <div className="flex gap-4 mobile:mx-8 bigDesktop:mx-0">
          <div className="flex flex-col w-full laptop:w-3/4 desktop:w-4/5 gap-4">
            {!loading && vehicles.data.length === 0 && <NoVehiclesFound />}
            <div
              className={`w-full gap-4 ${
                viewMode === "list"
                  ? "flex flex-col"
                  : "grid grid-cols-1 tablet:grid-cols-2"
              }`}
            >
              {loading
                ? Array.from({ length: 12 }, (_, index) => (
                    <div
                      key={index}
                      className="flex flex-col bg-white p-4 gap-4"
                    >
                      <ExploreVehiclesSkeleton />
                    </div>
                  ))
                : vehicles.data.map((vehicle: any) => (
                    <VehicleCard
                      viewMode={viewMode}
                      vehicle={vehicle}
                      key={vehicle.id}
                    />
                  ))}
            </div>
            <VehiclePagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              onNextChange={handleNextChange}
              onPrevChange={handlePrevChange}
            />
          </div>
          <div className="w-1/4 desktop:w-1/5 flex-col h-full gap-4 hidden laptop:flex">
            <BookingInfo border={true} />
            <div className="bg-white p-4 flex flex-col gap-4 h-full">
              <Accordion
                defaultValue="filters"
                type="single"
                collapsible
                className="w-full py-0"
              >
                <AccordionItem value="filters" className="border-none">
                  <AccordionTrigger>
                    <div className="flex justify-between cursor-pointer text-lg text-grayFont font-bold">
                      {t("filterVehicles")}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <VehicleFilters filtersId="2" />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
