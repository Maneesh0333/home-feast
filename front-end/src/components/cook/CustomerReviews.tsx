import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StarRating } from "../shared/StarRating";
import { ReviewUI } from "@/app/(Cook)/reviews/page";

type ReviewsContainerProps = {
  reviews: ReviewUI[];
};

function CustomerReviews({ reviews }: ReviewsContainerProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Customer reviews
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {reviews.length > 0 ? (
          <>
            {reviews.map((review, i) => (
              <div key={i} className="flex flex-col gap-2  border-t py-3">
                <div className="flex items-center justify-between">
                  <div className="flex gap-3 items-center">
                    <span className="flex items-center justify-center shrink-0 h-10 w-10 rounded-lg bg-[#EBE3D5] font-bold text-[#4A3C2A]">
                      {review.name[0]}
                    </span>
                    <span className="font-bold">{review.name}</span>
                  </div>
                  <span className="text-xs">{review.date}</span>
                </div>

                <StarRating rating={review.rating} />
                <span>
                 {review.text}
                </span>
              </div>
            ))}
          </>
        ) : (
          <div className="flex h-50 text-sm items-center justify-center">
            No reviews yet
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default CustomerReviews;
