"use client";

import { useToast } from "@/components/ui/use-toast";
import { axiosInstance } from "@/lib/axios";
import { IFormTransaction, Transaction } from "@/types/transaction.type";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FileWithPath } from "react-dropzone";

const useUpdatePaymentProof = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const updatePaymentProof = async (
    transactionId: number,
    payload: Partial<IFormTransaction>,
  ) => {
    setIsLoading(true);
    try {
      const { paymentProof } = payload;

      const updatePaymentProofForm = new FormData();

      if (transactionId) {
        updatePaymentProofForm.append("transactionId", String(transactionId));
      }

      if (paymentProof) {
        paymentProof.forEach((file: FileWithPath) => {
          updatePaymentProofForm.append("paymentProof", file);
        });
      }

      const response = await axiosInstance.patch<Transaction>(
        `/transactions/${transactionId}`,
        updatePaymentProofForm,
      );

      toast({
        title: "Payment Checking",
        description: "Please waiting for this moment.",
      });

      router.push(
        `/`,
      );
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(error.response?.data);
      }
    }
  };

  return { updatePaymentProof };
};

export default useUpdatePaymentProof;
