import axiosApi from "../../lib/axios";
import { useInfiniteQuery } from "@tanstack/react-query";



export type Review = {
  _id: string;
  rating: number;
  comment: string;
  createdAt: string;

  customer: {
    _id: string;
    name: string;
  };
};

export type ReviewsResponse = {
  reviews: Review[];
  total: number;
  page: number;
  totalPages: number;

  average: number;
  breakdown: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
};

type ApiResponse = {
  success: boolean;
  message: string;
  data: ReviewsResponse;
};


export const useInfiniteReviews = (
  cookId?: string,
  limit = 3
) => {
  return useInfiniteQuery<ReviewsResponse, Error>({
    queryKey: ["reviews", cookId],

    initialPageParam: 1,

    queryFn: async ({ pageParam }) => {
      const { data } = await axiosApi.get<ApiResponse>(
        `cooks/reviews/${cookId}`,
        {
          params: { page: pageParam, limit },
        }
      );

      return data.data;
    },
    placeholderData: (prev) => prev,
    getNextPageParam: (lastPage) => {
      return lastPage.page < lastPage.totalPages
        ? lastPage.page + 1
        : undefined;
    },

    enabled: !!cookId,
  });
};