"use client";
import React, { useState, useEffect } from "react";
import { Menu as MenuIcon, X, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useAppSelector, useAppDispatch } from "@/hooks/redux";
import { logout } from "@/features/auth/authSlice";
import Link from "next/link";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
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

  const handleAuthAction = (action: "login" | "register") => {
    if (action === "login") {
      router.push("/auth/sign-in");
    } else {
      router.push("/auth/sign-up");
    }
  };

  const links = [
    { name: "Home", href: "/" },
    {
      name: "Courses",
      subLinks: [
        { name: "Course Catalog", href: "/courses" },
        { name: "BOSH – Basic Occupational Safety & Health", href: "/courses/bosh" },
        { name: "IOSH – Institution of Occupational Safety & Health", href: "/courses/iosh" },
        { name: "OSHA – Occupational Safety & Health Administration", href: "/courses/osha" },
        { name: "PTW – Permit to Work", href: "/courses/ptw" },
        { name: "Fire Safety – FA Training", href: "/courses/fire-safety" },
        { name: "First Aid – FS Training", href: "/courses/first-aid" },
        { name: "Hole Watcher – HW Training", href: "/courses/hole-watcher" },
      ],
    },
    {
      name: "Instructors",
      subLinks: [
        { name: "All Instructors", href: "/instructors" },
        { name: "Instructor Profiles", href: "/instructors/profiles" },
        { name: "Become an Instructor", href: "/instructors/become" },
        { name: "Teaching Resources", href: "/instructors/resources" },
      ],
    },
  ];

  const linkFontClass = pathname === "/" ? "text-base" : "text-sm";

  if (!mounted) return null;

  return (
    <nav
      className={`fixed w-full z-50 transition-colors duration-300 ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-700"
      } shadow-md`}
    >
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <div
          className={`flex items-center gap-2 p-2 rounded-full ${
            theme === "dark"
              ? "bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600"
              : "bg-white"
          }`}
        >
          <Image
            src="/main-logo.png"
            alt="Logo"
            width={100}
            height={100}
            className="object-contain"
          />
        </div>

        <ul className={`hidden md:flex items-center gap-6 font-medium ${linkFontClass}`}>
          {links.map((link) =>
            link.subLinks ? (
              <li key={link.name} className="relative group">
                <button className="hover:text-blue-600 transition-colors flex items-center gap-1">
                  {link.name}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                <ul className="absolute left-0 mt-2 w-56 rounded-md shadow-lg opacity-0 group-hover:opacity-100 invisible group-hover:visible transform -translate-y-2 group-hover:translate-y-0 transition-all duration-200 z-50 border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
                  {link.subLinks.map((sub) => (
                    <li key={sub.name}>
                      <Link
                        href={sub.href}
                        className="block px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600 rounded text-sm flex items-center"
                      >
                        <span className="w-1.5 h-1.5 bg-blue-200 rounded-full mr-3"></span>
                        {sub.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            ) : (
              <li
                key={link.name}
                className="hover:text-blue-600 cursor-pointer transition-colors"
              >
                <Link href={link.href}>{link.name}</Link>
              </li>
            )
          )}
        </ul>

        <div className="hidden md:flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-full p-2"
          >
            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>

          {user ? (
            <>
              <Button
                variant="outline"
                onClick={handleLogout}
                className={`rounded-full px-4 py-1 ${
                  theme === "dark" ? "text-white border-gray-600" : "text-gray-700"
                }`}
              >
                Logout
              </Button>
              <span className="text-sm font-medium">{user.name}</span>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={() => handleAuthAction("login")}
                className={`rounded-full px-4 py-1 ${
                  theme === "dark" ? "text-white border-gray-600" : "text-gray-700"
                }`}
              >
                Login
              </Button>
              <Button
                onClick={() => handleAuthAction("register")}
                className={`rounded-full px-4 py-1 ${
                  theme === "dark"
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                Register
              </Button>
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
            {links.map((link) =>
              link.subLinks ? (
                <li key={link.name} className="space-y-2">
                  <span className="font-medium">{link.name}</span>
                  <ul className="pl-4 space-y-2">
                    {link.subLinks.map((sub) => (
                      <li key={sub.name}>
                        <Link
                          href={sub.href}
                          className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                        >
                          {sub.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              ) : (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    {link.name}
                  </Link>
                </li>
              )
            )}
          </ul>
          
          <div className="mt-4 space-y-2">
            {user ? (
              <>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="w-full rounded-full"
                >
                  Logout
                </Button>
                <span className="block text-sm font-medium text-center">{user.name}</span>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={() => handleAuthAction("login")}
                  className="w-full rounded-full"
                >
                  Login
                </Button>
                <Button
                  onClick={() => handleAuthAction("register")}
                  className="w-full rounded-full bg-blue-600 hover:bg-blue-700"
                >
                  Register
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
