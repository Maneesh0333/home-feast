export const timeToMinutes = (time) => {
  if (!time) return undefined;
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};