import React from "react";
import { NavLink } from "react-router";
import { useTranslation } from "react-i18next";
import { Facebook, Instagram, Youtube, Twitter } from "lucide-react";

function Footer() {
  const { t } = useTranslation();

  const footerLinkClass = ({ isActive }) =>
    `block transition ${
      isActive
        ? "text-[var(--footer-text)]"
        : "text-[var(--footer-credit)] hover:text-[var(--footer-text)]"
    }`;

  const handleNavigate = () => {
    window.scrollTo(0, 0);
  };

  return (
    <footer className="bg-background py-[64px] sm:py-[96px] px-[20px] sm:px-[40px] w-full">
      <section className="max-w-[1000px] mx-auto">
        <div
          className="
            grid gap-[48px]
            grid-cols-1
            md:grid-cols-2
            md:grid-rows-2
            lg:grid-cols-3
          "
        >
          <div className="flex flex-col gap-[32px]">
            <h1 className="text-[var(--footer-text)] text-[32px] sm:text-[36px] font-bold tracking-[-1.8px]">
              MARS <span className="text-[#AD46FF]">AI</span>
            </h1>

            <p className="text-[var(--footer-subtitle)] text-[16px] sm:text-[18px] italic max-w-[300px]">
              {t("footer.subtitle")}
            </p>

            <div className="grid grid-cols-4 max-w-[220px] gap-2 text-[var(--footer-text)]">
              <Facebook />
              <Instagram />
              <Youtube />
              <Twitter />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-[40px] text-[15px]">
            <div className="flex flex-col gap-[18px]">
              <h2 className="text-[#AD46FF] uppercase text-[11px] tracking-[4.4px] mb-[12px]">
                Navigation
              </h2>

              <NavLink to="/gallerie" className={footerLinkClass} onClick={handleNavigate}>
                {t("footer.gallery")}
              </NavLink>

              <NavLink to="/agenda" className={footerLinkClass} onClick={handleNavigate}>
                {t("footer.program")}
              </NavLink>

              <NavLink to="/palmares" className={footerLinkClass} onClick={handleNavigate}>
                Top 50
              </NavLink>
            </div>

            <div className="flex flex-col gap-[18px]">
              <h2 className="text-[#F6339A] uppercase text-[11px] tracking-[4.4px] mb-[12px]">
                {t("footer.legal")}
              </h2>

              <NavLink to="/contact" className={footerLinkClass} onClick={handleNavigate}>
                FAQ
              </NavLink>

              <NavLink to="/contact" className={footerLinkClass} onClick={handleNavigate}>
                Contact
              </NavLink>
            </div>
          </div>

          <div className="flex md:col-span-2 lg:col-span-1 md:justify-start lg:justify-end">
            <div
              style={{ background: "var(--email-gradient)" }}
              className="
                w-full
                md:w-auto
                rounded-[28px]
                border border-[var(--email-gradient-border)]
                p-[28px] sm:p-[40px]
                flex flex-col gap-[20px]
              "
            >
              <h2 className="text-[var(--footer-text)] font-bold text-[22px] sm:text-[24px] tracking-[-0.6px]">
                {t("footer.stay")} <br /> {t("footer.connected")}
              </h2>

              <div className="flex gap-[10px]">
                <input
                  placeholder="Email Signal"
                  type="email"
                  className="
                    w-full h-[52px]
                    rounded-[14px]
                    bg-[var(--email-bg)]
                    border
                    border-[var(--email-border)]
                    px-[18px]
                    text-[14px]
                    text-white
                    placeholder-[var(--email-placeholder)]
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

        <div
          className="
            mt-[60px] sm:mt-[96px]
            pt-[32px]
            border-t border-white/5
            flex flex-col gap-[12px]
            sm:flex-row sm:justify-between
            text-[10px] tracking-[3px] text-[var(--footer-subtitle)]
          "
        >
          <div>{t("footer.year")}</div>
          <div>{t("footer.legal_text")}</div>
        </div>
      </section>
    </footer>
  );
}

export default Footer;