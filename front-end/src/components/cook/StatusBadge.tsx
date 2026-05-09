export default function StatusBadge({
  status,
  small = false,
}: {
  status: "paid" | "pending";
  small?: boolean;
}) {
  return (
    <span
      className={`w-fit flex items-center justify-center rounded-full font-semibold capitalize
      ${small ? "text-[11px] px-2 py-0.5" : "text-xs px-3 py-1"}
      ${
        status === "paid"
          ? "bg-green-100 text-green-700"
          : "bg-yellow-100 text-yellow-700"
      }`}
    >
      {status === "paid" ? "Paid" : "Pending"}
    </span>
  );
}
