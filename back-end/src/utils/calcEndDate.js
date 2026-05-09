export const calcEndDate = (startDate, planType) => {
  const end = new Date(startDate);

  switch (planType) {
    case "daily":
      end.setDate(end.getDate() + 1);
      break;

    case "weekly":
      end.setDate(end.getDate() + 7);
      break;

    case "monthly":
      // safer month handling
      const currentDate = end.getDate();
      end.setMonth(end.getMonth() + 1);

      // handle cases like Jan 31 → Feb
      if (end.getDate() < currentDate) {
        end.setDate(0); // last day of previous month
      }
      break;

    default:
      throw new Error("Invalid plan type");
  }

  return end;
};