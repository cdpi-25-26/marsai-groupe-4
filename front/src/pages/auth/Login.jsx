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

const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(1, "Mot de passe requis"),
});

export function Login() {
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
      console.error("Login error:", error);
      console.error("Error response:", error.response);

      if (error.code === "ERR_NETWORK") {
        alert(
          "Impossible de contacter le serveur. Vérifiez que le backend est démarré.",
        );
      } else if (error.response?.data?.error) {
        alert(error.response.data.error);
      } else if (error.message) {
        alert(`Erreur: ${error.message}`);
      } else {
        alert("Erreur lors de la connexion");
      }
    },
  });

  const isLoggedIn = !!localStorage.getItem("email");

  if (isLoggedIn) {
    return (
      <>
       <h1 className="text-2xl">
          You are already logged in as {localStorage.getItem("first_name")}
        </h1>
         <h1 className="text-2xl">
          You are already logged in as {localStorage.getItem("first_name")}
        </h1>
         <h1 className="text-2xl">
          You are already logged in as {localStorage.getItem("first_name")}
        </h1>
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
    <>
      {/* <h1 className="text-2xl">Login</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Email
          </label>
          <input
            id="email"
            type="email"         
            placeholder="your@email.com"
            className="border p-2 rounded w-full"
            {...register("email")}
            required
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
             Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            className="border p-2 rounded w-full"
            {...register("password")}
            required
          />
        </div>

      </form>

      <Link to="/auth/register">No account yet? Register</Link> */}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-black text-white pt-[154px] pb-[90px] px-6"
      >
       
        <div className="flex flex-col max-w-[500px] my-0 mx-auto p-8 sm:p-[56px] items-center uppercase bg-black/70 border border-white/10 rounded-[24px] shadow-[0_0_30px_rgba(173,70,255,0.1)]">
          <LogIn className="bg-white/5 mb-[24px] border border-white/10 p-6 w-[96px] h-[96px] rounded-[32px] " />

          <h2 className="text-center text-[36px] sm:text-[48px] mb-[11px] font-bold inline-block bg-[linear-gradient(to_top,rgba(152,16,250,0.6)_35%,rgba(43,127,255,1)_60%)] bg-clip-text text-transparent tracking-[-2.4px]">
            CONNEXION
          </h2>
          <h2 className="text-center text-[10px] mb-[44px] tracking-[3px] text-white/50 font-bold">
            Protocole d'accès marsAI
          </h2>

          <h2 className="w-full text-[10px] mb-[12px] tracking-[2px]">
            Identifiant de Session
          </h2>
          <div className="flex bg-black/40 border border-white/10 rounded-[28px] w-full mb-[24px]">
            <img
              className="flex items-center px-[15px]"
              src="/src/assets/login_svg/Icon (2).svg"
              alt=""
            />
            <input
              id="email"
              type="email"
              placeholder="agent@marsai.io"
              {...register("email")}
              className="w-full h-[76px] outline-none  placeholder-white/40"
            />
          </div>

          <h2 className="w-full text-[10px] mb-[12px] tracking-[2px]">
            Clé Cryptographique
          </h2>
          <div className="flex bg-black/40 border border-white/10 rounded-[28px] w-full">
            <img
              className="flex items-center px-[15px]"
              src="/src/assets/login_svg/Icon (2).svg"
              alt=""
            />
            <input
              id="password"
              type="password"
              placeholder="●●●●●●"
              className="w-full h-[76px] outline-none  placeholder-white/40"
              {...register("password")}
              required
            />
          </div>

          <div className="flex text-[10px] items-center w-full py-[32px] gap-[10px] tracking-[1px]">
            {/* Checkbox */}
            <label className="relative inline-flex items-center cursor-pointer mb-[-1px]">
              <input type="checkbox" className="peer sr-only" />
              <div className="w-5 h-5 rounded-full border border-white/10 bg-black/40 flex items-center justify-center transition-colors duration-200 peer-checked:bg-blue-500">
                <svg
                  className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </label>

            {/* Текст */}
            <h2 className="mr-auto tracking-[1px]">Maintenir session</h2>
            <h2 className="text-[#51A2FF] tracking-[2px]  cursor-pointer">
              Reset ?
            </h2>
          </div>

          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="flex justify-center items-center gap-[17px] font-bold w-full bg-white text-black rounded-[28px] tracking-[2.75px] uppercase text-[11px] h-[76px] trackincg-[2.75px] mb-[75px]"
          >
            {" "}
            <Send size={20} />
            <h2>
              {loginMutation.isPending ? "Connecting..." : "Initialiser Flux"}
            </h2>
          </button>

          <div className="flex items-center sm:items-end flex-col sm:flex-row   w-full gap-[15px] justify-center">
            <h2 className="text-[11px] text-[rgba(255,255,255,0.6)] tracking-[2.2px]">
              Nouveau Voyageur ?
            </h2>
            <h2 className="text-[16px] capitalize tracking-[2.2px] mb-[-3px]">
              Générer Identité
            </h2>
          </div>
        </div>
      </form>
    </>
  );
}
