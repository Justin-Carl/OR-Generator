//=============================================================
//  Routes Layer
//  Maps URLs to Schema.
//=============================================================

import {
  UserSchema,
  LoginSchema,
  CheckSessionSchema,
  LogoutSchema,
} from "../schemas/user.schema.js";
const User = (app, opts, done) => {
  app.post("/create-user", UserSchema);
  app.post("/login", LoginSchema);
  app.get("/check-session", CheckSessionSchema);
  app.post("/logout", LogoutSchema);

  done();
};

export default User;
