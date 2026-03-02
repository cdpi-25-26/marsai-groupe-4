import { Outlet } from "react-router";
import Navbar from "../components/Navbar";
import LanguageSwitcher from "../components/LanguageSwitcher";
import { Suspense } from "react";

import {Facebook} from "lucide-react"
import {Instagram} from "lucide-react"
import {Youtube} from "lucide-react"
import {Twitter} from "lucide-react"

export default function PublicLayout() {

  

  
  return (
    
    <div className="min-h-screen flex flex-col">
        <div className="flex justify-end px-[20px] py-[10px] bg-black">
    <LanguageSwitcher />
  </div>
      <Navbar />

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-black py-[64px] sm:py-[96px] px-[20px] sm:px-[40px] w-full">
        <section className="max-w-[1000px] mx-auto">

          {/* TOP */}
          <div
            className="
              grid gap-[48px]
              grid-cols-1
              md:grid-cols-2
              lg:grid-cols-3
            "
          >
            {/* BRAND */}
            <div className="flex flex-col gap-[32px]">
              <h1 className="text-white text-[32px] sm:text-[36px] font-bold tracking-[-1.8px]">
                MARS <span className="text-[#AD46FF]">AI</span>
              </h1>

              <p className="text-white/30 text-[16px] sm:text-[18px] italic max-w-[300px]">
                "La plateforme mondiale de la narration générative, ancrée dans
                la lumière de Marseille."
              </p>

              <div className="grid grid-cols-4 max-w-[220px] gap-2">
                <Facebook />
                <Instagram />
                <Youtube />
                <Twitter/>
              </div>
            </div>

            {/* LINKS */}
            <div className="grid grid-cols-2 gap-[40px] text-[15px]">
              <div className="flex flex-col gap-[18px] text-white/40">
                <h2 className="text-[#AD46FF] uppercase text-[11px] tracking-[4.4px] mb-[12px]">
                  Navigation
                </h2>
                <span>Galerie</span>
                <span>Programme</span>
                <span>Top 50</span>
                <span>Billetterie</span>
              </div>

              <div className="flex flex-col gap-[18px] text-white/40">
                <h2 className="text-[#F6339A] uppercase text-[11px] tracking-[4.4px] mb-[12px]">
                  Légal
                </h2>
                <span>Partenaires</span>
                <span>FAQ</span>
                <span>Contact</span>
              </div>
            </div>

            {/* NEWSLETTER */}
            <div className="flex md:col-span-2 lg:col-span-1 md:justify-start lg:justify-end">
              <div
                className="
                  w-full md:w-[330px]
                  rounded-[28px]
                  border border-white/5
                  bg-[linear-gradient(45deg,rgba(13,13,13,1)_60%,rgba(173,70,255,0.2)_100%)]
                  p-[28px] sm:p-[40px]
                  flex flex-col gap-[20px]
                "
              >
                <h2 className="text-white font-bold text-[22px] sm:text-[24px] tracking-[-0.6px]">
                  RESTEZ <br /> CONNECTÉ
                </h2>

                <div className="flex gap-[10px]">
                  <input
                    placeholder="Email Signal"
                    type="email"
                    className="
                      w-full h-[52px]
                      rounded-[14px]
                      bg-white/5
                      border border-white/5
                      px-[18px]
                      text-[14px]
                      text-white
                      placeholder-white/20
                    "
                  />
                  <button
                    className="
                      px-[18px]
                      bg-white
                      text-black
                      rounded-[14px]
                      font-bold
                      text-[11px]
                      tracking-[1.1px]
                    "
                  >
                    OK
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* BOTTOM */}
          <div
            className="
              mt-[64px] sm:mt-[96px]
              pt-[32px]
              border-t border-white/5
              flex flex-col gap-[12px]
              sm:flex-row sm:justify-between
              text-[10px] tracking-[3px] text-white/20
            "
          >
            <div>© 2026 MARS.A.I ● PROTOCOL MARSEILLE HUB</div>
            <div>DESIGN SYSTÈME CYBER-PREMIUM LÉGAL</div>
          </div>

        </section>
      </footer>
    </div>
  );
}
