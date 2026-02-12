import ClockIcon from "../../assets/reservation_svg/Clock.svg";
import LocationIcon from "../../assets/reservation_svg/Location.svg";
import UserIcon from "../../assets/reservation_svg/User.svg";



   
 export default function EventReservation() {
      const eventDetails = [
    { title: "Lieu", value: "STUDIO 1 - LA PLATEFORME_", icon: LocationIcon },
    { title: "Horaires", value: "14H30 — 13 JUIN", icon: ClockIcon },
    { title: "Coach expert", value: "THOMAS AUBERT", icon: UserIcon },
  ];

  return (
   
      <div className="flex flex-col items-center min-h-screen px-4 sm:px-6 lg:px-10 py-10 bg-black font-sans">


      {/* Bloc événement */}
     


<div className="flex flex-col w-full max-w-[800px] p-4 sm:p-5 mb-5 rounded-xl border border-white shadow-inner bg-gradient-to-b from-[#51A2FF]/20 to-[#9810FA]/20 text-gray-300 gap-4">
<h6 className="text-[10px] sm:text-xs uppercase text-gray-400 tracking-wider">

 Evénements selectionné :
</h6>
<h5 className="text-base sm:text-lg uppercase text-gray-200 tracking-wider">

 GENERATION VIDEO : LES BASES
</h5>
  {eventDetails.map((detail, index) => (
    
    <div key={index} className="flex items-center gap-4">
      
     <img src={detail.icon} alt={detail.title} className="w-6 h-6 sm:w-7 sm:h-7 object-contain"/>
      
      <div className="flex flex-col">
        <h3 className="text-sm sm:text-base">{detail.value}</h3>
      </div>
     
      
    </div>
  ))}
</div>



     {/* Formulaire */}
      <form className="flex flex-wrap gap-5 w-full max-w-[800px] p-5 mt-8 mb-5 rounded-xl border border-white bg-[#262424]">

    <div className="flex flex-row-reverse items-center mt-4 w-11/12 mx-auto">
  <h4 className="text-sm text-gray-400">Reserver ma place</h4>
  <div className="flex-1 border-t border-gray-400 ml-4 self-center">

  </div>


</div>

        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <div className="flex flex-col flex-1">
            <label className="text-gray-400 text-xs mb-1">Prénom</label>
            <input type="text" placeholder="Prénom" className="bg-[#3a3a3a] text-white rounded-xl border border-white p-2 text-sm"/>
          </div>
          <div className="flex flex-col flex-1">
            <label className="text-gray-400 text-xs mb-1">Nom</label>
            <input type="text" placeholder="Nom" className="bg-[#3a3a3a] text-white rounded-xl border border-white p-2 text-sm"/>
          </div>
        </div>

     
        <div className="flex flex-col w-full">
          <label className="text-gray-400 text-xs mb-1">Adresse e-mail</label>
          <input type="email" placeholder="email@example.com" className="bg-[#3a3a3a] text-white rounded-xl border border-white p-2 text-sm"/>
        </div>

      
        <div className="flex flex-col w-full">
          <label className="text-gray-400 text-xs mb-1">Profession / spécialité</label>
          <input type="text" placeholder="Profession" className="bg-[#3a3a3a] text-white rounded-xl border border-white p-2 text-sm"/>
        </div>

    
        <div className="flex items-start gap-2 w-full text-xs mb-5">
          <input type="checkbox" className="w-4 h-4"/>
          <span className="text-[#602be6]">
            J'accepte les conditions générales et le règlement de protection des données.
          </span>
        </div>

        <button
          type="submit"
          className="block mx-auto w-full sm:w-[150px]
 text-white text-xs font-bold rounded-xl p-3
                     bg-gradient-to-b from-[#51A2FF]/20 to-[#9810FA]/60
                     transition transform hover:scale-105 hover:opacity-90 hover:shadow-lg active:scale-95"
        >
          ENVOYER
        </button>
      </form>

     
      <div className="w-full max-w-[800px] p-5 mb-5 rounded-xl border border-white shadow-inner bg-gradient-to-b from-[#51A2FF]/20 to-[#9810FA]/20 text-gray-300">
        <h4 className="text-lg mb-3">CERTIFICAT DE PROPRIÉTÉ</h4>
        <p className="text-xs">
          En soumettant ce dossier, vous certifiez sur l'honneur être l'auteur
          original de l'œuvre et détenir l'intégralité des droits de diffusion.
          Vous acceptez que MARS.AI utilise ces éléments pour la promotion du festival.
        </p>
      </div>
    </div>

  );
}