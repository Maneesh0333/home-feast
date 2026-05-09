type Stats = Record<string, number>;

export const getChips = (stats: Stats = {}, total = 0) => {
  const chips = Object.entries(stats).map(([key, value]) => ({
    lable: `${key} (${value})`,
    value: key,
  }));

  return [
    ...chips,
    {
      lable: `All (${total})`,
      value: "All",
    },
  ];
};