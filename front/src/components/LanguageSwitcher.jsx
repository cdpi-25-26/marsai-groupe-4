import { useEffect, useState } from "react"
import i18n from "i18next"

export default function LanguageSwitcher() {
  const [lang, setLang] = useState(i18n.language || "fr")

  useEffect(() => {
    i18n.changeLanguage(lang)
    localStorage.setItem("lang", lang)
  }, [lang])

  return (
    <div className="flex items-center">
      <div
        className="relative w-[90px] h-[40px] bg-white/10 rounded-full p-1 cursor-pointer"
        onClick={() => setLang(lang === "fr" ? "en" : "fr")}
      >
        {/* Slider */}
        <div
          className={`absolute top-1 left-1 w-[38px] h-[38px] bg-white rounded-full shadow-md transition-all duration-300 ${
            lang === "en" ? "translate-x-[50px]" : ""
          }`}
        />

        {/* Labels */}
        <div className="absolute inset-0 flex justify-between items-center px-3 text-sm font-semibold">
          <span className={lang === "fr" ? "text-black z-10" : "text-white/60"}>
            FR
          </span>
          <span className={lang === "en" ? "text-black z-10" : "text-white/60"}>
            EN
          </span>
        </div>
      </div>
    </div>
  )
}

