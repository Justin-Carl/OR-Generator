//=============================================================
//  Routes Layer
//  Maps URLs to Schema.
//=============================================================

import { ExportSchema } from "../schemas/export.schema.js";
const Receipt = (app, opts, done) => {
  app.post("/", ExportSchema);

  done();
};

export default Receipt;
