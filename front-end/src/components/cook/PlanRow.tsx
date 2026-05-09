import { Plan } from "@/hooks/cook/usePlan";
import type { UseMutationResult } from "@tanstack/react-query";
import { ActionButton } from "../shared/ActionButton";

type Props = {
  plan: Plan;
  enableMutation: UseMutationResult<any, Error, string>;
  disableMutation: UseMutationResult<any, Error, string>;
  onEdit: (plan: Plan) => void;
};

export default function PlanRow({
  plan,
  onEdit,
  enableMutation,
  disableMutation,
}: Props) {
  const isDisabling =
    disableMutation.isPending && disableMutation.variables === plan._id;

  const isEnabling =
    enableMutation.isPending && enableMutation.variables === plan._id;

  return (
    <tr className="border-t">
      {/* TYPE */}
      <td className="px-4 py-4 capitalize">{plan.type}</td>

      {/* PRICE */}
      <td className="px-4 py-4">₹{plan.price}</td>

      {/* STATUS */}
      <td className="px-4 py-4">
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            plan.isActive
              ? "bg-green-100 text-green-700"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          ● {plan.isActive ? "Active" : "Inactive"}
        </span>
      </td>

      {/* CREATED */}
      <td className="px-4 py-4">
        {plan.createdAt
          ? new Date(plan.createdAt).toLocaleDateString("en-IN", {
              dateStyle: "medium",
            })
          : "-"}
      </td>

      {/* ACTIONS */}
      <td className="px-4 py-4 space-x-2 whitespace-nowrap">
        <ActionButton variant="warning" onClick={() => onEdit(plan)}>
          Edit
        </ActionButton>

        {plan.isActive ? (
          <ActionButton
            variant="danger"
            isLoading={isDisabling}
            onClick={() => disableMutation.mutate(plan._id)}
          >
            Disable
          </ActionButton>
        ) : (
          <ActionButton
            variant="success"
            isLoading={isEnabling}
            onClick={() => enableMutation.mutate(plan._id)}
          >
            Enable
          </ActionButton>
        )}
      </td>
    </tr>
  );
}