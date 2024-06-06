"use client";

import { useToast } from "@/components/ui/use-toast";
import { axiosInstance } from "@/lib/axios";
import { Event, IFormEvent } from "@/types/event.type";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { FileWithPath } from "react-dropzone";

const useCreateEvent = () => {
  const router = useRouter();
  const { toast } = useToast();
  const createEvent = async (payload: IFormEvent) => {
    try {
      const {
        title,
        category,
        price,
        stock,
        startEvent,
        endEvent,
        description,
        booked,
        thumbnail,
        location,
        userId,
        voucherCode,
        voucherLimit,
        voucherAmount,
        voucherExpDate,
      } = payload;

      const createEventForm = new FormData();

      createEventForm.append("title", title);
      createEventForm.append("category", category);
      createEventForm.append("price", String(price));
      createEventForm.append("stock", String(stock));
      createEventForm.append("booked", String(booked));
      createEventForm.append("startEvent", startEvent.toString());
      createEventForm.append("endEvent", endEvent.toString());
      createEventForm.append("location", location);
      createEventForm.append("description", description);
      createEventForm.append("userId", String(userId));

      thumbnail.forEach((file: FileWithPath) => {
        createEventForm.append("thumbnail", file);
      });

      if (voucherCode) {
        createEventForm.append("voucherCode", voucherCode);
      }

      if (voucherLimit) {
        createEventForm.append("voucherLimit", String(voucherLimit));
      }

      if (voucherAmount) {
        createEventForm.append("voucherAmount", String(voucherAmount));
      }

      if (voucherExpDate) {
        createEventForm.append("voucherExpDate", new Date(voucherExpDate).toISOString());
      }

      await axiosInstance.post<Event>("/events", createEventForm);

      toast({
        title: "Event Created",
        description: "Your event has been created successfully.",
      });

      router.push("/");
    } catch (error) {
      if (error instanceof AxiosError) {
        toast({
          title: "Error",
          description: error.response?.data,
          duration: 5000,
        });
      }
    }
  };

  return { createEvent };
};

export default useCreateEvent;
