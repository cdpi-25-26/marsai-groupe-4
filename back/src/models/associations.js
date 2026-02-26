import User from "./User.js";
import Film from "./Video.js";
import FilmsJury from "./FilmsJury.js";

// Define all associations here after all models are loaded
export function setupAssociations() {
  // Film -> User (belongsTo)
  Film.belongsTo(User, { foreignKey: "user_id", as: "user" });

  // Film <-> User (many-to-many through FilmsJury)
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

  // FilmsJury associations
  FilmsJury.belongsTo(Film, { foreignKey: "film_id", as: "film" });
  FilmsJury.belongsTo(User, { foreignKey: "user_id", as: "jury" });
}
