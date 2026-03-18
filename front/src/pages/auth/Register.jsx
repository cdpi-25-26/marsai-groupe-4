import { Link, useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { signIn } from "../../api/auth.js";
import { Send } from "lucide-react";
import {UserPlus} from "lucide-react" 
import { useTranslation } from "react-i18next";

// Schéma de validation Zod
const registerSchema = z
  .object({
    first_name: z.string().min(1, "Le prénom est requis"),
    last_name: z.string().min(1, "Le nom est requis"),
    email: z.string().email("Email invalide"),
    password: z
      .string()
      .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
    confirmpassword: z.string(),
  })
  .refine((data) => data.password === data.confirmpassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmpassword"],
  });

export function Register() {
  const navigate = useNavigate();

  // React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  // Mutation pour appeler le backend
  const registerMutation = useMutation({
    mutationFn: async (data) => {
      // Envoi au backend
      return await signIn({
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        password: data.password,
        // role est optionnel, backend met "PRODUCER" par défaut
      });
    },
    onSuccess: (res) => {
      alert(res.data.message);
      navigate("/auth/login"); // redirection après inscription
    },
    onError: (err) => {
      alert(err.response?.data?.error || "Une erreur est survenue");
    },
  });

  // Fonction appelée au submit
  const onSubmit = (data) => {
    registerMutation.mutate(data);
  };

  // Si déjà connecté
  if (localStorage.getItem("first_name")) {
    return (
      <>
        <h1 className="text-2xl">
          You are already logged in as {localStorage.getItem("first_name")}
        </h1>
        <Link to="/">Go to Home</Link>
      </>
    );
  }
  const { t } = useTranslation();
  return (
    <>
      {/* <h1 className="text-2xl">Register</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>Prénom</label>
        <input type="text" {...register("first_name")} required />
        {errors.first_name && <span>{errors.first_name.message}</span>}

        <label>Nom</label>
        <input type="text" {...register("last_name")} required />
        {errors.last_name && <span>{errors.last_name.message}</span>}

        <label>Email</label>
        <input type="email" {...register("email")} required />
        {errors.email && <span>{errors.email.message}</span>}

        <label>Mot de passe</label>
        <input type="password" {...register("password")} required />
        {errors.password && <span>{errors.password.message}</span>}

        <label>Confirmez le mot de passe</label>
        <input type="password" {...register("confirmpassword")} required />
        {errors.confirmpassword && <span>{errors.confirmpassword.message}</span>}

        <button type="submit">Register</button>
      </form>

      <Link to="/auth/login">Already have an account? Login</Link> */}

      <form
  onSubmit={handleSubmit(onSubmit)}
  className="pt-[154px] pb-[90px] px-6 bg-[var(--login-bg-main)]"
  style={{ color: "var(--login-text-main)" }}
>
  <div
    className="flex flex-col w-fit my-0 mx-auto p-8 sm:p-[56px] items-center uppercase rounded-[24px] backdrop-blur-xl shadow-xl"
    style={{
      background: "var(--login-bg-card)",
      border: "1px solid var(--login-border-main)",
    }}
  >
    <UserPlus
      className="mb-[24px] p-6 w-[96px] h-[96px] rounded-[32px]"
      style={{
        background: "var(--login-input-bg)",
        border: "1px solid var(--login-border-main)",
      }}
    />

    <h2 className="text-center text-[36px] sm:text-[48px] mb-[11px] font-bold inline-block 
    bg-[linear-gradient(to_top,rgba(152,16,250,0.6)_35%,rgba(43,127,255,1)_60%)] 
    bg-clip-text text-transparent tracking-[-2.4px]">
      {t("register.register_title")}
    </h2>

    <h2
      className="text-center text-[10px] mb-[44px] tracking-[3px] font-bold"
      style={{ color: "var(--login-text-muted)" }}
    >
      {t("register.subtitle_title")}
    </h2>

    {/* FIRST NAME */}
    <h2 className="w-full text-[10px] mb-[12px] tracking-[2px]">
      {t("register.first_name")}
    </h2>

    <div
      className="flex rounded-[28px] w-full mb-[24px]"
      style={{
        background: "var(--login-input-bg)",
        border: "1px solid var(--login-border-main)",
      }}
    >
      <input
        placeholder="John"
        {...register("first_name")}
        className="w-full h-[76px] pl-[15px] outline-none bg-transparent"
        style={{ color: "var(--login-text-main)" }}
        type="text"
      />
    </div>

    {/* LAST NAME */}
    <h2 className="w-full text-[10px] mb-[12px] tracking-[2px]">
      {t("register.last_name")}
    </h2>

    <div
      className="flex rounded-[28px] w-full mb-[24px]"
      style={{
        background: "var(--login-input-bg)",
        border: "1px solid var(--login-border-main)",
      }}
    >
      <input
        placeholder="Doe"
        {...register("last_name")}
        className="w-full h-[76px] pl-[15px] outline-none bg-transparent"
        style={{ color: "var(--login-text-main)" }}
        type="text"
      />
    </div>

    {/* EMAIL */}
    <h2 className="w-full text-[10px] mb-[12px] tracking-[2px]">
      {t("register.email")}
    </h2>

    <div
      className="flex rounded-[28px] w-full mb-[24px]"
      style={{
        background: "var(--login-input-bg)",
        border: "1px solid var(--login-border-main)",
      }}
    >
      <input
        placeholder="nom@exemple.com"
        {...register("email")}
        className="w-full h-[76px] pl-[15px] outline-none bg-transparent"
        style={{ color: "var(--login-text-main)" }}
        type="email"
      />
    </div>

    {/* PASSWORDS */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-[24px] w-full">
      <div>
        <h2 className="tracking-[2px] text-[10px] mb-[12px]">
          {t("register.password")}
        </h2>

        <div
          className="flex rounded-[28px] w-full"
          style={{
            background: "var(--login-input-bg)",
            border: "1px solid var(--login-border-main)",
          }}
        >
          <input
            placeholder="●●●●●●"
            {...register("password")}
            className="w-full h-[76px] pl-[15px] outline-none bg-transparent"
            style={{ color: "var(--login-text-main)" }}
            type="password"
          />
        </div>
      </div>

      <div>
        <h2 className="tracking-[2px] text-[10px] mb-[12px]">
          {t("register.confirm_pasword")}
        </h2>

        <div
          className="flex rounded-[28px] w-full"
          style={{
            background: "var(--login-input-bg)",
            border: "1px solid var(--login-border-main)",
          }}
        >
          <input
            placeholder="●●●●●●"
            {...register("confirmpassword")}
            className="w-full h-[76px] pl-[15px] outline-none bg-transparent"
            style={{ color: "var(--login-text-main)" }}
            type="password"
          />
        </div>
      </div>
    </div>

    {/* SUBMIT */}
    <button
      type="submit"
      disabled={registerMutation.isPending}
      className="flex justify-center items-center gap-[17px] font-bold w-full 
      rounded-[28px] tracking-[2.75px] uppercase text-[11px] h-[76px] mt-[40px]"
      style={{
        background: "var(--login-btn-bg)",
        color: "var(--login-bg-main)",
      }}
    >
      <Send size={20} />
      {registerMutation.isPending
        ? "Loading..."
        : t("register.register_button")}
    </button>
  </div>
        <div className="flex items-center sm:items-end flex-col sm:flex-row w-full gap-[15px] justify-center">
          <h2 className="text-[11px] text-[var(--login-text-muted)] tracking-[2.2px]">
            {t("register.login_text")}
          </h2>
          <Link to="/auth/login" className="text-[16px] capitalize tracking-[2.2px] mb-[-3px]">
            {t("register.login_button")}
          </Link>
        </div>
      
</form>

    </>
  );
}
