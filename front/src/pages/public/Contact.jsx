import React, { useState, useMemo, useEffect } from "react";
import { Train, Car, MapPin, CalendarDays, Clock, Navigation } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Contact() {
  const { t, i18n } = useTranslation();

  const [form, setForm] = useState({
    email: "",
    name: "",
    subject: "",
    message: "",
  });

  const [schedule, setSchedule] = useState([]);

  // ===== FETCH SCHEDULE FROM DB =====
  useEffect(() => {
    fetch("/api/schedule/today")
      .then((res) => res.json())
      .then((data) => setSchedule(data))
      .catch(() => setSchedule([]));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const subject = encodeURIComponent(`Demande: ${form.subject}`);
    const body = encodeURIComponent(
      `Nom: ${form.name}\nEmail: ${form.email}\n\nMessage:\n${form.message}`
    );

    window.location.href = `mailto:tonemail@example.com?subject=${subject}&body=${body}`;
  };

  const today = new Date();

  const formattedDate = today
    .toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
    .toUpperCase();

  // Programme traduit
  const schedules = useMemo(
    () => ({
      "2026-06-13": [
        { time: t("contact.time_1"), tag: t("contact.tag_1"), title: t("contact.title_1") },
        { time: t("contact.time_2"), tag: t("contact.tag_2"), title: t("contact.title_2") },
        { time: t("contact.time_3"), tag: t("contact.tag_3"), title: t("contact.title_3") },
        { time: t("contact.time_4"), tag: t("contact.tag_4"), title: t("contact.title_4") },
        { time: t("contact.time_5"), tag: t("contact.tag_5"), title: t("contact.title_5") },
        { time: t("contact.time_6"), tag: t("contact.tag_6"), title: t("contact.title_6") },
        { time: t("contact.time_7"), tag: t("contact.tag_7"), title: t("contact.title_7") },
      ],
    }),
    [t]
  );

  const tagColors = {
    SOCIAL: "text-green-400",
    KEYNOTE: "text-purple-400",
    BREAK: "text-gray-400",
    CINÉMA: "text-pink-400",
    TALK: "text-white",
    AWARDS: "text-yellow-400",
    PARTY: "text-blue-400",
  };

  const todayKey = today.toISOString().split("T")[0];
  const todaySchedule = schedules[todayKey] || schedules["2026-06-13"];

  // ===== MAP: language depends on site language (fr/en) =====
  const lang = (i18n.resolvedLanguage || i18n.language || "fr").split("-")[0];

  const MAP_EMBEDS = {
    fr: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2903.003786061704!2d5.3662070762621505!3d43.31418017429154!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12c9c0f3f2295ed9%3A0xe8332bddf8f8ffdb!2s155%20Rue%20Peyssonnel%2C%2013002%20Marseille!5e0!3m2!1sfr!2sfr!4v1772199578627!5m2!1sfr!2sfr",
    en: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2903.0039725154975!2d5.3662070761589415!3d43.31417627112019!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12c9c0f3f2295ed9%3A0xe8332bddf8f8ffdb!2s155%20Rue%20Peyssonnel%2C%2013002%20Marseille!5e0!3m2!1sen!2sfr!4v1772199706842!5m2!1sen!2sfr",
  };

  const mapSrc = MAP_EMBEDS[lang] || MAP_EMBEDS.fr;

  return (
    <div className="bg-black text-white min-h-screen px-6 py-16">
      {/* CONTAINER — même largeur que le Footer */}
      <div className="w-full max-w-[1000px] mx-auto flex flex-col items-center">
        {/* HERO + PROGRAMME */}
        <section className="w-full mb-20">
          <div className="flex items-center gap-3 text-pink-500 mb-4">
            <CalendarDays size={18} />
            <span className="uppercase tracking-widest text-sm">{t("contact.info")}</span>
          </div>

          <h1 className="text-5xl font-bold">{formattedDate}</h1>
          <h2 className="text-3xl text-pink-500 font-semibold mb-8">MARSEILLE</h2>

{/* PROGRAMME — à activer si tu veux afficher le programme du jour */}
          {/* <div className="flex items-center gap-3 mb-6 mt-10">
            <Clock className="text-pink-500" />
            <h3 className="text-xl font-semibold">{t("contact.program")}</h3>
          </div>

          <div className="space-y-4">
            {todaySchedule.map((item, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-md rounded-2xl p-5 flex items-center gap-6 border border-white/10"
              >
                <div className={`text-2xl font-bold w-20 ${tagColors[item.tag] || "text-pink-400"}`}>
                  {item.time}
                </div>

                <div>
                  <div className={`text-xs tracking-widest ${tagColors[item.tag] || "text-pink-400"}`}>
                    {item.tag}
                  </div>
                  <div className="text-lg">{item.title}</div>
                </div>
              </div>
            ))}
          </div> */}
        </section>

        {/* ACCÈS */}
        <div className="flex flex-col items-center mb-12 w-full">
          <div className="flex items-center gap-3">
            <Navigation className="text-blue-400" size={26} />
            <h1 className="text-4xl font-bold">{t("contact.access")}</h1>
          </div>
          <div className="w-24 h-0.5 bg-blue-400 mt-2 rounded-full"></div>
        </div>

        {/* INFOS */}
        <div className="w-full space-y-10 mb-16">
          {/* Transport */}
          <div className="flex items-start gap-5">
            <div className="bg-blue-600/20 p-4 rounded-2xl">
              <Train className="text-blue-400" size={30} />
            </div>
            <div>
              <h3 className="text-xl font-semibold">{t("contact.transport")}</h3>
              <p className="text-gray-400">{t("contact.tram")}</p>
              <p className="text-gray-400">{t("contact.metro")}</p>
            </div>
          </div>

          {/* Voiture */}
          <div className="flex items-start gap-5">
            <div className="bg-green-600/20 p-4 rounded-2xl">
              <Car className="text-green-400" size={30} />
            </div>
            <div>
              <h3 className="text-xl font-semibold">{t("contact.cars")}</h3>
              <p className="text-gray-400">{t("contact.highway")}</p>
              <p className="text-gray-400">{t("contact.parking")}</p>
            </div>
          </div>

          {/* Adresse */}
          <div className="flex items-start gap-5">
            <div className="bg-purple-600/20 p-4 rounded-2xl">
              <MapPin className="text-purple-400" size={30} />
            </div>
            <div>
              <h3 className="text-xl font-semibold">{t("contact.address")}</h3>
              <p className="text-gray-400">155 Rue Peyssonnel, 13002 Marseille</p>
            </div>
          </div>
        </div>

        {/* MAP — language depends on the site language */}
        <div className="w-full h-[350px] rounded-3xl overflow-hidden shadow-2xl mb-24">
          <iframe
            key={lang} // force reload on language switch
            title="Google Map Marseille"
            src={mapSrc}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>

        {/* FORMULAIRE */}
        <div className="w-full bg-white/5 backdrop-blur-lg p-10 rounded-3xl shadow-2xl border border-white/10">
          <h2 className="text-3xl font-bold text-center mb-8">{t("contact.form_title")}</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block mb-2 text-sm text-gray-300">{t("contact.form_email")}</label>
              <input
                type="email"
                name="email"
                required
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-black/40 border border-gray-600 text-white"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm text-gray-300">{t("contact.form_name")}</label>
              <input
                type="text"
                name="name"
                required
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-black/40 border border-gray-600 text-white"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm text-gray-300">{t("contact.form_subject")}</label>
              <input
                type="text"
                name="subject"
                required
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-black/40 border border-gray-600 text-white"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm text-gray-300">{t("contact.form_message")}</label>
              <textarea
                name="message"
                rows="5"
                required
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-black/40 border border-gray-600 text-white"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 py-3 rounded-xl font-semibold text-white hover:opacity-90 transition"
            >
              {t("contact.publish")}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
