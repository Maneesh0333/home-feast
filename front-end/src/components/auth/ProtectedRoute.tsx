"use client";

import { useAuthStore } from "@/stores/authStore";
import { Spinner } from "../ui/spinner";
import { useRouter } from "next/navigation";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "Admin" | "Cook" | "User";
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
}) => {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const loading = useAuthStore((state) => state.loading);

  if (loading || user === undefined) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!user) {
    router.replace("/");
  }

  if (requiredRole && user?.role !== requiredRole) {
    router.replace("/");
  }

  return <>{children}</>;
};

export default ProtectedRoute;
