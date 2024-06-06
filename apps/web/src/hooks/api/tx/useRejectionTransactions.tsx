"use client";

import { toast } from "@/components/ui/use-toast";
import { axiosInstance } from "@/lib/axios";
import { cn } from "@/lib/utils";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";

interface RejectTransactionArgs {
  id: number;
  status: string;
  eventId: number;
}

const useRejectTransaction = () => {
  const router = useRouter();

  const rejecting = async (payload: RejectTransactionArgs) => {
    try {
      const { id, status, eventId } = payload;
      await axiosInstance.patch(`/transactions/${id}/update`, { status, eventId });

      alert("Update Sucess");
    } catch (error) {
      if (error instanceof AxiosError) {
        toast({
          className: cn(
            "top-0 right-0 flex fixed md:max-w-[420px] md:top-16 md:right-4 border-mythemes-darkpink text-mythemes-darkpink",
          ),
          variant: "default",
          title: error?.response?.data,
        });
      }
    }
  };
  return { rejecting };
};

export default useRejectTransaction;
