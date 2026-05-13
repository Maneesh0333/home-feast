"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, useWatch } from "react-hook-form";
import { useState } from "react";

import { FormField } from "@/components/shared/FormField";
import { SharedButton } from "@/components/shared/SharedButton";

import { useCreateReview } from "@/hooks/user/useReviews";
import { ReviewFormType } from "@/types/user/types";
import { reviewSchema } from "@/schemas/user/review.schema";

type Props = {
  subscriptionId: string;
  closeSheet: () => void;
};

/* ---------------- COMPONENT ---------------- */
export default function ReviewForm({ subscriptionId, closeSheet }: Props) {
  const createReview = useCreateReview();
  const [hover, setHover] = useState(0);

  const {
    handleSubmit,
    setValue,
    control,
    register,
    reset,
    formState: { errors, isValid, isDirty },
  } = useForm<ReviewFormType>({
    resolver: yupResolver(reviewSchema),
    mode: "onChange",
    defaultValues: {
      rating: undefined,
      comment: "",
    },
  });

  const rating = useWatch({
    control: control,
    name: "rating"
  });


  /* ---------------- SUBMIT ---------------- */
  const onSubmit = (data: ReviewFormType) => {
    createReview.mutate(
      {
        subscriptionId,
        rating: data.rating,
        comment: data.comment,
      },
      {
        onSuccess: () => {
          reset();
          closeSheet();
        },
      },
    );
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-6 justify-between h-full"
    >
      <div className="flex flex-col gap-5">
        {/* ⭐ Rating */}
        <div>
          <label className="text-sm font-medium mb-1 block">
            Rate your experience
          </label>

          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                onClick={() =>
                  setValue("rating", star, {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
                className={`text-3xl transition ${
                  (hover || rating) >= star ? "text-amber-500" : "text-gray-300"
                }`}
              >
                ★
              </button>
            ))}
          </div>

          {rating && (
            <p className="text-xs text-gray-500 mt-1">
              You rated {rating} star{rating > 1 && "s"}
            </p>
          )}

          {errors.rating && (
            <p className="text-xs text-red-500 mt-1">{errors.rating.message}</p>
          )}
        </div>

        {/* COMMENT */}
        <FormField
          id="comment"
          label="Write a review (optional)"
          register={register("comment")}
          placeholder="Share your experience..."
          error={errors.comment?.message}
        />
      </div>

      {/* SUBMIT */}
      <SharedButton
        type="submit"
        disabled={!isValid || !isDirty || createReview.isPending}
        loading={createReview.isPending}
      >
        Submit Review
      </SharedButton>
    </form>
  );
}
