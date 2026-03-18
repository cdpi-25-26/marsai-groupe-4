import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { getEvents } from "../../api/events";
import { createReservation } from "../../api/reservations";
import ClockIcon from "../../assets/reservation_svg/Clock.svg";
import LocationIcon from "../../assets/reservation_svg/Location.svg";
import UserIcon from "../../assets/reservation_svg/User.svg";

export default function EventReservation() {
  const { t } = useTranslation();

  const [selectedEventId, setSelectedEventId] = useState("");
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    profession: "",
  });
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const { data: eventsData } = useQuery({
    queryKey: ["events"],
    queryFn: () => getEvents().then((res) => res.data),
  });

  const events = eventsData || [];
  const openEvents = events.filter((e) => e.status === "OPEN");
  const selectedEvent = events.find((e) => String(e.id) === String(selectedEventId));

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedEventId) {
      setError(t("reservation.select_event") || "Please select an event");
      return;
    }
    setSending(true);
    setError("");
    try {
      await createReservation({ ...form, event_id: Number(selectedEventId) });
      setSuccess(true);
      setForm({ first_name: "", last_name: "", email: "", profession: "" });
    } catch (err) {
      setError(err?.response?.data?.error || "Failed to create reservation");
    } finally {
      setSending(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center min-h-screen px-4 py-20 bg-black text-white">
        <div className="max-w-[800px] w-full p-8 rounded-xl border border-green-500/30 bg-green-500/10 text-center">
          <h2 className="text-2xl font-bold mb-4 text-green-400">
            {t("reservation.success_title") || "Reservation Confirmed!"}
          </h2>
          <p className="text-gray-300 mb-6">
            {t("reservation.success_text") || "Your reservation for"}{" "}
            <strong>{selectedEvent?.title || "the event"}</strong>{" "}
            {t("reservation.success_confirmed") || "has been confirmed."}
          </p>
          <button
            onClick={() => { setSuccess(false); setSelectedEventId(""); }}
            className="px-6 py-3 rounded-xl bg-gradient-to-b from-[#51A2FF]/20 to-[#9810FA]/60 text-white font-bold hover:opacity-90 transition"
          >
            {t("reservation.another") || "Make Another Reservation"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen px-4 sm:px-6 lg:px-10 py-10 bg-black font-sans">

      {/* Event selector */}
      <div className="flex flex-col w-full max-w-[800px] p-4 sm:p-5 mb-5 rounded-xl border border-white shadow-inner bg-gradient-to-b from-[#51A2FF]/20 to-[#9810FA]/20 text-gray-300 gap-4">
        <h6 className="text-[10px] sm:text-xs uppercase text-gray-400 tracking-wider">
          {t("reservation.event_selected")}
        </h6>

        <select
          value={selectedEventId}
          onChange={(e) => setSelectedEventId(e.target.value)}
          className="bg-[#3a3a3a] text-white rounded-xl border border-white p-3 text-sm w-full"
        >
          <option value="">-- {t("reservation.select_event") || "Select an event"} --</option>
          {openEvents.map((ev) => (
            <option key={ev.id} value={ev.id}>
              {ev.title} — {ev.event_date} ({ev.location})
            </option>
          ))}
        </select>

        {selectedEvent && (
          <div className="space-y-3 mt-2">
            <div className="flex items-center gap-4">
              <img src={LocationIcon} alt="Location" className="w-6 h-6 object-contain" />
              <span className="text-sm">{selectedEvent.location}</span>
            </div>
            <div className="flex items-center gap-4">
              <img src={ClockIcon} alt="Time" className="w-6 h-6 object-contain" />
              <span className="text-sm">
                {selectedEvent.time_start} — {selectedEvent.time_end} | {selectedEvent.event_date}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <img src={UserIcon} alt="Capacity" className="w-6 h-6 object-contain" />
              <span className="text-sm">
                {selectedEvent.enrolled}/{selectedEvent.capacity} enrolled
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-wrap gap-5 w-full max-w-[800px] p-5 mt-8 mb-5 rounded-xl border border-white bg-[#262424]">
        <div className="flex flex-row-reverse items-center mt-4 w-11/12 mx-auto">
          <h4 className="text-sm text-gray-400">{t("reservation.reservation_title")}</h4>
          <div className="flex-1 border-t border-gray-400 ml-4 self-center"></div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <div className="flex flex-col flex-1">
            <label className="text-gray-400 text-xs mb-1">{t("reservation.first_name")}</label>
            <input type="text" name="first_name" value={form.first_name} onChange={handleChange} required placeholder={t("reservation.first_name")} className="bg-[#3a3a3a] text-white rounded-xl border border-white p-2 text-sm" />
          </div>
          <div className="flex flex-col flex-1">
            <label className="text-gray-400 text-xs mb-1">{t("reservation.last_name")}</label>
            <input type="text" name="last_name" value={form.last_name} onChange={handleChange} required placeholder={t("reservation.last_name")} className="bg-[#3a3a3a] text-white rounded-xl border border-white p-2 text-sm" />
          </div>
        </div>

        <div className="flex flex-col w-full">
          <label className="text-gray-400 text-xs mb-1">{t("reservation.email")}</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} required placeholder={t("reservation.email")} className="bg-[#3a3a3a] text-white rounded-xl border border-white p-2 text-sm" />
        </div>

        <div className="flex flex-col w-full">
          <label className="text-gray-400 text-xs mb-1">{t("reservation.speciality")}</label>
          <input type="text" name="profession" value={form.profession} onChange={handleChange} placeholder={t("reservation.speciality")} className="bg-[#3a3a3a] text-white rounded-xl border border-white p-2 text-sm" />
        </div>

        {error && (
          <div className="w-full p-3 rounded-xl bg-red-500/20 text-red-400 text-center text-sm">
            {error}
          </div>
        )}

        <div className="flex items-start gap-2 w-full text-xs mb-2">
          <input type="checkbox" required className="w-4 h-4 mt-0.5" />
          <span className="text-[#602be6]">{t("reservation.certificat_text")}</span>
        </div>

        <button
          type="submit"
          disabled={sending}
          className="block mx-auto w-full sm:w-[150px] text-white text-xs font-bold rounded-xl p-3
                     bg-gradient-to-b from-[#51A2FF]/20 to-[#9810FA]/60
                     transition transform hover:scale-105 hover:opacity-90 hover:shadow-lg active:scale-95
                     disabled:opacity-50"
        >
          {sending ? "Sending..." : t("reservation.publish")}
        </button>
      </form>

      {/* Certificate section */}
      <div className="w-full max-w-[800px] p-5 mb-5 rounded-xl border border-white shadow-inner bg-gradient-to-b from-[#51A2FF]/20 to-[#9810FA]/20 text-gray-300">
        <h4 className="text-lg mb-3">{t("reservation.certificat_title")}</h4>
        <p className="text-xs">{t("reservation.certificat_text")}</p>
      </div>
    </div>
  );
}
