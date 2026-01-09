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
  app.post("/", GetReceiptsSchema);
  app.post("/export", ExportReceiptSchema);
  app.post("/edit", EditReceiptsSchema);

  done();
};

export default Receipt;
