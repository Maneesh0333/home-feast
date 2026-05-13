import { Suspense } from "react";
import VerifyClient from "./VerifyClient";
import { Spinner } from "@/components/ui/spinner";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 flex items-center justify-center">
          <Spinner />
        </div>
      }
    >
      <VerifyClient />
    </Suspense>
  );
}
