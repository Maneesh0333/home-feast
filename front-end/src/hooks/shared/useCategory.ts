import axiosApi from "@/lib/axios";
import { ResponseType } from "@/types/Shared/types";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

type Category = {
  _id: string;
  name: string;
  description: string;
};

type Response = ResponseType & {
  data: Category[];
};

export const useCategories = () => {
  return useQuery<Category[], AxiosError<ResponseType>>({
    queryKey: ["category"],

    queryFn: async () => {
      const res = await axiosApi.get<Response>("/categories/all");
      return res.data.data;
    },
  });
};
