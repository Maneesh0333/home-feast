"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { LoginModal } from "./modal/LoginModal";
import { SignupModal } from "./modal/SignupModal";
import { ModeToggle } from "./ModeToggle";
import { useAuthStore } from "@/stores/authStore";
import { useLogout } from "@/hooks/Auth/useLogout";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const user = useAuthStore((state) => state.user);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const router = useRouter();

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const logoutMutation = useLogout();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const handleNavItemClick = () => {
    setProfileOpen(false);
    router.push("/user-profile");
  };
  // 🔥 close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-3xl border-b bg-white/80">
      <div className="max-w-7xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-9 h-9 bg-orange-500 rounded-lg flex items-center justify-center text-lg">
            🍱
          </div>
          <div className="font-serif text-xl font-bold text-blue-900">
            Home<span className="text-orange-500">Feast</span>
          </div>
        </Link>

        {/* Desktop */}
        {user ? (
          <div className="hidden md:flex items-center gap-3">
            <ModeToggle />

            {/* Notification */}
            <button className="w-9 h-9 border rounded-lg flex items-center justify-center hover:bg-gray-100">
              🔔
            </button>

            {/* Profile */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="w-9 h-9 rounded-lg bg-orange-500 text-white uppercase font-bold cursor-pointer"
              >
                {user.name[0]}
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-11 w-48 bg-white border rounded-xl shadow-md p-2 flex flex-col gap-1">
                  <Link
                    href="/user-profile"
                    onClick={() => handleNavItemClick()}
                    className="px-3 py-2 rounded-lg hover:bg-gray-100"
                  >
                    👤 Profile
                  </Link>

                  <Link
                    href="/orders"
                    className="px-3 py-2 rounded-lg hover:bg-gray-100"
                  >
                    📦 Orders
                  </Link>

                  <Link
                    onClick={() => handleNavItemClick()}
                    href="/my-subscriptions"
                    className="px-3 py-2 rounded-lg hover:bg-gray-100"
                  >
                    🍽 Subscribers
                  </Link>

                  <button
                    onClick={handleLogout}
                    disabled={logoutMutation.isPending}
                    className="flex whitespace-nowrap hover:bg-gray-200 px-3 py-1 rounded-lg cursor-pointer text-left"
                  >
                    <span className="text-lg">🚪</span>
                    {logoutMutation.isPending ? (
                      <>
                        <span className="flex items-center justify-center w-10">
                          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                        </span>
                      </>
                    ) : (
                      "Logout"
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="hidden md:flex items-center gap-2">
            <ModeToggle />
            <LoginModal />
            <SignupModal role="User">
              <Button
                size="xllite"
                className={`px-5 font-semibold cursor-pointer rounded-lg text-white bg-orange-500 hover:bg-orange-600`}
              >
                Sign up free
              </Button>
            </SignupModal>
          </div>
        )}

        {/* Mobile Toggle */}
        <div className="flex gap-2 md:hidden">
          <ModeToggle />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="text-2xl cursor-pointer"
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t bg-white px-2 py-4 space-y-3">
          {user ? (
            <>
              <Link
                href="/user-profile"
                onClick={() => handleNavItemClick()}
                className="flex whitespace-nowrap w-full hover:bg-gray-200 px-3 py-1 rounded-lg cursor-pointer text-left"
              >
                👤 Profile
              </Link>
              <Link
                href="/orders"
                className="flex whitespace-nowrap w-full hover:bg-gray-200 px-3 py-1 rounded-lg cursor-pointer text-left"
              >
                📦 Orders
              </Link>
              <Link
                href="/my-subscriptions"
                onClick={() => handleNavItemClick()}
                className="flex whitespace-nowrap w-full hover:bg-gray-200 px-3 py-1 rounded-lg cursor-pointer text-left"
              >
                🍽 Subscribers
              </Link>

              <button
                onClick={handleLogout}
                disabled={logoutMutation.isPending}
                className="flex whitespace-nowrap w-full hover:bg-gray-200 px-3 py-1 rounded-lg cursor-pointer text-left"
              >
                <span className="text-lg">🚪</span>
                {logoutMutation.isPending ? (
                  <>
                    <span className="flex items-center justify-center w-10">
                      <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                    </span>
                  </>
                ) : (
                  "Logout"
                )}
              </button>
            </>
          ) : (
            <div className="space-y-2">
              <LoginModal className="w-full!" />
              <SignupModal role="User">
                <Button
                  size="xllite"
                  className={`px-5 font-semibold cursor-pointer rounded-lg text-white bg-orange-500 hover:bg-orange-600 w-full`}
                >
                  Sign up free
                </Button>
              </SignupModal>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
