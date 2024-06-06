"use client";

import Dropzone from "@/components/Dropzone";
import FormInput from "@/components/FormInput";
import PreviewImages from "@/components/PreviewImages";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import useCreateEvent from "@/hooks/api/admin/useCreateEvent";
import { useAppSelector } from "@/redux/hooks";
import { IFormEvent } from "@/types/event.type";
import { useFormik } from "formik";
import { useState } from "react";
import { EVENT_CATEGORIES } from "../../../constant";
import { validationSchema } from "./validationSchema";
import dynamic from "next/dynamic";

const RichTextEditor = dynamic(() => import("@/components/RichTextEditor"), {
  ssr: false,
});

const CreateEvent = () => {
  const { createEvent } = useCreateEvent();
  const { id } = useAppSelector((state) => state.user);
  const [formattedPrice, setFormattedPrice] = useState("");

  const formatPrice = (value: any) => {
    if (!value) return "";
    return `${parseFloat(value).toLocaleString("id-ID")}`;
  };

  const handlePriceChange = (e: any) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setFieldValue("price", value);
    setFormattedPrice(formatPrice(value));
  };

  const {
    values,
    touched,
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
  } = useFormik<IFormEvent>({
    initialValues: {
      category: "",
      title: "",
      price: "",
      startEvent: "",
      endEvent: "",
      location: "",
      description: "",
      booked: 0,
      thumbnail: [],
      stock: "",
      voucherCode: "",
      voucherLimit: "",
      voucherAmount: "",
      voucherExpDate: "",
      isFree: false,
    },
    validationSchema,
    onSubmit: (values) => {
      createEvent({ ...values, userId: id });
    },
  });

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <Card className="shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-primary text-3xl font-semibold">
            Create Your Event
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700"
                >
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={values.category}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:outline-none sm:text-sm"
                >
                  <option value="">Select a category</option>
                  {EVENT_CATEGORIES.map((event, index) => (
                    <option key={index} value={event.title}>
                      {event.title}
                    </option>
                  ))}
                </select>
                {touched.category && errors.category && (
                  <p className="mt-2 text-sm text-red-500">{errors.category}</p>
                )}
              </div>
              <FormInput
                name="title"
                type="text"
                label="Event Name"
                placeholder="Event Name"
                value={values.title}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.title}
                isError={!!touched.title && !!errors.title}
              />
              <div>
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-700"
                >
                  Price (IDR)
                </label>
                <input
                  id="price"
                  name="price"
                  type="text"
                  placeholder="Price (IDR)"
                  value={formattedPrice}
                  onChange={handlePriceChange}
                  onBlur={handleBlur}
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:outline-none sm:text-sm"
                />
                {touched.price && errors.price && (
                  <p className="mt-2 text-sm text-red-500">{errors.price}</p>
                )}
              </div>
              <FormInput
                name="location"
                type="text"
                label="Location"
                placeholder="Location"
                value={values.location}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.location}
                isError={!!touched.location && !!errors.location}
              />
              <FormInput
                name="startEvent"
                type="datetime-local"
                label="Start Date"
                placeholder="YYYY-MM-DD"
                value={values.startEvent}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.startEvent as string}
                isError={!!touched.startEvent && !!errors.startEvent}
              />
              <FormInput
                name="endEvent"
                type="datetime-local"
                label="End Date"
                placeholder="YYYY-MM-DD"
                value={values.endEvent}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.endEvent as string}
                isError={!!touched.endEvent && !!errors.endEvent}
              />
              <FormInput
                name="stock"
                type="number"
                label="Available Seats"
                placeholder="Available Seats"
                value={values.stock}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.stock}
                isError={!!touched.stock && !!errors.stock}
              />
              <FormInput
                name="voucherCode"
                type="text"
                label="Voucher Code"
                placeholder="Voucher Code"
                value={values.voucherCode || ""}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.voucherCode}
                isError={!!touched.voucherCode && !!errors.voucherCode}
              />{" "}
              <FormInput
                name="voucherLimit"
                type="number"
                label="Voucher Limit"
                placeholder="Voucher Limit"
                value={values.voucherLimit || ""}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.voucherLimit}
                isError={!!touched.voucherLimit && !!errors.voucherLimit}
              />
              <FormInput
                name="voucherAmount"
                type="number"
                label="Voucher Amount"
                placeholder="Voucher Amount"
                value={values.voucherAmount || ""}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.voucherAmount}
                isError={!!touched.voucherAmount && !!errors.voucherAmount}
              />{" "}
              <FormInput
                name="voucherExpDate"
                type="date"
                label="Voucher Expiry Date"
                placeholder="Voucher Expiry Date"
                value={values.voucherExpDate || ""}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.voucherExpDate}
                isError={!!touched.voucherExpDate && !!errors.voucherExpDate}
              />
            </div>
            <div className="mt-6 grid grid-cols-1 gap-6">
              <PreviewImages
                fileImages={values.thumbnail}
                onRemoveImage={(idx: number) =>
                  setFieldValue("thumbnail", values.thumbnail.toSpliced(idx, 1))
                }
              />
              <Dropzone
                isError={Boolean(errors.thumbnail)}
                label="Thumbnail"
                onDrop={(files) =>
                  setFieldValue("thumbnail", [
                    ...values.thumbnail,
                    ...files.map((file) => file),
                  ])
                }
              />
              <RichTextEditor
                onChange={(html: string) => setFieldValue("description", html)}
                label="Description"
                value={values.description}
                isError={Boolean(errors.description)}
              />
            </div>
            <Button type="submit" className="mt-6 w-full">
              Create Event
            </Button>
          </form>
        </CardContent>
      </Card>
      <Separator className="my-12" />
    </main>
  );
};

export default CreateEvent;
