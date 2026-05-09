import { MenuItem } from "@/hooks/cook/useMenu";
import type { UseMutationResult } from "@tanstack/react-query";
import { ActionButton } from "../shared/ActionButton";
import { Switch } from "../ui/switch";

type Props = {
  item: MenuItem;
  disableMutation: UseMutationResult<any, Error, string>;
  enableMutation: UseMutationResult<any, Error, string>;
  toggleTodayMutation: UseMutationResult<any, Error, string>;
  onEdit: (menu: MenuItem) => void;
};

export default function MenuRow({
  item,
  disableMutation,
  enableMutation,
  toggleTodayMutation,
  onEdit,
}: Props) {
  const isDisabling =
    disableMutation.isPending && disableMutation.variables === item._id;

  const isEnabling =
    enableMutation.isPending && enableMutation.variables === item._id;

  return (
    <tr className="border-t">
      {/* NAME */}
      <td className="px-4 py-4">{item.name}</td>

      {/* PRICE */}
      <td className="px-4 py-4">₹{item.price}</td>

      {/* TYPE */}
      <td className="px-4 py-4">
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            item.type === "veg"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {item.type === "veg" ? "Veg" : "Non-Veg"}
        </span>
      </td>

      {/* STATUS */}
      <td className="px-4 py-4">
        <span
          className={`px-3 py-1 rounded-full text-xs whitespace-nowrap font-medium ${
            item.status === "Active"
              ? "bg-green-100 text-green-700"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          ● {item.status}
        </span>
      </td>

      {/* CREATED DATE */}
      <td className="px-4 py-4">
        {item.createdAt
          ? new Date(item.createdAt).toLocaleDateString("en-IN", {
              dateStyle: "medium",
            })
          : "-"}
      </td>

      <td className="px-4 py-4">
        <Switch
          checked={item.availableToday}
          disabled={item.status !== "Active"}
          onCheckedChange={() => toggleTodayMutation.mutate(item._id)}
        />
      </td>

      {/* ACTIONS */}
      <td className="px-4 py-4 space-x-2 whitespace-nowrap">
        <ActionButton variant="warning" onClick={() => onEdit(item)}>
          Edit
        </ActionButton>

        {item.status === "Active" ? (
          <ActionButton
            variant="danger"
            isLoading={isDisabling}
            onClick={() => disableMutation.mutate(item._id)}
          >
            Disable
          </ActionButton>
        ) : (
          <ActionButton
            variant="success"
            isLoading={isEnabling}
            onClick={() => enableMutation.mutate(item._id)}
          >
            Enable
          </ActionButton>
        )}
      </td>
    </tr>
  );
}
