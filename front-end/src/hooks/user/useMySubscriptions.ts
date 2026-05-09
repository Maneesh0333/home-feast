import axiosApi from "@/lib/axios";
import { ResponseType } from "@/types/Shared/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

export type MySubscription = {
  _id: string;
  planType: "daily" | "weekly" | "monthly";
  mealTime: "lunch" | "dinner" | "both";
  price: number;
  status: "pending" | "active" | "cancelled" | "expired" | "rejected";
  paymentStatus: "pending" | "paid";
  startDate: string;
  endDate: string;
  isReviewed: boolean;
  createdAt: string;
  deliveryAddress: string;

  cook: {
    _id: string;
  };

  cookUser: {
    name: string;
    phone: string;
    email: string;
  };
};

type MySubscriptionsResponse = ResponseType & {
  data: {
    subscriptions: MySubscription[];
    page: number;
    limit: number;
    total: number;
    totalSubscriptions: number;
    totalPages: number;
    results: number;
  };
};

export const useMySubscriptions = (search: string = "", limit: number = 5) => {
  return useInfiniteQuery<
    MySubscriptionsResponse["data"],
    AxiosError<ResponseType>
  >({
    queryKey: ["my-subscriptions", search],

    queryFn: async ({ pageParam = 1 }) => {
      const res = await axiosApi.get<MySubscriptionsResponse>(
        "/subscriptions/my",
        {
          params: { search, page: pageParam, limit },
        }
      );

      return res.data.data;
    },

    getNextPageParam: (lastPage) => {
      return lastPage.page < lastPage.totalPages
        ? lastPage.page + 1
        : undefined;
    },

    initialPageParam: 1,
  });
};