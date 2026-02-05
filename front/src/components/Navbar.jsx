import { NavLink, useNavigate } from "react-router";

export default function Navbar() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  const calendarPath = isLoggedIn ? "/admin/events" : "/auth/login";
  const userPath = isLoggedIn ? "/admin" : "/auth/login";

  const iconLinkClass = ({ isActive }) =>
    `flex items-center justify-center transition
     ${isActive
       ? "opacity-100 drop-shadow-[0_0_8px_rgba(123,44,255,0.9)]"
       : "opacity-60 hover:opacity-100"
     }`;

  const iconSize = 28;

  return (
    <section className="bg-black p-[20px]">
      <div className="grid grid-cols-3 items-center bg-white/5 text-white border border-white/10 rounded-[30px] px-[24px] h-[66px]">
        
        {/* LEFT: LOGO */}
        <NavLink to="/" className="flex justify-start font-bold gap-[4px] px-[12px] text-[20px]">
          <span>MARS</span>
          <span className="bg-[linear-gradient(180deg,rgba(81,162,255,1)_0%,rgba(173,70,255,1)_50%,rgba(255,43,127,1)_100%)] bg-clip-text text-transparent">
            AI
          </span>
        </NavLink>

        {/* CENTER: ICONS */}
        <div className="flex justify-center">
          <div className="grid grid-cols-5 gap-[32px]">
            
            {/* SEARCH -> /gallerie */}
            <NavLink to="/gallerie" className={iconLinkClass}>
              <svg
                width={iconSize}
                height={iconSize}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </NavLink>

            {/* HOME */}
            <NavLink to="/" end className={iconLinkClass}>
              <svg
                width={iconSize}
                height={iconSize}
                viewBox="0 0 48 48"
                fill="currentColor"
              >
                <path d="M 23.951172 4 A 1.50015 1.50015 0 0 0 23.072266 4.3222656 L 8.859375 15.519531 C 7.0554772 16.941163 6 19.113506 6 21.410156 L 6 40.5 C 6 41.863594 7.1364058 43 8.5 43 L 18.5 43 C 19.863594 43 21 41.863594 21 40.5 L 21 30.5 C 21 30.204955 21.204955 30 21.5 30 L 26.5 30 C 26.795045 30 27 30.204955 27 30.5 L 27 40.5 C 27 41.863594 28.136406 43 29.5 43 L 39.5 43 C 40.863594 43 42 41.863594 42 40.5 L 42 21.410156 C 42 19.113506 40.944523 16.941163 39.140625 15.519531 L 24.927734 4.3222656 A 1.50015 1.50015 0 0 0 23.951172 4 z M 24 7.4101562 L 37.285156 17.876953 C 38.369258 18.731322 39 20.030807 39 21.410156 L 39 40 L 30 40 L 30 30.5 C 30 28.585045 28.414955 27 26.5 27 L 21.5 27 C 19.585045 27 18 28.585045 18 30.5 L 18 40 L 9 40 L 9 21.410156 C 9 20.030807 9.6307412 18.731322 10.714844 17.876953 L 24 7.4101562 z" />
              </svg>
            </NavLink>

            {/* WIN -> /gallerie */}
            <NavLink to="/palmares" className={iconLinkClass}>
              <svg
                width={iconSize}
                height={iconSize}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M8 21h8" />
                <path d="M12 17v4" />
                <path d="M7 4h10v5a5 5 0 0 1-10 0V4z" />
                <path d="M5 6h2a3 3 0 0 1-3 3V6z" />
                <path d="M19 6h-2a3 3 0 0 0 3 3V6z" />
              </svg>
            </NavLink>

            {/* CALENDAR -> admin/events если залогинен, иначе login */}
            <NavLink to="/agenda" className={iconLinkClass}>
              <svg
                width={iconSize}
                height={iconSize}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </NavLink>

            {/* user if logged in -> /admin, else -> /auth/login */}
            <NavLink to={userPath} end className={iconLinkClass}>
              <svg
                width={iconSize}
                height={iconSize}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="7" r="4" />
                <path d="M5.5 21a6.5 6.5 0 0 1 13 0" />
              </svg>
            </NavLink>
          </div>
        </div>
        {/* RIGHT: EMPTY FOR CENTERING*/}
        <div />
      </div>
    </section>
  );
}
