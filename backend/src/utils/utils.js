import pino from "pino";
import { createCipheriv, createDecipheriv } from "crypto";
import "dotenv/config";

import { Op } from "sequelize";
import moment from "moment";
import { fileURLToPath } from "url";
import path from "path";

export const WhereFilters = (filters = []) => {
  let wherefilters = {};

  if (filters && filters instanceof Array && filters.length > 0) {
    for (var x = 0; x < filters.length; x++) {
      const f = filters[x];

      switch (f.type.toString().toLowerCase()) {
        case "multiple-string":
        case "multiple-boolean":
        case "multiple-array":
        case "multiple-date":
          let multiplewherefilters = WhereFilters(
            f.field.map((i) => {
              return {
                field: i,
                filter: f.filter,
                type: f.type.toString().toLowerCase().replace("multiple-", ""),
              };
            })
          );

          wherefilters = Object.assign({}, wherefilters, multiplewherefilters);
          break;
        case "string":
          wherefilters[f.field] = {
            [Op.substring]: f.filter.toString(),
          };
          break;
        case "string_like":
          wherefilters[f.field] = {
            [Op.like]: f.filter.toString(),
          };
          break;
        case "not_empty_string":
          wherefilters[f.field] = { [Op.ne]: "" };
          break;
        case "string_eq":
          wherefilters[f.field] = {
            [Op.eq]: f.filter.toString(),
          };
          break;
        case "boolean":
          wherefilters[f.field] = f.filter;
          break;
        case "array":
          wherefilters[f.field] = {
            [Op.in]: f.filter,
          };
        case "array-or":
          wherefilters[f.field] = {
            [Op.or]: f.filter,
          };
        case "number":
          wherefilters[f.field] = f.filter;
          break;
        case "isnot":
          wherefilters[f.field] = { [Op.ne]: f.filter };
          break;
        case "future_date":
          const currentDate = moment().startOf("day").format("YYYY-MM-DD");
          wherefilters[f.field] = {
            [Op.gt]: `${currentDate} 23:59:59`,
          };
          break;
        case "current_or_after":
          wherefilters[f.field] = {
            [Op.lte]: moment().format("YYYY-MM-DD HH:mm:ss"), // current datetime
          };
          break;
        case "date":
          if (
            f.filter.start &&
            f.filter.start.toString().length > 0 &&
            moment(f.filter.start.toString()).isValid()
          ) {
            if (
              f.filter.end &&
              f.filter.end.toString().length > 0 &&
              moment(f.filter.end.toString()).isValid()
            ) {
              wherefilters[f.field] = {
                [Op.gte]: `${moment(f.filter.start.toString()).format(
                  "YYYY-MM-DD"
                )} 00:00:00`,
                [Op.lte]: `${moment(f.filter.end.toString()).format(
                  "YYYY-MM-DD"
                )} 23:59:59`,
              };
            } else {
              wherefilters[f.field] = {
                [Op.gte]: `${moment(f.filter.start.toString()).format(
                  "YYYY-MM-DD"
                )} 00:00:00`,
                [Op.lte]: `${moment(f.filter.start.toString()).format(
                  "YYYY-MM-DD"
                )} 23:59:59`,
              };
            }
          }
          break;
        case "greater_than_time": // you named it "greater_than_time" but it means "older than X"
          {
            // allow f.value to be string/number; default 1
            const rawValue = f.value ?? 1;
            const value =
              typeof rawValue === "string"
                ? parseInt(rawValue, 10) || 1
                : rawValue;
            const unit = f.unit || "hours"; // "minutes", "hours", "days", "seconds", etc.

            // threshold = now - value unit
            const threshold = moment().subtract(value, unit).toDate();

            // debug
            console.log("threshold for", f.field, "=>", threshold);

            // Use Op.lt / Op.lte to get rows older than the threshold
            // use Op.lte if you want to include exactly the threshold time
            wherefilters[f.field] = {
              [Op.lte]: threshold,
            };
          }
          break;
      }
    }
  }

  return wherefilters;
};

export const logger = pino({
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
    },
  },
});

const algorithm = "aes-256-cbc";
const key = process.env.CRYPTO_KEY; //  this must not change it will change the value of the db
const iv = process.env.CRYPTO_IV; // this must not change it will change the value of the db
export const encrpytPassword = (_d) => {
  const cipher = createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(_d, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
};
export const decryptPassword = (_d) => {
  try {
    const decipher = createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(_d, "hex", "utf8");

    decrypted += decipher.final("utf8"); // Fix: This should be called correctly
    return decrypted;
  } catch (err) {
    return false;
  }
};

export const getPath = (_d) => {
  let _P = _d ? _d : "";
  const __filename = fileURLToPath(import.meta.url);
  return path.join(__filename, "../../../", _P);
};
