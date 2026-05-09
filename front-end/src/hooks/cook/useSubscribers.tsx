import axiosApi from "@/lib/axios";
import { ResponseType } from "@/types/Shared/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

type Subscriber = {
  _id: string;
  planType: "daily" | "weekly" | "monthly";
  mealTime: "lunch" | "dinner" | "both";
  price: number;
  status: "active";
  paymentStatus: "pending" | "paid";
  createdAt: string;

  user: {
    _id: string;
    name: string;
    phone: string;
  };
};

type SubscribersPage = {
  subscribers: Subscriber[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

type SubscribersResponse = ResponseType & {
  data: SubscribersPage;
};

export const useCookSubscribersInfinite = (
  search: string = "",
  limit: number = 5
) => {
  return useInfiniteQuery<
    SubscribersPage,
    AxiosError<ResponseType>
  >({
    queryKey: ["cook-subscribers", search],

    queryFn: async ({ pageParam = 1 }) => {
      const res = await axiosApi.get<SubscribersResponse>(
        "/subscriptions/subscribers",
        {
          params: { search, page: pageParam, limit },
        }
      );

      return res.data.data;
    },

    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.totalPages) {
        return lastPage.page + 1;
      }
      return undefined;
    },

    initialPageParam: 1,

    refetchOnWindowFocus: false,
  });
};