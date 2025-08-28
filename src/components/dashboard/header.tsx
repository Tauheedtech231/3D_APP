"use client";

import { useState, useEffect } from "react";
import { Bell, Sun, Moon, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

interface DashboardHeaderProps {
  role?: string;
}

export function DashboardHeader({ role = "User" }: DashboardHeaderProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // After mounting, we can safely show the UI that depends on the theme
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6 dark:border-gray-700 transition-colors">
      <div className="md:hidden">
        <Button variant="ghost" size="icon" className="mr-2">
          <Menu className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="flex-1 flex items-center">
        <h1 className="text-xl font-semibold text-blue-600 dark:text-blue-400 mr-4">{role} Dashboard</h1>
        
      </div>
      
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-blue-600 dark:bg-blue-400"></span>
        </Button>
        
        {mounted && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
        )}
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="h-8 w-8 rounded-full bg-blue-600 dark:bg-blue-800 flex items-center justify-center text-white font-medium">
              {role.charAt(0)}
            </div>
            <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-green-500 border-2 border-white dark:border-gray-800"></span>
          </div>
        </div>
      </div>
    </header>
  );
}