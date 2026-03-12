import React from "react";
import CardEvennements from "../../components/CardEvennements.jsx";
import { Search } from "lucide-react";
import { ChevronLeft } from "lucide-react";
import { Plus } from "lucide-react";
import { useParams } from "react-router";
import { useEffect } from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

function Evennements() {
  const { t } = useTranslation();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3000/events")
      .then((res) => {
        if (!res.ok) throw new Error("loading error");
        return res.json();
      })
      .then((data) => {
        setEvents(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading)
    return <div className="p-6" style={{ color: "var(--evennements-text)" }}>loading...</div>;

  if (error)
    return <div className="p-6" style={{ color: "var(--evennements-text)" }}>error: {error}</div>;

  return (
    <section
      className="py-[154px]"
      style={{
        background: "var(--evennements-bg)",
        color: "var(--evennements-text)",
      }}
    >
      <div className="flex flex-col items-start justify-between p-6 gap-4">
        <div className="w-full">
          <h2 className="font-bold tracking-[-2.4px] text-4xl sm:text-5xl uppercase">
            {t("event.management")}
          </h2>

          <h2
            className="text-sm sm:text-[14px] uppercase tracking-[1.4px]"
            style={{ color: "var(--evennements-text-soft)" }}
          >
            {t("event.control_event")}
          </h2>
        </div>
      </div>

      <div className="flex gap-[16px] px-[24px] flex-wrap">
        <div
          className="flex items-center text-[14px] border rounded-[16px] h-[54px] px-[20px]"
          style={{
            background: "var(--evennements-input-bg)",
            borderColor: "var(--evennements-input-border)",
            color: "var(--evennements-text-muted)",
          }}
        >
          <Search size={20} className="mr-[20px]" />
          <input
            className="w-[200px] outline-none bg-transparent"
            placeholder={t("event.search_placeholder")}
            type="search"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 p-[24px] gap-[24px]">
        {events.map((event) => (
          <CardEvennements key={event.id} data={event} />
        ))}
      </div>
    </section>
  );
}

export default Evennements;
