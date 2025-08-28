import { ThemeProvider } from "@/components/theme-provider";
import { Sidebar } from "@/components/dashboard/sidebar";
import { DashboardHeader } from "@/components/dashboard/header";
import AuthGuard from "@/components/auth/AuthGuard";

export default function InstructorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Sidebar navigation items
  const sidebarNavItems = [
    { title: "Dashboard", href: "/instructor", icon: "dashboard" },
    { title: "Courses", href: "/instructor/courses", icon: "book" },
    { title: "Students", href: "/instructor/students", icon: "users" },
    { title: "Assignments", href: "/instructor/assignments", icon: "file" },
    { title: "Quizzes", href: "/instructor/quizzes", icon: "check" },
  ];

  return (
    <AuthGuard>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
          {/* Fixed Header */}
          <DashboardHeader role="Instructor" />

          {/* Sidebar + Content */}
          <div className="flex flex-1">
            {/* Sidebar (below header) */}
            <Sidebar
              items={sidebarNavItems}
              className="hidden md:block w-64 border-r border-gray-200 dark:border-gray-700"
            />

            {/* Main Content */}
            <main className="flex-1 p-4">{children}</main>
          </div>
        </div>
      </ThemeProvider>
    </AuthGuard>
  );
}
