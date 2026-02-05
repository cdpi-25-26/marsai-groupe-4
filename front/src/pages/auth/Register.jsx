import { Link, useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { signIn } from "../../api/auth.js";

// Schéma de validation Zod
const registerSchema = z
  .object({
    first_name: z.string().min(1, "Le prénom est requis"),
    last_name: z.string().min(1, "Le nom est requis"),
    email: z.string().email("Email invalide"),
    password: z
      .string()
      .min(6, "Le mot de passe doit contenir au moins 6 caractères"),
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

      <section className="bg-black text-white py-[90px]">
        <div className="flex flex-col w-fit my-0 mx-auto p-[56px] items-center uppercase bg-black/70 border border-white/10 rounded-[24px] shadow-[0_0_30px_rgba(173,70,255,0.1)]">

            <img className="bg-white/5 mb-[24px] border border-white/10 p-6 w-fit w-[96px] h-[96px] rounded-[32px] " src="/src/assets/login_svg/Icon.svg" alt="" />
        
        

          <h2 className="text-center text-[48px] mb-[11px] font-bold inline-block inline-block bg-[linear-gradient(to_top,rgba(152,16,250,0.6)_35%,rgba(43,127,255,1)_60%)] bg-clip-text text-transparent tracking-[-2.4px]">INSCRIPTION</h2>
          <h2 className="text-center text-[10px] mb-[44px] tracking-[3px] text-white/50 font-bold">Nouveau profil cyber-premium</h2>

          <h2 className="w-full text-[10px] mb-[12px] tracking-[2px]">Alias Citoyen</h2>
         

          <div className="flex bg-black/40 border border-white/10 rounded-[28px] w-full mb-[24px]">
          <img className="flex items-center px-[15px]" src="/src/assets/login_svg/Icon (2).svg" alt="" />
               <input placeholder="John Doe" className="w-full h-[76px] outline-none  placeholder-white/10" type="email " />
          </div>
          <h2 className="w-full text-[10px] mb-[12px] tracking-[2px]">Canal de Communication</h2>

          <div className="flex bg-black/40 border border-white/10 rounded-[28px] w-full mb-[24px]">
          <img className="flex items-center px-[15px]" src="/src/assets/login_svg/Icon (2).svg" alt="" />
               <input placeholder="nom@exemple.com" className="w-full h-[76px] outline-none  placeholder-white/10" type="email " />
          </div>

          
          <div className="grid grid-cols-2 gap-[24px]">


            <div>
              <h2 className=" tracking-[2px] text-[10px] mb-[12px]">Clé d'Accès</h2>
              <div className="flex bg-black/40 border border-white/10 rounded-[28px] w-[200px] ">
          
               <input placeholder="●●●●●●" className="w-full h-[76px] pl-[15px] outline-none  placeholder-white/10" type="email " />
          <img className="flex items-center px-[15px]" src="/src/assets/login_svg/Icon (2).svg" alt="" />
          </div>
            </div>


            <div>
              <h2 className="tracking-[2px] text-[10px] mb-[12px]">Vérification</h2>
              <div className="flex bg-black/40 border border-white/10 rounded-[28px] w-[200px]">
         
               <input placeholder="●●●●●●" className=" pl-[15px] w-full h-[76px] outline-none  placeholder-white/10" type="email " />
                <img className="flex items-center px-[15px]" src="/src/assets/login_svg/Icon (2).svg" alt="" />
          </div>
            </div>
          </div>



          <div className="flex text-[10px]  items-center w-full py-[32px] gap-[10px] tracking-[1px]">
            <label className="mb-[1px] bg-black/40 inline-block w-[20px] h-[20px] border-[2px] border-white rounded-[100%] cursor-pointer peer">
              <input type="checkbox" className="hidden peer" />
              <div className="rounded-[100%] hidden peer-checked:block w-full h-full bg-blue-500"></div>
            </label>

            
            <h2 className="mr-auto tracking-[1px]">Je consents aux Termers et au condition GENERAL</h2>
            
            

            
          </div>

          <button className="flex justify-center items-center gap-[17px] font-bold w-full bg-white text-black rounded-[28px] tracking-[2.75px] uppercase text-[11px] h-[76px] trackincg-[2.75px] mb-[75px]"> <img src="/src/assets/login_svg/Icon (3).svg" alt="" /> <h2>Initialiser Flux</h2></button>

          <div className="flex items-end  w-full gap-[15px] justify-center">
              <h2 className="text-[11px] white-[80px] tracking-[2.2px]">Déjà Enregistré ?</h2>
              <h2 className="text-[16px] capitalize tracking-[2.2px] mb-[-3px]">Ouvrir Session</h2>
            </div>
        </div>
        
      </section>
    </>
  );
}
