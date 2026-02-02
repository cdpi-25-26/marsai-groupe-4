import { Link, useNavigate } from "react-router";
import Button from "./Button";
import search from "../assets/navbar_svg/search.svg";
import home from "../assets/navbar_svg/home.svg";
import win from "../assets/navbar_svg/win3.svg";
import callendrier from "../assets/navbar_svg/callendrier.svg";
import user from "../assets/navbar_svg/user.svg";

export default function Navbar() {
  const navigate = useNavigate();
  const firstName = localStorage.getItem("first_name") || "Utilisateur";

  const isLoggedIn = !!localStorage.getItem("token");

  function handleLogout() {
    localStorage.removeItem("first_name");
    localStorage.removeItem("email");
    localStorage.removeItem("role");
    localStorage.removeItem("token");
    navigate("/");
  }

  return (
    <section className="bg-black p-[20px]">
      
      {" "}
      <div className="flex bg-white/5 text-white border border-white/10 h-[50px] rounded-[30px] justify-between items-center px-[24px] h-[66px]">
        {" "}
        <div className="flex font-bold gap-[4px] px-[12px] text-[20px]">
          {" "}
          <span>MARS</span>{" "}
          <span className="bg-[linear-gradient(180deg,rgba(81,162,255,1)_0%,rgba(173,70,255,1)_50%,rgba(255,43,127,1)_100%)] bg-clip-text text-transparent">
            {" "}
            AI{" "}
          </span>{" "}
        </div>{" "}
        <div>
          {" "}
          <div className="grid grid-cols-5 gap-[32px] ">
            {" "}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="11" cy="11" r="8"></circle>
  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
</svg>

<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" fill="white" viewBox="0 0 48 48">
<path d="M 23.951172 4 A 1.50015 1.50015 0 0 0 23.072266 4.3222656 L 8.859375 15.519531 C 7.0554772 16.941163 6 19.113506 6 21.410156 L 6 40.5 C 6 41.863594 7.1364058 43 8.5 43 L 18.5 43 C 19.863594 43 21 41.863594 21 40.5 L 21 30.5 C 21 30.204955 21.204955 30 21.5 30 L 26.5 30 C 26.795045 30 27 30.204955 27 30.5 L 27 40.5 C 27 41.863594 28.136406 43 29.5 43 L 39.5 43 C 40.863594 43 42 41.863594 42 40.5 L 42 21.410156 C 42 19.113506 40.944523 16.941163 39.140625 15.519531 L 24.927734 4.3222656 A 1.50015 1.50015 0 0 0 23.951172 4 z M 24 7.4101562 L 37.285156 17.876953 C 38.369258 18.731322 39 20.030807 39 21.410156 L 39 40 L 30 40 L 30 30.5 C 30 28.585045 28.414955 27 26.5 27 L 21.5 27 C 19.585045 27 18 28.585045 18 30.5 L 18 40 L 9 40 L 9 21.410156 C 9 20.030807 9.6307412 18.731322 10.714844 17.876953 L 24 7.4101562 z"></path>
</svg>




            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M8 21h8"></path>
  <path d="M12 17v4"></path>
  <path d="M7 4h10v5a5 5 0 0 1-10 0V4z"></path>
  <path d="M5 6h2a3 3 0 0 1-3 3V6z"></path>
  <path d="M19 6h-2a3 3 0 0 0 3 3V6z"></path>
</svg>

            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <rect x="3" y="4" width="18" height="18" rx="2"></rect>
  <line x1="16" y1="2" x2="16" y2="6"></line>
  <line x1="8" y1="2" x2="8" y2="6"></line>
  <line x1="3" y1="10" x2="21" y2="10"></line>
</svg>



            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="12" cy="7" r="4"></circle>
  <path d="M5.5 21a6.5 6.5 0 0 1 13 0"></path>
</svg>

          </div>{" "}
          <div className="hidden grid-cols-5 gap-[32px] text-[10px] text-center h-[0px] relative bottom-[7px]">
            {" "}
            <h1>●</h1> <h1>●</h1> <h1>●</h1> <h1>●</h1> <h1>●</h1>{" "}
          </div>{" "}
        </div>{" "}
        <span className="flex gap-[15px]">
          {" "}
          <button className="tracking-[0.3px] font-bold text-[12px] text-white/80">
            CONNEXION
          </button>{" "}
          <button className="tracking-[0.3px] font-bold text-[12px] bg-[linear-gradient(180deg,rgba(81,162,255,1)_0%,rgba(152,16,250,1)_100%)] px-[20px] py-[7px] rounded-[30px] gap-[20px]">
            INSCRIPTON
          </button>{" "}
        </span>{" "}
      </div>{" "}
    </section>
  );
}
