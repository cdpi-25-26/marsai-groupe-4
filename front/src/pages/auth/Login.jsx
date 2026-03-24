import { Link, useNavigate } from "react-router";
import { login } from "../../api/auth.js";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import handleLogout from "@/utils/helpers.js";
import { LogOut } from "lucide-react";
import { Send } from "lucide-react";
import { LogIn } from "lucide-react";
import { useTranslation } from "react-i18next";
import AccessDeniedPage from "../public/AccessDenied.jsx";

const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(1, "Mot de passe requis"),
});

export function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { register, handleSubmit } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const loginMutation = useMutation({
    mutationFn: async (data) => {
      return await login(data);
    },
    onSuccess: (response) => {
      localStorage.setItem("first_name", response.data.first_name);
      localStorage.setItem("email", response.data?.email);
      localStorage.setItem("role", response.data?.role);
      localStorage.setItem("token", response.data?.token);
      localStorage.setItem("userId", response.data?.id);

      switch (response.data?.role) {
        case "ADMIN":
          navigate("/admin");
          break;
        case "JURY":
          navigate("/");
          break;
        default:
          navigate("/");
          break;
      }
    },
    onError: (error) => {
      if (error.code === "ERR_NETWORK") {
        alert("Impossible de contacter le serveur.");
      } else if (error.response?.data?.error) {
        alert(error.response.data.error);
      } else {
        alert("Erreur lors de la connexion");
      }
    },
  });

  const isLoggedIn = !!localStorage.getItem("email");

  const token = localStorage.getItem('token');

  if (isLoggedIn && !token) {
  }
  
  
  if (isLoggedIn) {
    return <AccessDeniedPage />
    return (
      <>
        <h1 className="text-2xl">
          You are already logged in as {localStorage.getItem("first_name")}
        </h1>
        <button onClick={handleLogout} className="hover:cursor-pointer">
          <LogOut className="size-4" />
          <span>Log out</span>
        </button>
        <Link to="/">Return to homepage</Link>
         <h1 className="text-2xl">
          You are already logged in as {localStorage.getItem("first_name")}
        </h1>
        <button onClick={handleLogout} className="hover:cursor-pointer">
          <LogOut className="size-4" />
          <span>Log out</span>
        </button>
        <Link to="/">Return to homepage</Link>
      </>
    );
  }

  const onSubmit = (data) => {
    loginMutation.mutate(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-(--login-bg-main) text-(--login-text-main) pt-38.5 pb-22.5 px-6 transition-colors duration-300"
    >
      <div className="flex flex-col max-w-125 mx-auto p-8 sm:p-14 items-center uppercase bg-(--login-bg-card) border border-(--login-border-main) rounded-3xl shadow-[0_0_30px_rgba(173,70,255,0.1)] transition-colors duration-300">
        
        <LogIn className="bg-(--login-input-bg) mb-6 border border-(--login-border-main) p-6 w-24 h-24 rounded-[32px]" />

        <h2 className="text-center text-[36px] sm:text-[48px] mb-3 font-bold inline-block bg-[linear-gradient(to_top,rgba(152,16,250,0.6)_35%,rgba(43,127,255,1)_60%)] bg-clip-text text-transparent tracking-[-2.4px]">
          CONNEXION
        </h2>

        <h2 className="text-center text-[10px] mb-11 tracking-[3px] text-(--login-text-muted) font-bold">
          {t("login.protocole")}
        </h2>

        <h2 className="w-full text-[10px] mb-3 tracking-[2px]">
          {t("login.session_identity")}
        </h2>

        <div className="flex bg-(--login-input-bg) border border-(--login-border-main) rounded-[28px] w-full mb-6">
          <img
            className="flex items-center px-3.75"
            src="/src/assets/login_svg/Icon (2).svg"
            alt=""
          />
          <input
            id="email"
            type="email"
            placeholder="agent@marsai.io"
            {...register("email")}
            className="w-full h-19 outline-none bg-transparent placeholder-(--login-text-muted)"
          />
        </div>

        <h2 className="w-full text-[10px] mb-3 tracking-[2px]">
          {t("login.password")}
        </h2>

        <div className="flex bg-(--login-input-bg) border border-(--login-border-main) rounded-[28px] w-full">
          <img
            className="flex items-center px-3.75"
            src="/src/assets/login_svg/Icon (2).svg"
            alt=""
          />
          <input
            id="password"
            type="password"
            placeholder="●●●●●●"
            className="w-full h-19 outline-none bg-transparent placeholder-(--login-text-muted)"
            {...register("password")}
            required
          />
        </div>

        <div className="flex text-[10px] items-center w-full py-8 gap-2.5 tracking-[1px]">
          <label className="relative inline-flex items-center cursor-pointer -mb-px">
            <input type="checkbox" className="peer sr-only" />
            <div className="w-5 h-5 rounded-full border border-(--login-border-main) bg-(--login-input-bg) flex items-center justify-center peer-checked:bg-blue-500 transition-colors duration-200">
              <svg
                className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </label>

          <h2 className="mr-auto tracking-[1px]">{t("login.hold")}</h2>
          <h2 className="text-[#51A2FF] tracking-[2px] cursor-pointer">
            Reset ?
          </h2>
        </div>

        <button
          type="submit"
          disabled={loginMutation.isPending}
          className="flex justify-center items-center gap-4 font-bold w-full bg-(--login-btn-bg) text-(--login-bg-main) rounded-[28px] tracking-[2.75px] uppercase text-[11px] h-19 mb-18.75"
        >
          <Send size={20} />
          <h2>
            {loginMutation.isPending
              ? "Connecting..."
              : t("login.login_button")}
          </h2>
        </button>

        <div className="flex items-center sm:items-end flex-col sm:flex-row w-full gap-4 justify-center">
          <h2 className="text-[11px] text-(--login-text-muted) tracking-[2.2px]">
            {t("login.register_text")}
          </h2>
          <Link to="/auth/register" className="text-[16px] capitalize tracking-[2.2px] -mb-1">
            {t("login.register_button")}
          </Link>
        </div>
      </div>
    </form>
  );
}
