"use client";

import { Label } from "@/components/ui/label";
import { Input } from "../ui/input";
import { Subscription } from "@/hooks/cook/useCookRequests";

type Props = {
  request: Subscription | undefined;
};

export default function DetailsForm({ request }: Props) {
  return (
    <form className="flex flex-col gap-5 justify-between">
      <div className="flex flex-col gap-5">
        <div>
          <Label>Name</Label>
          <Input
            type="text"
            readOnly
            className="mt-1"
            defaultValue={
              request?.user.name && (request?.user.name[0].toUpperCase() + request?.user.name.slice(1))
            }
          />
        </div>

        <div>
          <Label>Phone</Label>
          <Input
            type="number"
            readOnly
            className="mt-1"
            defaultValue={request?.user.phone}
          />
        </div>

        <div>
          <Label>Plan</Label>
          <Input
            type="text"
            readOnly
            className="mt-1"
            defaultValue={
              request?.planType &&
              request?.planType[0].toUpperCase() + request?.planType.slice(1)
            }
          />
        </div>

        <div>
          <Label>Meal Time</Label>
          <Input
            type="text"
            readOnly
            className="mt-1"
            defaultValue={
              request?.mealTime &&
              request?.mealTime[0].toUpperCase() + request?.mealTime.slice(1)
            }
          />
        </div>

        <div>
          <Label>Price</Label>
          <Input
            type="text"
            readOnly
            className="mt-1"
            defaultValue={request?.price}
          />
        </div>

        <div>
          <Label>Payment Status</Label>
          <Input
            type="text"
            readOnly
            className="mt-1"
            defaultValue={request?.paymentStatus && request?.paymentStatus[0].toUpperCase()+request?.paymentStatus.slice(1)}
          />
        </div>

        <div>
          <Label>Delivery Address</Label>
          <Input
            type="text"
            readOnly
            className="mt-1"
            defaultValue={request?.deliveryAddress}
          />
        </div>
      </div>
    </form>
  );
}
