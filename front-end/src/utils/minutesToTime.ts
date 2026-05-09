export const minutesToTime = (minutes?: number) => {
  if (typeof minutes !== "number") return "";

  const h = Math.floor(minutes / 60);
  const m = minutes % 60;

  return `${h.toString().padStart(2, "0")}:${m
    .toString()
    .padStart(2, "0")}`;
};