import React, { useEffect, useState } from "react";
import { MicVocal, Film, Wrench } from "lucide-react";
import { Calendar } from "lucide-react";
import { Clock } from "lucide-react";
import { EllipsisVertical } from "lucide-react";
import { MapPin } from "lucide-react";
import { Pen } from "lucide-react";

function CardEvennements({ data }) {

const typeIcons = {
  conference: <MicVocal size={16} className="text-[#51A2FF]" />,
  masterclass: <Film size={16} className="text-[#51A2FF]" />,
  workshop: <Wrench size={16} className="text-[#51A2FF]" />
};

const [maxLength, setMaxLength] = useState(40);

useEffect(() => {
  const updateMaxLength = () => {
    const width = window.innerWidth;
    if (width >= 1700) {
      setMaxLength(40);
    } else if (width >= 1200) {
      setMaxLength(25);
    } else if (width >= 868) {
      setMaxLength(15);
    } else {
      setMaxLength(20);
    }
  };

  updateMaxLength();
  window.addEventListener('resize', updateMaxLength);
  return () => window.removeEventListener('resize', updateMaxLength);
}, []);




  const cardTitle = data.title.length > maxLength 
    ? data.title.slice(0, maxLength) + '...' 
    : data.title;



    
  const percentage = Math.round((data.enrolled / data.capacity) * 100);

  
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
          
          {typeIcons[data.type] || <MicVocal size={12} className="text-[#51A2FF]" />}

          <h2 className="text-[10px] text-[#51A2FF] tracking-[3px] uppercase font-bold ">{data.type}</h2>
        </div>

      <div className="h-[70px] flex items-center ">
  <h2 className="text-[24px] w-full font-bold uppercase tracking-[-0.6] break-words">
    {cardTitle}
  </h2>
</div>
        

        <div className="flex flex-col gap-[12px] mt-[18px]">
          <div className="flex items-center gap-[12px]">
            <Calendar size={16} className="mt-[-3px] text-white/50" />
            <h2 className="text-[14px] text-white/50">

            {new Date(data.event_date).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'long'
            })}
            
            </h2>
          </div>

          <div className="flex items-center gap-[12px]">
            <Clock size={16} className="mt-[-2px] text-white/50" />
            <h2 className="text-[14px] text-white/50">{data.time_start?.slice(0,5)} - {data.time_end?.slice(0,5)}

</h2>
          </div>

          <div className="flex items-center gap-[12px]">
            <MapPin size={16} className="mt-[-3px] text-white/50" />
           
              <h2 className="text-[14px] text-white/50">{data.location}</h2>
           
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
            Details
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