import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";

export type Place = {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
};

export const useLocationSearch = (search: string) => {
  const [debouncedSearch] = useDebounce(search, 800);

  return useQuery<Place[]>({
    queryKey: ["location-search", debouncedSearch],

    queryFn: async () => {
      if (debouncedSearch.trim().length < 3) {
        return [];
      }

      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          debouncedSearch,
        )}&addressdetails=1&limit=5`,
      );

      if (!res.ok) {
        throw new Error("Failed to fetch locations");
      }

      return res.json();
    },

    enabled: debouncedSearch.trim().length >= 3,

    staleTime: 1000 * 60 * 5,
  });
};