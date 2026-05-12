"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useDebounce } from "use-debounce";
import SearchInput from "../shared/SearchInput";
import { Spinner } from "../ui/spinner";
import { SharedButton } from "../shared/SharedButton";

type Props = {
  setLocation: (v: [number, number]) => void;
  setOpen: (v: boolean) => void;
  locationsearch: string;
  setLocationsearch: (v: string) => void;
};
export default function LocationForm({
  setLocation,
  setOpen,
  locationsearch,
  setLocationsearch,
}: Props) {
  const [debouncedSearch] = useDebounce(locationsearch, 800);
  const [locationLatLng, setLocationLatLng] = useState<[number, number]>([
    0, 0,
  ]);

  const { data = [], isLoading } = useQuery({
    queryKey: ["location-search", debouncedSearch],

    queryFn: async () => {
      if (debouncedSearch.trim().length < 3) return [];

      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          debouncedSearch,
        )}&addressdetails=1&limit=5`,
      );

      return res.json();
    },
    enabled: debouncedSearch.trim().length >= 3,
    staleTime: 1000 * 60 * 5,
  });

  return (
    <div className="flex flex-col h-full justify-between">
      <div className="relative">
        <SearchInput
          value={locationsearch}
          onChange={(value) => {
            setLocationsearch(value);
            if (value.trim().length === 0) {
              setLocation([0, 0]);
            }
          }}
          placeholder="Search city"
          className="border p-2 w-full rounded-lg"
        />

        {isLoading ? (
          <div className="flex items-center justify-center border rounded-lg mt-1 min-h-20">
            <Spinner />
          </div>
        ) : (
          <>
            {data.length > 0 && (
              <>
                <div className="absolute w-full border rounded-lg mt-1 overflow-hidden">
                  {data.map((place: any) => (
                    <button
                      key={place.place_id}
                      onClick={() => {
                        setLocationLatLng([
                          Number(place.lon),
                          Number(place.lat),
                        ]);
                        setLocationsearch(place.display_name);
                      }}
                      className="block w-full text-left px-3 py-2 cursor-pointer hover:bg-foreground/10"
                    >
                      {place.display_name}
                    </button>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>

      <SharedButton
        onClick={() => {
          setLocation(locationLatLng);
          setOpen(false);
        }}
        disabled={locationLatLng[0] == 0 && locationLatLng[1] == 0}
      >
        Search Cooks
      </SharedButton>
    </div>
  );
}
