import "dotenv/config";
import conn from "../../db/conn.js";
import { Model, DataTypes } from "sequelize";

class Details extends Model {}

Details.init(
  {
    arguments: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
      defaultValue: null,
    },
    imageName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Please enter Raffle Name",
        },
      },
    },
  },
  {
    timestamps: true,
    sequelize: conn.sequelize,
    modelName: "OR_Reader_Details",
    paranoid: true,
    tableName: process.env.DB_PREFIX + "details",
    indexes: [{ name: "or_reader_details_idx", fields: ["id"] }],
  }
);

export default Details;
