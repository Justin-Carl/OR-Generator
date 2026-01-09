//=============================================================
//  Controller Layer
//  Receives HTTP request → calls service → returns response.
//=============================================================

export default class UsersController {
  constructor(service) {
    this.service = service;
  }

  CreateUser = async (req, reply) => {
    const result = await this.service.createUser(req);
    reply.send(result);
  };

  Login = async (req, reply) => {
    console.log(">>>>>>>>>>>>>>>>");
    const encryptToken = await this.service.login(req, reply);

    reply
      .setCookie("cookie_or_reader_07012026", encryptToken, {
        domain: "",
        path: "/",
        secure: true,
        sameSite: "Lax",
        httpOnly: true,
        maxAge: 180 * 24 * 60 * 60, // 180 days in seconds
      })
      .send({
        result: "success",
        token: encryptToken,
        message: "Login Successfull.",
      });
  };

  Logout = async (req, reply) => {
    reply
      .clearCookie("cookie_or_reader_07012026", {
        domain: "",
        path: "/",
        secure: true,
        httpOnly: true,
        sameSite: "Lax",
      })
      .send({ result: "success", message: "Logged out!" });
  };

  CheckSession = async (req, reply) => {
    const result = await this.service.checkSession(req);
    reply.send(result);
  };
}
