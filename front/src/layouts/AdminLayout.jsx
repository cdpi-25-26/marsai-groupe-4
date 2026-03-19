import { NavLink, Outlet } from "react-router";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import Navbar from "@/components/Navbar";
import AdminSidebar from "@/components/admin/AdminSideBar";

export default function AdminLayout({ children }) {
  return (
	<>
    <SidebarProvider>
      <AdminSidebar />
	  
      <SidebarInset>
        
        <main className="flex-1 p-4 md:p-6 " >{children}
			    <Outlet />
		    </main>
        
      </SidebarInset>

    </SidebarProvider>
	</>
  )
}
