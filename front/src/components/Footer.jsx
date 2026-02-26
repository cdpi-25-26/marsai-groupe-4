import React from 'react'
import { useTranslation } from 'react-i18next'

function Footer() {
  const { t } = useTranslation()
  return (
    <div className="bg-black py-[96px] px-[40px] w-full">
        <section className="max-w-[1000px] m-0 mx-auto">
          <div className="grid grid-cols-3 gap-6  ">
            <div className="flex flex-col gap-8">
              <h1 className="text-white text-[36px] font-bold tracking-[-1.8px]">
                MARS <span className="text-[#AD46FF]">AI</span>
              </h1>

              <h1 className="text-white/30 text-start text-[18px] italic max-w-[300px]">
                {t("footer.subtitle")}
              </h1>

              <div className="grid grid-cols-4 max-w-[250px] gap-2">
                <img
                  className=""
                  src="src/assets/login_png/Button.svg"
                  alt=""
                />
                <img
                  className=""
                  src="src/assets/login_png/Button (1).svg"
                  alt=""
                />
                <img
                  className=""
                  src="src/assets/login_png/Button (2).svg"
                  alt=""
                />
                <img
                  className=""
                  src="src/assets/login_png/Button (3).svg"
                  alt=""
                />
              </div>
            </div>

            <div className="grid grid-cols-2 text-start text-[16px]">
              <div className="flex flex-col gap-[20px] text-white/40 ">
                <h2 className="text-[#AD46FF] uppercase mb-[20px] text-[11px] tracking-[4.4px]">
                  Navigation
                </h2>
                <h2>Galerie</h2>
                <h2>Programme</h2>
                <h2>Top 50</h2>
                <h2>Billetterie</h2>
              </div>

              <div className="flex flex-col gap-[20px] text-white/40">
                <h2 className="text-[#F6339A] uppercase mb-[20px] text-[11px] tracking-[4.4px]">
                  Légal
                </h2>
                <h2>Partenaires</h2>
                <h2>FAQ</h2>
                <h2>Contact</h2>
              </div>
            </div>
            <div>
              <div className="flex flex-col w-[330px] rounded-[36px] border border-white/5  bg-[linear-gradient(45deg,rgba(13,13,13,1)_60%,rgba(173,70,255,0.2)_100%)] p-[40px] gap-[20px]">
                <h2 className="text-start text-white font-bold text-[24px] tracking-[-0.6px]">
                  RESTEZ <br />
                  CONNECTÉ
                </h2>

                <div className="flex gap-[10px]">
                  <input
                    placeholder="Email Signal"
                    type="text"
                    className="w-full rounded-[14px] placeholder-white/10 text-[14px] border border-white/5 runded bg-white/3 p-[25px] h-[56px]"
                  />{" "}
                  <button className="text-center py-0 px-[20px] bg-white rounded-[14px] font-bold text-[11px] tracking-[1.1px]">
                    OK
                  </button>
                </div>
              </div>
            </div>
          </div>


          <div className="flex justify-between tracking-[3px] text-[10px] text-white/20 py-[40px] px-0 border-t border-white/5 mt-[96px]">
            <div>© 2026 MARS.A.I ● PROTOCOL MARSEILLE HUB</div>
            <div>DESIGN SYSTÈME CYBER-PREMIUM LÉGAL</div>
          </div>

        </section>

        

        
      </div>
  )
}

export default Footer