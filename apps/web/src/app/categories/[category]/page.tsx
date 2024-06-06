"use client";

import AutoComplete from "@/components/AutoComplete";
import EventList from "@/components/EventList";
import Pagination from "@/components/Pagination";
import useGetEvents from "@/hooks/api/admin/useGetEvents";
import { useState } from "react";
import SkeletonCategoryDetail from "../components/SkeletonCategoryDetail";
import { CATEGORY_BACKGROUND } from "../../../../constant";
import { Separator } from "@/components/ui/separator";
import { appConfig } from "@/utils/config";

const Page = ({ params }: { params: { category: string } }) => {
  const category = params.category;
  const [page, setPage] = useState<number>(1);

  const {
    data: events,
    meta,
    isLoading,
  } = useGetEvents({
    page,
    take: 9,
    category: category,
  });

  const handleChangePaginate = ({ selected }: { selected: number }) => {
    setPage(selected + 1);
  };

  if (isLoading)
    return (
      <div>
        <SkeletonCategoryDetail />
      </div>
    );

  const backgroundImage = CATEGORY_BACKGROUND.find(
    (bg) => bg.title.toLowerCase() === category.toLowerCase(),
  )?.url;

  return (
    <main>
      {/* Jumbotron */}
      <section
        className="relative py-40 md:py-72"
        style={{
          backgroundImage: `url('${backgroundImage}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 ml-5 flex flex-col justify-start text-base xl:max-w-[400px]">
          <h1 className="text-white">Find your favorite events here</h1>
          <p className="mt-4 font-sans text-2xl font-bold text-white">
            Alright, here we go! Click your favorite event.
          </p>
          <Separator className="mt-5" />
        </div>
      </section>

      <div className="padding-container max-container">
        <div className="mt-10">
          <AutoComplete />
        </div>

        <h1 className="mb-4 mt-12 text-2xl font-bold">Event List</h1>
        {/* Event List */}
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-3">
          {events.map((event, index) => (
            <div
              key={index}
              className="rounded-lg border border-gray-400 p-4 shadow-md hover:shadow-lg transition-shadow duration-300 transform hover:-translate-y-1"
              style={{ maxWidth: "400px" }}
            >
              <EventList
                imageUrl={appConfig.baseUrl + `/assets${event.thumbnail}`}
                title={event.title}
                location={event.location}
                startEvent={event.startEvent}
                endEvent={event.endEvent}
                eventId={event.id}
              />
            </div>
          ))}
        </div>

        <div className="my-8 flex justify-center">
          <Pagination
            total={meta?.total || 0}
            take={meta?.take || 0}
            onChangePage={handleChangePaginate}
          />
        </div>
      </div>
    </main>
  );
};

export default Page;
