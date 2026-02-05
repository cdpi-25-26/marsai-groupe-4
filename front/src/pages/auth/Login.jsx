import { Link, useNavigate } from "react-router";
import { login } from "../../api/auth.js";
import { useMutation } from "@tanstack/react-query";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import handleLogout from "@/utils/helpers.js";
import { LogOut } from "lucide-react";

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
      alert(error.response?.data?.error || "Erreur lors de la connexion");
    },
  });

  const isLoggedIn = !!localStorage.getItem("email");

  if (isLoggedIn) {
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

      <form onSubmit={handleSubmit(onSubmit)} className="bg-black text-white py-[90px]">
        <div className="flex flex-col max-w-[500px] my-0 mx-auto p-[56px] items-center uppercase bg-black/70 border border-white/10 rounded-[24px] shadow-[0_0_30px_rgba(173,70,255,0.1)]">

            <img className="bg-white/5 mb-[24px] border border-white/10 p-6 w-fit w-[96px] h-[96px] rounded-[32px] " src="/src/assets/login_svg/Icon.svg" alt="" />
        
        

          <h2 className="text-center text-[48px] mb-[11px] font-bold inline-block inline-block bg-[linear-gradient(to_top,rgba(152,16,250,0.6)_35%,rgba(43,127,255,1)_60%)] bg-clip-text text-transparent tracking-[-2.4px]">CONNEXION</h2>
          <h2 className="text-center text-[10px] mb-[44px] tracking-[3px] text-white/50 font-bold">Protocole d'accès marsAI</h2>

          
          <h2 className="w-full text-[10px] mb-[12px] tracking-[2px]">Identifiant de Session</h2>
          <div className="flex bg-black/40 border border-white/10 rounded-[28px] w-full mb-[24px]">
          <img className="flex items-center px-[15px]" src="/src/assets/login_svg/Icon (2).svg" alt="" />
               <input id="email" type="email" placeholder="agent@marsai.io" {...register("email")} className="w-full h-[76px] outline-none  placeholder-white/10"  />
          </div>
          
          <h2 className="w-full text-[10px] mb-[12px] tracking-[2px]">Clé Cryptographique</h2>
          <div className="flex bg-black/40 border border-white/10 rounded-[28px] w-full">
          <img className="flex items-center px-[15px]" src="/src/assets/login_svg/Icon (2).svg" alt="" />
               <input id="password" type="password" placeholder="●●●●●●" className="w-full h-[76px] outline-none  placeholder-white/10" {...register("password")} required />
          </div>

          <div className="flex text-[10px]  items-center w-full py-[32px] gap-[10px] tracking-[1px]">
            <label className="mb-[1px] bg-black/40 inline-block w-[20px] h-[20px] border-1 border-white/10 rounded-[100%] cursor-pointer peer">
              <input type="checkbox" className="hidden peer" />
              <div className="rounded-[100%] hidden peer-checked:block w-full h-full bg-blue-500"></div>
            </label>

            
            <h2 className="mr-auto tracking-[1px]">Maintenir session</h2>
            <h2 className="text-[#51A2FF] tracking-[2px]">Reset ?</h2>
            
            
          </div>

          <button 
          type="submit"
          disabled={loginMutation.isPending} 
          className="flex justify-center items-center gap-[17px] font-bold w-full bg-white text-black rounded-[28px] tracking-[2.75px] uppercase text-[11px] h-[76px] trackincg-[2.75px] mb-[75px]"> <img src="/src/assets/login_svg/Icon (3).svg" alt="" /> 
            <h2>{loginMutation.isPending ? "Connecting..." : "Initialiser Flux"}</h2>
          </button>

          <div className="flex items-end  w-full gap-[15px] justify-center">
              <h2 className="text-[11px] white-[80px] tracking-[2.2px]">Nouveau Voyageur ?</h2>
              <h2 className="text-[16px] capitalize tracking-[2.2px] mb-[-3px]">Générer Identité</h2>
            </div>
        </div>
        
      </form>


      
    </>
  );
} 