"use client";

import { useEffect } from "react";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";

export default function RoleRedirect() {
  const user = useAuthStore((state) => state.user);
  const loading = useAuthStore((state) => state.loading);
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/home");
      return;
    }

    const routes = {
      Admin: "/admin/overview",
      Cook: "/overview",
      User: "/home",
    };

    router.replace(routes[user.role]);
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return null;
}