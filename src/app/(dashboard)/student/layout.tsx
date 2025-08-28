"use client"

import Sidebar from "@/app/components/Sidebar"
import StudentNavbar from "@/app/components/student/StudentNavbar"
import AuthGuard from "@/components/auth/AuthGuard"

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="h-screen flex flex-col">
        {/* Fixed Navbar */}
        <div className="fixed top-0 left-0 right-0 z-50">
          <StudentNavbar />
        </div>

        {/* Main Content with Sidebar */}
        <div className="flex flex-1 pt-16"> {/* pt-16 => Navbar ki height jitna gap */}
          {/* Sidebar */}
          <aside className="shadow-md hidden md:block mt-3">
            <Sidebar />
          </aside>

          {/* Page Content */}
          <main className={`flex-1 p-4 overflow-y-auto text-content-medium`}>{children}</main>
        </div>
      </div>
    </AuthGuard>
  )
}
