import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosApi from "../../lib/axios";
import type { AxiosError } from "axios";

import { ResponseType } from "@/types/Shared/types";
import { toast } from "sonner";
import { UpdateMenuSchemaType } from "@/types/cook/types";

export type CookProfile = {
  _id: string;

  user: {
    _id: string;
    name: string;
    email: string;
    phone: string;
    city: string;
  };

  bio: string;
  kitchenName: string;
  payment: string[];
  category: {
    _id: string;
    name: string;
  };
  location: {
    type: "Point";
    coordinates: [number, number];
  };
  experienceYears: number;
  createdAt: string;
  mealType: "Veg" | "Non-Veg" | "Both";
  lunchDeliveryTime: {
    start?: number;
    end?: number;
    display?: string;
  };
  dinnerDeliveryTime: {
    start?: number;
    end?: number;
    display?: string;
  };
};

type ResponseTypeApi = ResponseType & {
  data: CookProfile;
};

export const useProfile = () => {
  return useQuery({
    queryKey: ["cook-profile"],
    queryFn: async () => {
      const res = await axiosApi.get<ResponseTypeApi>("/cooks/profile");
      return res.data?.data;
    },
    placeholderData: (prev) => prev,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, AxiosError<ResponseType>, Partial<UpdateMenuSchemaType>>({
    mutationFn: async (data) => {
      const res = await axiosApi.patch<ResponseType>("/cooks/profile", data);
      return res.data;
    },
    onSuccess: (data) => {
      if (!data.success) {
        toast.error(data?.message || "Profile updation failed.");
        return;
      }
      toast.success(data.message || "Profile updated.");
      queryClient.invalidateQueries({ queryKey: ["cook-profile"] });
    },
    onError: (err) => {
      if (!err.response) {
        toast.error("Network error, Please try again later.");
        return;
      }
      toast.error(err.response?.data?.message || "Profile updation failed.");
    },
  });
};
