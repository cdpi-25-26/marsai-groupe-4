import React from 'react'
import CardEvennements from '../components/CardEvennements.jsx'
import { Search } from "lucide-react";
import { ChevronLeft } from "lucide-react";
import { Plus } from "lucide-react";

const DataEvennements = {
  id: 1,
  type: "MASTERCLASS",
  title: "MASTERCLASS SORA : L'AVENIR DU CINÉMA",
  date: "2026-06-20",
  time: "10:30 — 12:30",
  location: "Auditorium J4",
  capacity: 200,
  enrolled: 185,
  status: "UPCOMING"
};


function Evennements() {
  return (
    <section className='bg-black text-white'>

       


<div className='flex items-end p-[24px]'>

 <div className='w-full  '>
                <h2 className='bg-[linear-gradient(to_top,rgba(255,255,250,0.5)_35%,rgba(255,255,255,0.9)_70%)] font-bold tracking-[-2.4px] text-[48px] bg-clip-text text-transparent uppercase'>Gestion des Événements</h2>

        <h2 className='text-white/40 text-[14px] uppercase tracking-[1.4px] '>Contrôle du protocole marsAI 2026</h2>
            </div>

            <button className=' h-[48px] rounded-[16px] bg-white text-black tracking-[1.2px] px-[13px] text-[12px] uppercase font-bold whitespace-nowrap flex items-center gap-[8px]'>
                <Plus size={20}/>
                creer un evenement
            </button>
</div>

           
        




        <div className='w-full h-[170px] px-[24px]'>

        </div>

        <div className='flex gap-[16px] px-[24px] flex-wrap'>
            
            <div className='flex items-center bg-white/2 text-[14px] border border-white/10 rounded-[16px] text-white/40 tracking-[0px] h-[54px] px-[20px]'>
                <Search size={20}  className="text-white/20 mr-[20px]" />
                <input className='w-[200px] placeholder-white/30 outline-none' placeholder='Rechercher par titre ou lieu...' type="search" name="" id="" />
            </div>

            <button className='bg-white/2 text-[10px] border border-white/10 rounded-[16px] text-white/40 font-bold tracking-[2px] h-[54px] px-[20px]'>TOUS</button>

            <button className='bg-white/2 text-[10px] border border-white/10 rounded-[16px] text-white/40 font-bold tracking-[2px] h-[54px] px-[20px]'>SCREENIGN</button>

            <button className='bg-white/2 text-[10px] border border-white/10 rounded-[16px] text-white/40 font-bold tracking-[2px] h-[54px] px-[20px]'>WORKSHOP</button>

            <button className='bg-white/2 text-[10px] border border-white/10 rounded-[16px] text-white/40 font-bold tracking-[2px] h-[54px] px-[20px]'>MASTERCLASS</button>

            <button className='bg-white/2 text-[10px] border border-white/10 rounded-[16px] text-white/40 font-bold tracking-[2px] h-[54px] px-[20px]'>CONCERT</button>

            <button className='bg-white/2 text-[10px] border border-white/10 rounded-[16px] text-white/40 font-bold tracking-[2px] h-[54px] px-[20px]'>PARTY</button>

        </div>




        <div className='bg-black grid grid-cols-3 p-[24px] gap-[32px]'>

            <CardEvennements data={DataEvennements}/>
            <CardEvennements data={DataEvennements}/>
            <CardEvennements data={DataEvennements}/>
            <CardEvennements data={DataEvennements}/>
            <CardEvennements data={DataEvennements}/>
            <CardEvennements data={DataEvennements}/>
        </div>
        

    </section>
  )
}

export default Evennements