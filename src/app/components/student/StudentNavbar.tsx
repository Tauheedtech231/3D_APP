"use client";

import React, { useState, useEffect } from "react";
import { Menu as MenuIcon, X, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useAppSelector, useAppDispatch } from "@/hooks/redux";
import { logout } from "@/features/auth/authSlice";
import Link from "next/link";

const StudentNavbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => setMounted(true), []);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    router.push("/");
  };

  const links = [
    { name: "Dashboard", href: "/student" },
    { name: "Modules", href: "/student/modules" },
    { name: "Quizzes", href: "/student/quizez" },
    { name: "Assignments", href: "/student/assignments" },
    { name: "Progress", href: "/student/progress" },
    { name: "Settings", href: "/student/settings" },
  ];

  if (!mounted) return null;

  return (
    <nav
      className={`fixed w-full z-50 transition-colors duration-300 ${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-700"} shadow-md`}
    >
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <div
          className={`flex items-center gap-2 p-2 rounded-full ${theme === "dark" ? "bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600" : "bg-white"}`}
        >
          <Image
            src="/main-logo.png"
            alt="Logo"
            width={100}
            height={100}
            className="object-contain"
          />
        </div>

        <ul className="hidden md:flex items-center gap-6 font-medium text-sm">
          {links.map((link) => (
            <li
              key={link.name}
              className="hover:text-blue-600 cursor-pointer transition-colors"
            >
              <Link href={link.href}>{link.name}</Link>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-full p-2"
          >
            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>

          {user && (
            <>
              <Button
                variant="outline"
                onClick={handleLogout}
                className={`rounded-full px-4 py-1 ${theme === "dark" ? "text-white border-gray-600" : "text-gray-700"}`}
              >
                Logout
              </Button>
              <span className="text-sm font-medium">{user.name}</span>
            </>
          )}
        </div>

        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 shadow-lg border-t border-gray-200 dark:border-gray-700 p-4">
          <ul className="space-y-4">
            {links.map((link) => (
              <li
                key={link.name}
                className="hover:text-blue-600 cursor-pointer transition-colors"
              >
                <Link href={link.href}>{link.name}</Link>
              </li>
            ))}
            <li className="pt-4 border-t border-gray-200 dark:border-gray-700">
              {user && (
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="w-full rounded-full px-4 py-1"
                >
                  Logout
                </Button>
              )}
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default StudentNavbar;