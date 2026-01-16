import cookieChecker from "./cookieChecker.js";
import { getPath } from "../src/utils/utils.js";
import fs from "fs";
import ReceiptRepository from "../src/repositories/receiptV2.repository.js";
import Users from "../src/models/Users.model.js";

export const auth = async (req, res) => {
  try {
    let p = getPath("authentication/pathThatDontNeedAuth.json");
    let PTDNA = JSON.parse(fs.readFileSync(p, "utf8"));

    let findNoP = PTDNA.find((x) => {
      let regex = new RegExp(x.path.toString(), "i").test(req.url.toString());

      if (regex && x.method.toLowerCase() === req.method.toLowerCase())
        return x;
    });

    if (findNoP === undefined) {
      const repo = new ReceiptRepository(Users);

      // check adminPaths
      let c_checkerDetails = await cookieChecker(req, repo);
      req.user_id = c_checkerDetails.id;
    }
  } catch (err) {
    throw err;
  }
};
