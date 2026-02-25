import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend"; // https://github.com/i18next/i18next-http-backend



i18n
    .use(Backend)
    .use(initReactI18next)
    .init({
        lng: "en", // c'est language par défualt
        debug: true,
        fallbackLng: "fr", // si jamais lng est introuvable 
        interpolation: {
            escapeValue: false,
        },
        backend:{
           loadPath: "http://localhost:3000/translations/{{lng}}",
            requestOptions: {
                headers:{
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
        }
    }
    });
export default i18n;