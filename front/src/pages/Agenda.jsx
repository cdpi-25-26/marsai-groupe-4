import React from 'react'

function Agenda() {
  return (
    <section className='bg-black font-bold p-[40px]'>

        <div className='h-[0px]'>
            <div className='relative filter bottom-[200px] bg-[rgba(246,51,154,0.2)] rounded-full w-1/1 aspect-square blur-[150px] '></div>
        </div>


        <div className='w-[60%] mx-auto h-[2000px] text-[20px] text-white'>
            <div className='flex items-center'>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <rect x="3" y="4" width="18" height="18" rx="2"></rect>
  <line x1="16" y1="2" x2="16" y2="6"></line>
  <line x1="8" y1="2" x2="8" y2="6"></line>
  <line x1="3" y1="10" x2="21" y2="10"></line>
</svg>
<span className='tracking-[4.2px] text-[14px] text-[#F6339A]'>INFOS PRATIQUES</span>
            </div>
            

            <h2 className='text-[48px] tracking-[-1.2px] font-bold'>13 JUIN 2026</h2>
            <h2 className='text-[#F6339A] text-[36px] mb-[16px]'>MARSEILLE</h2>

            <div className=' flex flex-col gap-[16px] border  rounded-[32px] border-white/10 p-[32px] bg-white/5 '> 
                <div className='flex items-center gap-[16px]'>
                    <svg className='bg-[#51A2FF] rounded-[16px]' width="50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200 " xml:space="preserve"><path fill="#FFFFFF" d="M100.232 149.198c-2.8 0-5.4-1.8-7.2-5.2-22.2-41-22.4-41.4-22.4-41.6-3.2-5.1-4.9-11.3-4.9-17.6 0-19.1 15.5-34.6 34.6-34.6s34.6 15.5 34.6 34.6c0 6.5-1.8 12.8-5.2 18.2 0 0-1.2 2.4-22.2 41-1.9 3.4-4.4 5.2-7.3 5.2zm.1-95c-16.9 0-30.6 13.7-30.6 30.6 0 5.6 1.5 11.1 4.5 15.9.6 1.3 16.4 30.4 22.4 41.5 2.1 3.9 5.2 3.9 7.4 0 7.5-13.8 21.7-40.1 22.2-41 3.1-5 4.7-10.6 4.7-16.3-.1-17-13.8-30.7-30.6-30.7z"/><path fill="#282828" d="M100.332 105.598c-10.6 0-19.1-8.6-19.1-19.1s8.5-19.2 19.1-19.2c10.6 0 19.1 8.6 19.1 19.1s-8.6 19.2-19.1 19.2zm0-34.3c-8.3 0-15.1 6.8-15.1 15.1s6.8 15.1 15.1 15.1 15.1-6.8 15.1-15.1-6.8-15.1-15.1-15.1z"/></svg>
                <span className='text-[24px]'>LA PLATEFORME</span>
                </div>

                
                <h2 className='font-normal text-white/80'>L'épicentre de la révolution créative marseillaise. 4000m² dédiés à l'image et au futur.</h2>
            </div>

            <div className='border-b-2 border-whtie w-fit'>

                    <div className='flex'>
                        <svg fill="white" width="50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M528 320C528 434.9 434.9 528 320 528C205.1 528 112 434.9 112 320C112 205.1 205.1 112 320 112C434.9 112 528 205.1 528 320zM64 320C64 461.4 178.6 576 320 576C461.4 576 576 461.4 576 320C576 178.6 461.4 64 320 64C178.6 64 64 178.6 64 320zM296 184L296 320C296 328 300 335.5 306.7 340L402.7 404C413.7 411.4 428.6 408.4 436 397.3C443.4 386.2 440.4 371.4 429.3 364L344 307.2L344 184C344 170.7 333.3 160 320 160C306.7 160 296 170.7 296 184z"/></svg>
                        <span className='uppercase'>Programme des Conférences</span>
                    </div>
           
            
            </div>

            
            <div className='flex w-full gap-[32px] rounded-[24px] border border-white/10 p-[24px] bg-white/5 mb-[16px]'>
                <span className='flex items-center  text-[#00BC7D] text-[24px] font-bold'>09:30</span>
                <span>
                    <div className='text-[10px] tracking-[2px] uppercase font-bold text-[#00BC7D] font-bold'>Social</div>
                    <div className='text-[18px] font-bold text-white/90'>Accueil & Cafe Networking</div>
                </span>
            </div>

            <div className='flex w-full gap-[32px] rounded-[24px] border border-white/10 p-[24px] bg-white/5 mb-[16px]'>
                <span className='flex items-center  text-[#C27AFF] text-[24px] font-bold'>10:30</span>
                <span>
                    <div className='text-[10px] tracking-[2px] uppercase font-bold text-[#C27AFF] font-bold'>keynote</div>
                    <div className='text-[18px] font-bold text-white/90'>Conférence d'ouverture : L'IA au service du Cinéma</div>
                </span>
            </div>

            <div className='flex w-full gap-[32px] rounded-[24px] border border-white/10 p-[24px] bg-white/5 mb-[16px]'>
                <span className='flex items-center  text-[#A8A8A8] text-[24px] font-bold'>14:30</span>
                <span>
                    <div className='text-[10px] tracking-[2px] uppercase font-bold text-[#A8A8A8] font-bold'>breake</div>
                    <div className='text-[18px] font-bold text-white/90'>Déjeuner Libre</div>
                </span>
            </div>

            <div className='flex w-full gap-[32px] rounded-[24px] border border-white/10 p-[24px] bg-white/5 mb-[16px]'>
                <span className='flex items-center  text-[#FB64B6] text-[24px] font-bold'>13:00</span>
                <span>
                    <div className='text-[10px] tracking-[2px] uppercase font-bold text-[#FB64B6] font-bold'>cinema</div>
                    <div className='text-[18px] font-bold text-white/90'>Projection Sélection Officielle</div>
                </span>
            </div>

            <div className='flex w-full gap-[32px] rounded-[24px] border border-white/10 p-[24px] bg-white/5 mb-[16px]'>
                <span className='flex items-center  text-[#ffffff] text-[24px] font-bold'>16:30</span>
                <span>
                    <div className='text-[10px] tracking-[2px] uppercase font-bold text-[#ffffff] font-bold'>cinema</div>
                    <div className='text-[18px] font-bold text-white/90'>Table Ronde : Futurs Souhaitables</div>
                </span>
            </div>


            <div className='flex w-full gap-[32px] rounded-[24px] border border-white/10 p-[24px] bg-white/5 mb-[16px]'>
                <span className='flex items-center  text-[#FDC700] text-[24px] font-bold'>19:00</span>
                <span>
                    <div className='text-[10px] tracking-[2px] uppercase font-bold text-[#FDC700] font-bold'>awards</div>
                    <div className='text-[18px] font-bold text-white/90'>Grand Prix & Cérémonie de Clôture</div>
                </span>
            </div>

            <div className='flex w-full gap-[32px] rounded-[24px] border border-white/10 p-[24px] bg-white/5 mb-[16px]'>
                <span className='flex items-center  text-[#51A2FF] text-[24px] font-bold'>19:00</span>
                <span>
                    <div className='text-[10px] tracking-[2px] uppercase font-bold text-[#51A2FF] font-bold'>party</div>
                    <div className='text-[18px] font-bold text-white/90'>MARS.A.I Night - DJ Set Immersif</div>
                </span>
            </div>
            

            

            
            


            
            

        </div>

        <div>
            <div className='bg'></div>
        </div>

    </section>
    
  )
}

export default Agenda