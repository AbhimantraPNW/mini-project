"use client";

import Dropzone from "@/components/Dropzone";
import PreviewImages from "@/components/PreviewImages";
import { Card } from "@/components/ui/card";
import useGetEvent from "@/hooks/api/admin/useGetEvent";
import useGetTransaction from "@/hooks/api/transaction/useGetTransaction";
import useUpdatePaymentProof from "@/hooks/api/transaction/useUpdatePaymentProof";
import { IFormTransaction } from "@/types/transaction.type";
import { useFormik } from "formik";
import { useRouter, useSearchParams } from "next/navigation";
import { scheduleJob } from "node-schedule";
import { useEffect, useState } from "react";

const PaymentPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const { event, isLoading } = useGetEvent(Number(params.id));
  const searchParams = useSearchParams();
  const transactionId = searchParams.get("transactionId");
  const total = searchParams.get("total");

  const { data: transaction } = useGetTransaction(Number(transactionId));
  const { updatePaymentProof } = useUpdatePaymentProof();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formattedTotal = total ? formatCurrency(Number(total)) : "N/A";
  const [timeRemaining, setTimeRemaining] = useState(7200);
  const [timerStarted, setTimerStarted] = useState(false);

  const formik = useFormik<IFormTransaction>({
    initialValues: {
      total: transaction?.total || 0,
      amount: transaction?.amount || 0,
      status: transaction?.status || "",
      transactionId: transaction?.id || 0,
      paymentProof: [],
    },
    onSubmit: (values) => {
      if (values.transactionId && values.paymentProof.length > 0) {
        updatePaymentProof(values.transactionId, values);
      } else {
        if (!values.transactionId) {
          console.error("Transaction ID is missing");
        }
        if (values.paymentProof.length === 0) {
          console.error("Payment proof is missing");
        }
      }
    },
  });

  useEffect(() => {
    if (transaction?.id) {
      formik.setFieldValue("transactionId", transaction.id);
    }
  }, [transaction?.id]);

  useEffect(() => {
    const reminderJob = scheduleJob(
      new Date(Date.now() + 1 * 50 * 60 * 1000),
      () => {
        alert("Make your payment!");
      },
    );

    const declineJob = scheduleJob(
      new Date(Date.now() + 1 * 60 * 60 * 1000),
      () => {
        alert("Payment declined: Time limit exceeded");
        router.push("/");
      },
    );

    const interval = setInterval(() => {
      setTimeRemaining((prevTime) => Math.max(0, prevTime - 1));
    }, 1000);

    return () => {
      reminderJob.cancel();
      declineJob.cancel();
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (transaction?.createdAt) {
      const createdAtTime = new Date(transaction.createdAt).getTime();
      const currentTime = Date.now();
      const timeElapsed = (currentTime - createdAtTime) / 1000;
      const initialTimeRemaining = Math.max(7200 - timeElapsed, 0);

      setTimeRemaining(initialTimeRemaining);

      const interval = setInterval(() => {
        setTimeRemaining((prevTime) => Math.max(0, prevTime - 0));
      }, 1000);

      setTimerStarted(true);

      return () => {
        clearInterval(interval);
      };
    }
  }, [transaction?.createdAt]);

  const hours = Math.floor(timeRemaining / 3600);
  const minutes = Math.floor((timeRemaining % 3600) / 60);
  const seconds = Math.floor(timeRemaining % 60);

  return (
    <main
      className="padding-container max-container mb-6 mt-6"
      style={{ maxWidth: "600px" }}
    >
      <Card className="text-center">
        <form onSubmit={formik.handleSubmit}>
          <div className="mb-4">
            <p className="text-gray-600">Payment Time Remaining</p>
            <p>{`${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`}</p>
          </div>
          <div className="mb-4 mt-6">
            <p className="font-semibold text-gray-600">BCA Account Number</p>
            <p>072681910 PT.King Aldo Mencari Cinta</p>
          </div>
          <div className="mb-4">
            <p className="text-gray-600">Total Amount</p>
            <p>{formattedTotal}</p>
          </div>
          <PreviewImages
            fileImages={formik.values.paymentProof}
            onRemoveImage={(idx: number) => {
              const updatedImages = [...formik.values.paymentProof];
              updatedImages.splice(idx, 1);
              formik.setFieldValue("paymentProof", updatedImages);
            }}
          />
          <Dropzone
            isError={Boolean(formik.errors.paymentProof)}
            label=""
            onDrop={(files) =>
            formik.setFieldValue("paymentProof", [
                ...formik.values.paymentProof,
                ...files,
            ])
            }
          />
          <p>Upload your payment here</p>
          <button
            type="submit"
            className="mt-10 rounded bg-black px-4 py-2 text-white"
          >
            Submit Payment
          </button>
        </form>
      </Card>
    </main>
  );
};

export default PaymentPage;
