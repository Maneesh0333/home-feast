import { ActionButton } from "../shared/ActionButton";
import { Cook, useBlockCook, useUnblockCook } from "@/hooks/admin/useCook";

type Props = {
  item: Cook;
  blockMutation: ReturnType<typeof useBlockCook>;
  unblockMutation: ReturnType<typeof useUnblockCook>;
};

export default function CookRow({
  item,
  blockMutation,
  unblockMutation,
}: Props) {
  const isBlocking =
    blockMutation.isPending && blockMutation.variables === item.user._id;

  const isUnblocking =
    unblockMutation.isPending && unblockMutation.variables === item.user._id;

  return (
    <tr className="border-t">
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 font-semibold rounded-lg shrink-0 bg-orange-100 flex items-center justify-center text-lg">
            {item?.user?.name[0]?.toUpperCase()}
          </div>

          <div>
            <p className="font-medium">{item.user.name}</p>

            <p className="text-xs text-gray-500">
              {new Date(item.createdAt).toLocaleDateString("en-IN", {
                dateStyle: "medium",
              })}
            </p>
          </div>
        </div>
      </td>

      <td className="px-4 py-4">{item.user.email}</td>
      <td className="px-4 py-4">{item.user.phone}</td>

      <td className="px-4 py-4">
        <span
          className={`${item.verificationStatus === "Pending" ? "bg-yellow-100 text-yellow-700" : item.verificationStatus === "Approved" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"} px-3 py-1 rounded-full font-medium text-xs whitespace-nowrap`}
        >
          ● {item.verificationStatus}
        </span>
      </td>

      <td className="px-4 py-4 space-x-2 whitespace-nowrap">
        {item.user.status === "Active" ? (
          <ActionButton
            variant="danger"
            isLoading={isBlocking}
            onClick={() => blockMutation.mutate(item.user._id)}
          >
            Block
          </ActionButton>
        ) : (
          <ActionButton
            variant="success"
            isLoading={isUnblocking}
            onClick={() => unblockMutation.mutate(item.user._id)}
          >
            Unblock
          </ActionButton>
        )}
      </td>
    </tr>
  );
}
