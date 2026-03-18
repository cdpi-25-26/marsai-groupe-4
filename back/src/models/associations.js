import User from "./User.js";
import Film from "./Video.js";
import Award from "./Award.js";
import FilmsJury from "./FilmsJury.js";
import Reservation from "./Reservation.js";
import Event from "./Event.js";
import Evaluation from "./Evaluation.js";


export function setupAssociations() {

  Film.belongsTo(User, { foreignKey: "user_id", as: "user" });


  Film.belongsToMany(User, {
    through: FilmsJury,
    foreignKey: "film_id",
    otherKey: "user_id",
    as: "juryMembers",
  });

  User.belongsToMany(Film, {
    through: FilmsJury,
    foreignKey: "user_id",
    otherKey: "film_id",
    as: "assignedFilms",
  });


  FilmsJury.belongsTo(Film, { foreignKey: "film_id", as: "film" });
  FilmsJury.belongsTo(User, { foreignKey: "user_id", as: "jury" });

  // Award -> Film
  Award.belongsTo(Film, { foreignKey: "film_id", as: "film" });
  Film.hasMany(Award, { foreignKey: "film_id", as: "awards" });

  // Evaluation -> Film
  Film.hasMany(Evaluation, { foreignKey: "film_id", as: "evaluations" });
  Evaluation.belongsTo(Film, { foreignKey: "film_id", as: "film" });

  // Reservation -> Event
  Reservation.belongsTo(Event, { foreignKey: "event_id", as: "event" });
  Event.hasMany(Reservation, { foreignKey: "event_id", as: "reservations" });
}
