import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router";
import {
  LayoutDashboard,
  Clapperboard,
  Users,
  Trophy,
  FileText,
  ArrowLeftFromLine,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const NAV_ITEMS = [
  { path: "/admin/films", label: "Films", icon: Clapperboard },
  { path: "/admin/jury", label: "Jury", icon: Users },
  { path: "/admin/awards", label: "Prix", icon: Trophy },
  { path: "/admin/content", label: "Contenu", icon: FileText },
];

export default function AdminLayout() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function handleLogout() {
    localStorage.removeItem("first_name");
    localStorage.removeItem("email");
    localStorage.removeItem("role");
    localStorage.removeItem("token");
    window.location.href = "/";
  }

  return (
    <div className="min-h-screen bg-gray-950 flex">
      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-gray-900 border-b border-white/10 flex items-center justify-between px-4 py-3">
        <Link to="/admin/films" className="flex items-center gap-2 text-white text-lg font-bold">
          <LayoutDashboard className="w-5 h-5 text-purple-400" />
          MARS<span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">AI</span>
        </Link>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-white/60 hover:text-white p-1">
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:static z-40 top-0 left-0 h-full w-56 bg-gray-900 border-r border-white/10 p-4 flex flex-col
        transition-transform duration-200
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
        pt-16 md:pt-4
      `}>
        <Link to="/admin/films" className="hidden md:flex items-center gap-2 text-white text-xl font-bold mb-8 px-3">
          <LayoutDashboard className="w-5 h-5 text-purple-400" />
          <div>
            MARS<span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">AI</span>
            <span className="text-white/40 text-xs block">Administration</span>
          </div>
        </Link>
        <nav className="space-y-1 flex-1">
          {NAV_ITEMS.map(({ path, label, icon: Icon }) => (
            <Link key={path} to={path} onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-2 px-3 py-2 rounded text-sm ${location.pathname === path ? "bg-purple-600/20 text-purple-400" : "text-white/60 hover:text-white hover:bg-white/5"}`}>
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="space-y-1 border-t border-white/10 pt-3">
          <Link to="/" className="flex items-center gap-2 text-white/40 hover:text-white text-sm px-3 py-2">
            <ArrowLeftFromLine className="w-4 h-4" />
            Retour au site
          </Link>
          <button onClick={handleLogout} className="flex items-center gap-2 text-white/40 hover:text-white text-sm text-left px-3 py-2 w-full">
            <LogOut className="w-4 h-4" />
            Déconnexion
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto pt-14 md:pt-0">
        <Outlet />
      </main>
    </div>
  );
}
