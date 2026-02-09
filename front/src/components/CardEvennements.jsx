import React from "react";
import { MicVocal } from "lucide-react";
import { Calendar } from "lucide-react";
import { Clock } from "lucide-react";
import { EllipsisVertical } from "lucide-react";
import { MapPin } from "lucide-react";
import { Pen } from "lucide-react";

function CardEvennements({ data }) {
  const percentage = Math.round((data.enrolled / data.capacity) * 100);

  console.log(data);
  return (
    <div className="p-[30px] w-full bg-white/2  text-white border border-white/5 rounded-[32px]">
      <div className="flex h-[0px] w-full justify-end">
        <img
          src="/src/assets/CardEvennements_svg/Icon.svg"
          alt=""
          style={{ zIndex: 0 }}
          className="relative h-[150px] w-[150px]"
        />
      </div>

      <div className="relative" style={{ zIndex: 1 }}>
        <div className="flex justify-between items-center mb-[26px]">
          <h2 className="bg-[rgba(43,127,255,0.1)] text-[10px] text-[#51A2FF] uppercase tracking-[1px] border border-[rgba(43,127,255,0.2)] w-[90px] h-[30px] flex items-center justify-center rounded-[14px]">
            {data.status}
          </h2>

          <div className="w-[35px] h-[35px] flex items-center justify-center border border-white/10 bg-white/5 rounded-[14px]">
            <EllipsisVertical size={16} />
          </div>
          
        </div>

        <div className="flex items-center gap-[8px] mb-[8px]">
          <MicVocal size={12} color="blue" />

          <h2 className="text-[10px] font-bold">{data.type}</h2>
        </div>

        <h2 className="text-[24px] font-bold tracking-[-0.6] mb-[20px]">
          {data.title}
        </h2>

        <div className="flex flex-col gap-[12px]">
          <div className="flex items-center gap-[12px]">
            <Calendar size={16} className="mt-[-3px] text-white/50" />
            <h2 className="text-[14px] text-white/50">20 juin</h2>
          </div>

          <div className="flex items-center gap-[12px]">
            <Clock size={16} className="mt-[-2px] text-white/50" />
            <h2 className="text-[14px] text-white/50">{data.time}</h2>
          </div>

          <div className="flex items-center gap-[12px]">
            <MapPin size={16} className="mt-[-3px] text-white/50" />
            <h2>
              <h2 className="text-[14px] text-white/50">{data.location}</h2>
            </h2>
          </div>
        </div>

        <div className="mt-[30px] mb-[32px]  flex gap-[8px] flex-col">
          <div className="flex justify-between">
            <h2 className="text-[10px] tracking-[1px] font-bold uppercase text-white/40">
              remplissage
            </h2>
            <div className="flex tracking-[1px]">
              <h2 className="text-[10px] font-bold text-[rgba(246,51,154,1)]">
                {data.enrolled}
              </h2>
              <h2 className="text-[10px] font-bold text-[rgba(246,51,154,1)]">
                /
              </h2>
              <h2 className="text-[10px] font-bold text-[rgba(246,51,154,1)]">
                {data.capacity}
              </h2>
            </div>
          </div>

          <div className="bg-white/5 border border-white/5 h-[6px] w-full rounded-[16px] overflow-hidden">
            <div
              style={{ width: `${percentage}%` }}
              className="bg-gradient-to-r from-[#E60076] to-[#FF637E] h-[6px]"
            ></div>
          </div>
        </div>

        <div className="flex gap-[8px]">
          <button className="w-full tracking-[1px] bg-white/5 border border-white/10 rounded-[16px] h-[42px] flex items-center justify-center text-[10px] font-bold uppercase">
            Détails
          </button>

          <div className="w-[52px] h-[42px] flex items-center justify-center border border-white/10 bg-white/5 rounded-[16px]">
            <Pen size={16} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CardEvennements;
