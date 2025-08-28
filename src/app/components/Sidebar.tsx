"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

import { 
  BookOpen, 
  FileText, 
  CheckSquare, 
  BarChart, 
  Home, 
  Users, 
  Settings, 
  MessageSquare,
  LogOut,
  UserCog,
  Receipt,
  
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  // Determine role based on URL
  const role = pathname.startsWith("/student")
    ? "student"
    : pathname.startsWith("/instructor")
    ? "instructor"
    : pathname.startsWith("/admin")
    ? "admin"
    : "student";

  // Role-based menu items
  const menuItems: { name: string; href: string; icon: React.JSX.Element }[] = 
    role === "student"
      ? [
          { name: "Dashboard", href: "/student", icon: <Home size={16} /> },
          { name: "Modules", href: "/student/modules", icon: <BookOpen size={16} /> },
          { name: "Quizzes", href: "/student/quizez", icon: <CheckSquare size={16} /> },
          { name: "Assignments", href: "/student/assignments", icon: <FileText size={16} /> },
          { name: "Progress", href: "/student/progress", icon: <BarChart size={16} /> },
          { name: "Settings", href: "/student/settings", icon: <Settings size={16} /> },
        ]
      : role === "instructor"
      ? [
          { name: "Dashboard", href: "/instructor", icon: <Home size={16} /> },
          { name: "Courses", href: "/instructor/courses", icon: <BookOpen size={16} /> },
          { name: "Assignments", href: "/instructor/assignments", icon: <FileText size={16} /> },
          { name: "Grades", href: "/instructor/grades", icon: <BarChart size={16} /> },
          { name: "Discussions", href: "/instructor/discussions", icon: <MessageSquare size={16} /> },
          { name: "Settings", href: "/instructor/settings", icon: <Settings size={16} /> },
        ]
      : [
  { name: "Dashboard", href: "/admin-portal", icon: <Home size={16} /> },
  { name: "Students", href: "/admin-portal/student", icon: <Users size={16} /> },
  { name: "Courses", href: "/admin-portal/courses", icon: <BookOpen size={16} /> },
  { name: "Instructors", href: "/admin-portal/instructor", icon: <UserCog size={16} /> },
  { name: "Fee Verification", href: "/admin-portal/fee-verification", icon: <Receipt size={16} /> },
  
];

  return (
    <aside className="w-60 bg-gradient-to-b from-blue-700 to-blue-900 dark:from-gray-950 dark:to-gray-900 h-full flex flex-col text-white">
      
      {/* User Profile */}
      <div className="p-4 flex items-center gap-3 border-b border-blue-600 dark:border-gray-700">
        <div className="relative">
          <div className="bg-blue-600 dark:bg-gray-800 border-2 border-dashed rounded-xl w-10 h-10" />
          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-blue-900 dark:border-gray-900"></div>
        </div>
        <div>
          <p className="font-semibold text-sm">{useSelector((state: RootState) => state.auth.user?.name ?? 'Guest')}</p>
          <p className="text-blue-200 dark:text-gray-400 text-xs capitalize">{role}</p>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3">
          {menuItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`w-full flex items-center gap-2 p-2 rounded-lg transition-all duration-200 ${
                  active
                    ? "bg-white/20 backdrop-blur-sm shadow-md"
                    : "hover:bg-white/10"
                }`}
              >
                <span className={`${active ? "text-white" : "text-blue-200 dark:text-gray-400"}`}>
                  {item.icon}
                </span>
                <span className={`font-medium text-sm ${active ? "text-white" : "text-blue-100 dark:text-gray-200"}`}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-blue-600 dark:border-gray-700">
        <button className="w-full flex items-center gap-2 p-2 rounded-lg text-blue-100 dark:text-gray-200 hover:bg-white/10 dark:hover:bg-gray-800 transition-colors text-sm">
          <LogOut size={16} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}
