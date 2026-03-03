import User from "./User.js";
import Film from "./Video.js";
import Award from "./Award.js";  
import FilmsJury from "./FilmsJury.js";


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

 
  Award.belongsTo(Film, { foreignKey: "film_id" });  
  Film.hasMany(Award, { foreignKey: "film_id" });
}
