import React, { useEffect, useState } from "react";
import { MicVocal, Film, Wrench } from "lucide-react";
import { Calendar } from "lucide-react";
import { Clock } from "lucide-react";
import { EllipsisVertical } from "lucide-react";
import { MapPin } from "lucide-react";
import { Pen } from "lucide-react";
import { Link } from "react-router";

function CardEvennements({ data }) {

  const typeIcons = {
    conference: <MicVocal size={16} style={{ color: "var(--evennements-accent)" }} />,
    masterclass: <Film size={16} style={{ color: "var(--evennements-accent)" }} />,
    workshop: <Wrench size={16} style={{ color: "var(--evennements-accent)" }} />
  };

  const [maxLength, setMaxLength] = useState(40);

  useEffect(() => {
    const updateMaxLength = () => {
      const width = window.innerWidth;
      if (width >= 1700) setMaxLength(40);
      else if (width >= 1200) setMaxLength(25);
      else if (width >= 868) setMaxLength(15);
      else setMaxLength(20);
    };

    updateMaxLength();
    window.addEventListener("resize", updateMaxLength);
    return () => window.removeEventListener("resize", updateMaxLength);
  }, []);

  const cardTitle =
    data.title.length > maxLength
      ? data.title.slice(0, maxLength) + "..."
      : data.title;

  const percentage = Math.round((data.enrolled / data.capacity) * 100);

  return (
    <div
      className="p-[30px] w-full border rounded-[32px]"
      style={{
        background: "var(--evennements-card-bg)",
        borderColor: "var(--evennements-card-border)",
        color: "var(--evennements-text)",
      }}
    >
      <div className="flex justify-between items-center mb-[26px]">
        <h2
          className="text-[10px] uppercase tracking-[1px] w-[90px] h-[30px] flex items-center justify-center rounded-[14px] border"
          style={{
            background: "var(--evennements-accent-bg)",
            borderColor: "var(--evennements-accent-border)",
            color: "var(--evennements-accent)",
          }}
        >
          {data.status}
        </h2>

        <div
          className="w-[35px] h-[35px] flex items-center justify-center border rounded-[14px]"
          style={{
            background: "var(--evennements-card-bg)",
            borderColor: "var(--evennements-card-border)",
          }}
        >
          <EllipsisVertical size={16} />
        </div>
      </div>

      <div className="flex items-center gap-[8px] mb-[8px]">
        {typeIcons[data.type] || typeIcons.conference}
        <h2
          className="text-[10px] tracking-[3px] uppercase font-bold"
          style={{ color: "var(--evennements-accent)" }}
        >
          {data.type}
        </h2>
      </div>

      <div className="h-[70px] flex items-center">
        <h2 className="text-[24px] w-full font-bold uppercase break-words">
          {cardTitle}
        </h2>
      </div>

      <div className="flex flex-col gap-[12px] mt-[18px]" style={{ color: "var(--evennements-text-muted)" }}>
        <div className="flex items-center gap-[12px]">
          <Calendar size={16} />
          <h2 className="text-[14px]">
            {new Date(data.event_date).toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "long",
            })}
          </h2>
        </div>

        <div className="flex items-center gap-[12px]">
          <Clock size={16} />
          <h2 className="text-[14px]">
            {data.time_start?.slice(0, 5)} - {data.time_end?.slice(0, 5)}
          </h2>
        </div>

        <div className="flex items-center gap-[12px]">
          <MapPin size={16} />
          <h2 className="text-[14px]">{data.location}</h2>
        </div>
      </div>

      <div className="mt-[30px] mb-[32px] flex gap-[8px] flex-col">
        <div className="flex justify-between text-[10px] font-bold uppercase">
          <h2 style={{ color: "var(--evennements-text-soft)" }}>
            remplissage
          </h2>
          <h2 style={{ color: "var(--evennements-progress-from)" }}>
            {data.enrolled}/{data.capacity}
          </h2>
        </div>

        <div className="flex gap-[8px]">
          <Link to={`/reservation/${data.id}`} className="w-full">
            <button className="w-full tracking-[1px] bg-gradient-to-r from-[#E60076] to-[#FF637E] rounded-[16px] h-[42px] flex items-center justify-center text-[10px] font-bold uppercase">
              Réserver
            </button>
          </Link>
          <button
            className="w-full rounded-[16px] h-[42px] text-[10px] font-bold uppercase border"
            style={{
              background: "var(--evennements-card-bg)",
              borderColor: "var(--evennements-card-border)",
            }}
          >
            Details
          </button>
          
        </div>
      </div>
    </div>
  );
}

export default CardEvennements;
