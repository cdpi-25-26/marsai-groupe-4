import { NavLink } from "react-router";
import { ThemeToggle } from "./ThemeToggle";
import { useState, useEffect } from "react";
import { Trophy, House, Search, Calendar, User, Gavel } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isLoggedIn = !!localStorage.getItem("token");
  const userRole = localStorage.getItem("role");
  const userPath = isLoggedIn ? "/admin" : "/auth/login";
  const isJury = userRole === "JURY" || userRole === "ADMIN";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
  }, [open]);

  const iconLinkClass = ({ isActive }) =>
    `flex items-center justify-center transition-all duration-300
     ${
       isActive
         ? "opacity-100 drop-shadow-[0_0_8px_rgba(123,44,255,0.9)] scale-110"
         : "opacity-60 hover:opacity-100"
     }`;

  return (
    <section className="fixed top-0 left-0 w-full z-30 p-4 sm:p-6">
      {/* MAIN NAVBAR */}
      <div
        className={`flex items-center justify-between w-full rounded-full px-6 sm:px-6 h-16 transition-all duration-500 border
        ${
          scrolled
            ? "bg-black/30 text-white border-white/5 backdrop-blur-[13px] shadow-2xl"
            : "bg-white/1 text-white border-white/5 backdrop-blur-[5px]"
        }`}
      >
        {/* LOGO */}
        <NavLink to="/" className="flex items-center gap-1 font-bold text-xl min-w-0">
          <span className="truncate text-white">MARS</span>
          <span className="bg-[linear-gradient(180deg,rgba(81,162,255,1)_0%,rgba(173,70,255,1)_50%,rgba(255,43,127,1)_100%)] bg-clip-text text-transparent truncate">
            AI
          </span>
        </NavLink>

        {/* ICONS — desktop only */}
        <div className="hidden sm:flex gap-6">
          <NavLink to="/gallerie" className={iconLinkClass}>
            <Search size={20} />
          </NavLink>
          <NavLink to="/" end className={iconLinkClass}>
            <House size={20} />
          </NavLink>
          <NavLink to="/palmares" className={iconLinkClass}>
            <Trophy size={20} />
          </NavLink>
          <NavLink to="/agenda" className={iconLinkClass}>
            <Calendar size={20} />
          </NavLink>
          {isJury && (
            <NavLink to="/jury" className={iconLinkClass}>
              <Gavel size={20} />
            </NavLink>
          )}
          <NavLink to={userPath} end className={iconLinkClass}>
            <User size={20} />
          </NavLink>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-4">
          <ThemeToggle />

          {/* BURGER — mobile only */}
          <button
            onClick={() => setOpen(true)}
            className="sm:hidden text-white opacity-70 hover:opacity-100 transition"
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      {/* OVERLAY */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 sm:hidden z-40 ${
          open ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      />

      {/* SIDEBAR */}
      <div
        className={`fixed top-0 left-0 h-full w-[260px] bg-black border-r border-white/10 p-7 flex flex-col gap-7 transform transition-transform duration-300 ease-in-out sm:hidden z-50 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="text-white font-bold text-xl">MARS AI</div>
          <button
            onClick={() => setOpen(false)}
            className="text-white/70 hover:text-white transition"
          >
            ✕
          </button>
        </div>

        {/* Links */}
        <NavLink to="/gallerie" onClick={() => setOpen(false)} className="text-white/70 hover:text-white transition">
          Galerie
        </NavLink>
        <NavLink to="/" onClick={() => setOpen(false)} className="text-white/70 hover:text-white transition">
          Home
        </NavLink>
        <NavLink to="/palmares" onClick={() => setOpen(false)} className="text-white/70 hover:text-white transition">
          Palmarès
        </NavLink>
        <NavLink to="/agenda" onClick={() => setOpen(false)} className="text-white/70 hover:text-white transition">
          Agenda
        </NavLink>
        {isJury && (
          <NavLink to="/jury" onClick={() => setOpen(false)} className="text-white/70 hover:text-white transition">
            Espace Jury
          </NavLink>
        )}
        <NavLink to={userPath} onClick={() => setOpen(false)} className="text-white/70 hover:text-white transition">
          Profile
        </NavLink>
      </div>
    </section>
  );
}
