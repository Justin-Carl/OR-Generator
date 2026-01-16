import "dotenv/config";
import conn from "../../db/conn.js";
import { Model, DataTypes } from "sequelize";

class Categories extends Model {}

Categories.init(
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Please enter Title",
        },
        notEmpty: {
          msg: "Title cannot be empty",
        },
      },
    },
    description: {
      type: DataTypes.TEXT("long"),
      allowNull: false,
      validate: {
        notNull: {
          msg: "Please enter Description",
        },
        notEmpty: {
          msg: "Description cannot be empty",
        },
      },
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    user_id: {
      allowNull: true,
      type: DataTypes.INTEGER,
      defaultValue: null,
    },
  },
  {
    timestamps: true,
    sequelize: conn.sequelize,
    modelName: "OR_Reader_Categories",
    paranoid: true,
    tableName: process.env.DB_PREFIX + "categories",
    indexes: [{ name: "or_reader_categories_idx", fields: ["id"] }],
  }
);

export default Categories;
