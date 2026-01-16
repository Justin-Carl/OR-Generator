import Details from "../Details.model.js";
import Users from "../Users.model.js";
import Categories from "../Categories.model.js";
import Receipts from "../Receipts.model.js";

export default function Associations() {
  Users.hasMany(Receipts, {
    foreignKey: "user_id",
    targetKey: "id",
    constraints: false,
  });
  Receipts.belongsTo(Users, {
    foreignKey: "user_id",
    targetKey: "id",
    constraints: false,
  });

  Users.hasMany(Categories, {
    foreignKey: "user_id",
    targetKey: "id",
    constraints: false,
  });

  Categories.belongsTo(Users, {
    foreignKey: "user_id",
    targetKey: "id",
    constraints: false,
  });
}
