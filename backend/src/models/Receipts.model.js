import "dotenv/config";
import conn from "../../db/conn.js";
import { Model, DataTypes } from "sequelize";

class Receipts extends Model {}

Receipts.init(
  {
    user_id: {
      allowNull: true,
      type: DataTypes.INTEGER,
      defaultValue: null,
    },
    company_name: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "",
    },
    address: {
      type: DataTypes.TEXT("long"),
      allowNull: false,
    },
    vat_reg_tin: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "",
    },
    or_number: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "",
    },
    vat_exempt_sales: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "",
    },
    vatable_sales: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "",
    },
    vat_amount: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "",
    },
    date: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
    total_amount: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "",
    },
    description: {
      type: DataTypes.TEXT("long"),
      allowNull: false,
      defaultValue: "",
    },
    expense_insights_category: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "",
    },
    expense_insights_confidence: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "",
    },
    expense_insights_reasoning: {
      type: DataTypes.TEXT("long"),
      allowNull: false,
      defaultValue: "",
    },
    vat_compliance_notes: {
      type: DataTypes.TEXT("long"),
      allowNull: false,
      defaultValue: "",
    },
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
          msg: "Please enter Image Name",
        },
      },
    },
  },
  {
    timestamps: true,
    sequelize: conn.sequelize,
    modelName: "OR_Reader_Receipts",
    paranoid: true,
    tableName: process.env.DB_PREFIX + "receipts",
    indexes: [{ name: "or_reader_receipts_idx", fields: ["id"] }],
  }
);

export default Receipts;
