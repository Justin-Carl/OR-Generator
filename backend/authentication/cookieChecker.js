import moment from "moment";
import { decryptPassword } from "../src/utils/utils.js";

export const cookieChecker = async (req, repo) => {
  try {
    const cookie = req?.cookies?.cookie_or_reader_07012026;
    if (!cookie) {
      const err = new Error("Need login!");
      err.status = 401;
      throw err;
    }
    let decryptCookie = await decryptPassword(cookie);
    if (!decryptCookie) throw new Error("Invalid cookie");

    let getCookeDetails = await req.jwtVerfiy(decryptCookie);

    if (moment(getCookeDetails.login).diff(moment(), "months") > 6)
      throw new Error("Cookie expired");

    if (!getCookeDetails) throw new Error("jwtVerfiy is invalid");

    let userDetails = await repo.readV2([
      { filter: getCookeDetails.id, type: "number", field: "id" },
    ]);

    if (userDetails === null) throw new Error("User cookie not found."); // user not found based on cookie details
    return userDetails.toJSON();
  } catch (err) {
    throw err;
  }
};

export default cookieChecker;
