//=============================================================
//  Routes Layer
//  Maps URLs to Schema.
//=============================================================

import {
  UploadReceiptsSchema,
  GetReceiptsSchema,
  ExportReceiptSchema,
  EditReceiptsSchema,
} from "../schemas/receipts.schema.js";
const Receipt = (app, opts, done) => {
  app.post("/upload", UploadReceiptsSchema);
  app.get("/", GetReceiptsSchema);
  app.post("/export", ExportReceiptSchema);
  app.put("/", EditReceiptsSchema);

  done();
};

export default Receipt;
