"use client";

import FormTextArea from "@/components/FormTextArea";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { EmptyStar, FullStar } from "@/components/Star";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import useGetEvent from "@/hooks/api/admin/useGetEvent";
import useCreateReviews from "@/hooks/api/reviews/useCreateReviews";
import { useAppSelector } from "@/redux/hooks";
import { IFormReview } from "@/types/review.type";
import { appConfig } from "@/utils/config";
import { useFormik } from "formik";
import Image from "next/image";
import { useState } from "react";

const page = ({ params }: { params: { id: string } }) => {
  const { id } = useAppSelector((state) => state.user);
  const { createReview } = useCreateReviews();
  const { event, isLoading } = useGetEvent(Number(params.id));
  const [rating, setRating] = useState(0);

  const handleRating = (newRating: number) => {
    setRating(newRating);
    setFieldValue("rating", newRating);
  };

  const {
    values,
    touched,
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
  } = useFormik<IFormReview>({
    initialValues: {
      rating: "",
      comment: "",
    },
    onSubmit: (values) => {
      createReview({ ...values, userId: id, eventId: event?.id });
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center text-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!event || new Date(event.endEvent) > new Date()) {
    return (
      <div className="container mx-auto px-4">
        <p>Event not found or event has not finished yet</p>
      </div>
    );
  }

  return (
    <div className="mb-10 flex flex-col items-center justify-center">
      <div className="mt-10 flex justify-center">How's your experience?</div>

      <div className="flex items-center justify-center">
        <Card>
          <Image
            src={`${appConfig.baseUrl}/assets${event.thumbnail}`}
            alt="thumbnail image"
            width={250}
            height={250}
            className="bg-slate-200"
          />
          <h1 className="text-center">{event.title}</h1>
        </Card>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex w-full flex-col items-center justify-center"
        style={{ maxWidth: "400px" }}
      >
        <div className="mt-4 flex flex-row justify-center gap-1">
          {[...Array(5)].map((_, index) => {
            const starValue = index + 1;
            return (
              <div key={index} onClick={() => handleRating(starValue)}>
                {starValue <= rating ? (
                  <FullStar size={24} color="#FFD700" />
                ) : (
                  <EmptyStar size={24} color="#FFD700" />
                )}
              </div>
            );
          })}
        </div>

        <div className="w-full">
          <FormTextArea
            name="comment"
            label=""
            placeholder="Input your comment"
            value={values.comment}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.comment}
            isError={!!touched.comment && !!errors.comment}
          />
        </div>
        <Button type="submit" className="mt-6 w-full">
          Submit
        </Button>
      </form>
    </div>
  );
};

export default page;
