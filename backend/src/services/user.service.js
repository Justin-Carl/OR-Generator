//=============================================================
//  Service Layer
//  Contains business logic, validation, transformations.
//=============================================================
import fs from "fs";
import path from "path";
import { encrpytPassword, decryptPassword } from "../utils/utils.js";
import cookieChecker from "../../authentication/cookieChecker.js";
import Users from "../models/Users.model.js";

export default class UserService {
  constructor(RepoClass) {
    // this.repo = repo;
    this.repo = new RepoClass(Users);
  }

  async createUser(req) {
    try {
      const { email, password } = req.body;

      const fetch = await this.repo.read({
        filter: [{ type: "string", field: "email", filter: email }],
      });

      if (fetch?.total > 0) {
        return {
          error: true,
          message: "Email already taken.",
        };
      }
      const create = await this.repo.create(req.body);
      return {
        error: false,
        message: "Uploaded successfully!",
      };
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async login(req, res) {
    try {
      let a;
      console.log("=======");
      if (req.body.email)
        a = await this.repo.readAll({
          filter: [{ type: "string", field: "email", filter: req.body.email }],
        });

      if (a === null) throw new Error("User not found.");
      let b = await a.validPassword(req.body.password);
      if (!b) throw new Error("Incorrect password.");
      let changeDetails = { ...a.toJSON() };

      delete changeDetails["password"];
      delete changeDetails["createdAt"];
      delete changeDetails["updatedAt"];
      delete changeDetails["deletedAt"];
      // changeDetails["pm-scratch-it-m"] = req.headers["pm-scratch-it-m"];
      changeDetails["platformversion"] = req.headers["platformversion"];
      changeDetails["platform"] = req.headers["platform"];
      changeDetails["login"] = new Date();

      let token = await res.jwtSign(changeDetails);
      let encryptToken = await encrpytPassword(token);

      return encryptToken;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async checkSession(req) {
    try {
      await cookieChecker(req, this.repo);
      return req.cookies.cookie_or_reader_07012026;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}
