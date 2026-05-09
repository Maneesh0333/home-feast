import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import dayjs from "dayjs";
import StatusBadge from "./StatusBadge";

type HistoryItem = {
  _id: string;
  planType: string;
  paymentStatus: "paid" | "pending";
  date: string;
  customerName: string;
  amount: number;
};

type Props = {
  history: HistoryItem[] | undefined;
};

function EarningHistory({ history }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Earnings history
        </CardTitle>
      </CardHeader>

      <CardContent>
        {!history || history.length === 0 ? (
          <p className="text-center text-sm text-gray-500 py-10">
            No earnings yet
          </p>
        ) : (
          <div className="flex flex-col">
            <div className="grid grid-cols-5 gap-3 text-xs font-semibold text-gray-500 border-b pb-2">
              <span>Date</span>
              <span>Customer</span>
              <span>Plan</span>
              <span>Amount</span>
              <span>Status</span>
            </div>

            {history.map((item, index) => (
              <div
                key={item._id}
                className={`py-3 ${index !== 0 ? "border-t" : ""}`}
              >
                <div className="grid grid-cols-5 gap-3 items-center text-sm">
                  <span>{dayjs(item.date).format("DD MMM")}</span>
                  <span>{item.customerName}</span>
                  <span className="capitalize">{item.planType}</span>
                  <span className="font-medium">₹{item.amount}</span>

                  <StatusBadge status={item.paymentStatus} />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default EarningHistory;
