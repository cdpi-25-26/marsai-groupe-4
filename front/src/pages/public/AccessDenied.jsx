import React from "react";
import { useNavigate } from "react-router";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";


export default function AccessDeniedPage() {
  const navigate = useNavigate();

  return (
<>
 <Navbar />
    <div className="min-h-screen bg-black text-white font-sans">
    
      <main className="mx-auto max-w-[1180px] px-6 py-16">
        <section className="rounded-[28px] border border-white/10 bg-white/5 p-8 shadow-[0_24px_80px_rgba(0,0,0,0.55)] backdrop-blur-md md:p-12">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-4 py-2 text-[11px] font-black tracking-widest text-white/80">
            ACCÈS REFUSÉ
          </div>

          <h1 className="m-0 text-[40px] leading-[1.05] font-black tracking-[-1px] md:text-[56px]">
            Désolé, vous n’avez{" "}
            <span className="bg-gradient-to-r from-[#ff4fd8] to-[#7b2cff] bg-clip-text text-transparent">
              pas accès
            </span>{" "}
            à cette page.
          </h1>

          <p className="mt-4 max-w-[75ch] text-white/70">
            Cette page est réservée aux utilisateurs autorisés.  
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              onClick={() => navigate("/")}
              className="rounded-2xl px-6 py-4 text-sm font-black text-white
                         bg-gradient-to-r from-[#7b2cff] to-[#FF2B7F]
                         shadow-[0_24px_80px_rgba(0,0,0,0.55)] transition hover:opacity-95"
            >
              Revenir à l’accueil
            </button>

            <button
              onClick={() => navigate(-1)}
              className="rounded-2xl px-6 py-4 text-sm font-black text-white/80 transition hover:bg-white/5"
            >
              Retour
            </button>
          </div>
        </section>
      </main>

     
    </div>

    <Footer /></>
    
   
  );
}
