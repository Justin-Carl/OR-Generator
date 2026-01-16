import { Sequelize } from "sequelize";
import { logger } from "../src/utils/utils.js";

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_SERVER,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT,
    logging: false,
  }
);

const auth = async () => {
  try {
    await sequelize.authenticate();
    logger.info("Connection has been established successfully.");
    logger.info(`
      DB Name : ${process.env.DB_NAME} 
      DB USER: ${process.env.DB_USER}
      DB PASS: ${process.env.DB_PASS}
      HOST: ${process.env.DB_SERVER}
      port: ${process.env.DB_PORT}
      dialect: ${process.env.DB_DIALECT}
      `);
    return true;
  } catch (err) {
    logger.error(err);
  }
};

const sync = async () => {
  try {
    logger.info("Starting to Sync");
    await sequelize.sync({ force: false, alter: true });
    logger.info("Sync was successful");
  } catch (err) {
    logger.error(err);
  }
};
export default {
  sequelize,
  sync,
  auth,
};
