"use client"

import Sidebar from "@/app/components/Sidebar"
import Navbar from "@/app/components/navbar"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen flex flex-col">
      {/* Fixed Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </div>

      {/* Main Content with Sidebar */}
      <div className="flex flex-1 pt-16 mt-5"> {/* pt-16 => Navbar ki height jitna gap */}
        {/* Sidebar */}
        <aside className=" shadow-md hidden md:block">
          <Sidebar />
        </aside>

        {/* Page Content */}
        <main className="flex-1 p-4 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}
