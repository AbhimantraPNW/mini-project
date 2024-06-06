"use client";

import { Button } from "@/components/ui/button";
import useGetEvent from "@/hooks/api/admin/useGetEvent";
import { appConfig } from "@/utils/config";
import { format } from "date-fns";
import Image from "next/image";
import SkeletonEventDetail from "./components/SkeletonEventDetail";
import Markdown from "@/components/Markdown";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";

const EventDetail = ({ params }: { params: { id: string } }) => {
  const { event, isLoading } = useGetEvent(Number(params.id));
  const router = useRouter()

  if (isLoading) {
    return (
      <div className="padding-container max-container px-4 text-center">
        <SkeletonEventDetail />
      </div>
    );
  }

  if (!event) {
    return <div className="container mx-auto px-4">Event not found</div>;
  }

  return (
    <main className="mx-auto px-4 py-16" style={{ maxWidth: "800px" }}>
      <section>
        <div className="mb-4 space-y-1.5 max-container">
          <h1 className="mb-7 text-4xl font-bold">{event.title}</h1>

          <div className="relative h-[300px] w-full md:h-[500px] md:w-[800px]">
            <Image
              fill
              src={`${appConfig.baseUrl}/assets${event.thumbnail}`}
              alt="thumbnail image"
              className="bg-slate-200 object-cover"
            />
          </div>

          <h1 className="text-xl font-semibold py-7">Event Location</h1>

          <div className="flex justify-between">
            <div className="flex flex-row gap-14">
              <div className="flex flex-col">
                <p className="flex-col text-base font-bold">
                  {format(new Date(event.startEvent), "dd MMMM")}
                </p>
                <p className="text-base font-light">
                  {format(new Date(event.startEvent), "EEEE")}
                  <span className="font-bold"> • </span>
                  {format(new Date(event.startEvent), "HH:mm")}
                </p>
              </div>

              <p className="text-base font-bold">{event.location}</p>
            </div>

            <Button onClick={() => router.push(`/${params.id}/transaction`)}>Find Ticket</Button>
          </div>

          <div className="pt-10">

          <Separator />
          </div>

          <section className="pt-10">
            <Markdown description={event.description} />
          </section>
        </div>
      </section>
    </main>
  );
};

export default EventDetail;
