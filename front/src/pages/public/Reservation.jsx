import "./Reservation.css"
import ClockIcon from "../../assets/reservation_svg/Clock.svg";
import LocationIcon from "../../assets/reservation_svg/Location.svg";
import UserIcon from "../../assets/reservation_svg/User.svg";



   
      
{/* affichage des event dynamiquement
       export default function EventReservation() {
  return (
   <div className="event-card">
  <img src={clockIcon} alt="horaires" className="icon" />
  <div className="text">
    <h4>Horaires</h4>
    <h3>{event.date}</h3>
  </div>
</div>

<div className="event-card">
  <img src={locationIcon} alt="lieu" className="icon" />
  <div className="text">
    <h4>Lieu</h4>
    <h3>{event.location}</h3>
  </div>
</div>

<div className="event-card">
  <img src={userIcon} alt="coach" className="icon" />
  <div className="text">
    <h4>Coach expert</h4>
    <h3>{event.host}</h3>
  </div>
</div>

*/}
 export default function EventReservation() {
  return (
    <div className="event-reservation">
   
  <div className="event-info">
  
  <img src={LocationIcon} alt="lieu" className="icon" />
  <div className="text">
    <h4>Lieu</h4>
    <h3>STUDIO 1 - LA PLATEFORME_</h3>
  </div>

  <div className="event-info">

<img src={ClockIcon} alt="horaires" className="icon" />
  <div className="text">
    <h4>Horaires</h4>
    <h3>14H30 — 13 JUIN</h3>
  </div>

  <div className="event-info">
  <img src={UserIcon} alt="coach" className="icon" />
  <div className="text">
    <h4>Coach expert</h4>
    <h3>THOMAS AUBERT</h3>
  </div>
  </div>
 </div>




    
      <form className="reservation-form">
       
        <div className="row">
          <div className="input-field">
            <label>Prénom</label>
            <input type="text" placeholder="Prénom" />
          </div>
          <div className="input-field">
            <label>Nom</label>
            <input type="text" placeholder="Nom" />
          </div>
        </div>

        <div className="input-field">
          <label>Adresse e-mail</label>
          <input type="email" placeholder="email@example.com" />
        </div>

        <div className="input-field">
          <label>Profession / spécialité</label>
          <input type="text" placeholder="Profession" />
        </div>

        <div className="checkbox">
          <input type="checkbox" />
          <span>
            J'accepte les conditions générales et le règlement de protection des données.
          </span>
        </div>

        <button type="submit">ENVOYER </button>
      </form>

     
      <div className="certificate">
        <h4>CERTIFICAT DE PROPRIÉTÉ</h4>
        <p>
          En soumettant ce dossier, vous certifiez sur l'honneur être l'auteur
          original de l'œuvre et détenir l'intégralité des droits de diffusion.
          Vous acceptez que MARS.AI utilise ces éléments pour la promotion du festival.
        </p>
      </div>
      
    </div>
    </div>
);
}
