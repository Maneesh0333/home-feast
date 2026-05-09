import { timeToMinutes } from "./timeToMinutes.js";

export const convertTimeRange = (range) => {
  if (!range || (!range.start && !range.end)) return undefined;

  const startMin = timeToMinutes(range.start);
  const endMin = timeToMinutes(range.end);

  if (startMin === undefined || endMin === undefined) {
    throw new AppError("Invalid time format", 400);
  }

  if (endMin <= startMin) {
    throw new AppError("End time must be after start time", 400);
  }

  return {
    start: startMin,
    end: endMin,
    display: `${range.start} - ${range.end}`,
  };
};
