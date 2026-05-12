import { useQuery } from "@tanstack/react-query";
import axiosApi from "@/lib/axios";
import type { AxiosError } from "axios";
import { ResponseType } from "@/types/Shared/types";

/* ---------------- TYPES ---------------- */
export type Plan = {
  _id: string;
  type: "weekly" | "daily" | "monthly";
  price: number;
};

type DeliveryTime = {
  start: number;
  end: number;
  display: string;
};

export type MenuItem = {
  _id: string;
  name: string;
  description: string;
  time: string;
  calories: number;
  price: number;
  type: "veg" | "nonveg";
};

export type CookProfileDetail = {
  _id: string;
  kitchenName: string;
  bio: string;
  experienceYears: number;
  verificationStatus: "Approved" | "Pending" | "Rejected";
  dinnerDeliveryTime: DeliveryTime;
  lunchDeliveryTime: DeliveryTime;

  rating: {
    average: number;
    totalReviews: number;
  };

  user: {
    _id: string;
    name: string;
    phone: string;
    email: string;
    city: string;
  };
};

type ApiResponse = ResponseType & {
  data: {
    cook: CookProfileDetail;
    plan: Plan[];
    menu: MenuItem[];
    subscribers: number;
  };
};

/* ---------------- HOOK ---------------- */
export const useGetCookProfileById = (id: string) => {
  return useQuery<ApiResponse["data"], AxiosError<ResponseType>>({
    queryKey: ["cook", id],

    queryFn: async () => {
      const res = await axiosApi.get<ApiResponse>(
        `/cooks/public/profile/${id}`,
      );
      return res.data.data;
    },

    enabled: !!id,
    refetchOnWindowFocus: false,
    placeholderData: (prev) => prev,
  });
};
