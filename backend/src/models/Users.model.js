import conn from "../../db/conn.js";
import { Model, DataTypes } from "sequelize";
import { encrpytPassword, decryptPassword } from "../utils/utils.js";
import validator from "validator";
class Users extends Model {
  async validPassword(password) {
    var hash =
      password && password !== ""
        ? await decryptPassword(this.password)
        : false;
    console.log(encrpytPassword(password), "here");
    if (password === hash) return true;
    else hash;
  }
}

Users.init(
  {
    firstname: {
      allowNull: false,
      type: DataTypes.STRING,
      defaultValue: "",
    },
    lastname: {
      allowNull: false,
      type: DataTypes.STRING,
      defaultValue: "",
    },
    email: {
      allowNull: true,
      type: DataTypes.STRING,
      defaultValue: null,
      async set(val) {
        if (val !== "") {
          if (!val || !validator.isEmail(val)) {
            throw new Error("Invalid Email");
          }

          this.setDataValue("email", val);
        }
      },
    },
    password: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        notNull: {
          msg: "Please enter Password",
        },
      },
    },
  },
  {
    timestamps: true,
    sequelize: conn.sequelize,
    modelName: "Users",
    paranoid: true,
    tableName: process.env.DB_PREFIX + "users",
    indexes: [{ name: "user_idx", fields: ["email"] }],
    hooks: {
      beforeSave: async (user) => {
        const prevPassword = user.previous().password;
        const currentPassword = user.password;

        // If password is empty or unchanged, skip processing
        if (
          !user.changed("password") ||
          !currentPassword ||
          currentPassword === ""
        ) {
          user.password = prevPassword; // Restore the old password
          return;
        }

        const decrypted = decryptPassword(prevPassword);
        if (decrypted !== currentPassword) {
          user.password = encrpytPassword(currentPassword);
        } else {
          user.password = prevPassword;
        }
      },
    },
  }
);

export default Users;
