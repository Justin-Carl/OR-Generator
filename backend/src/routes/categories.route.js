//=============================================================
//  Routes Layer
//  Maps URLs to Schema.
//=============================================================

import {
  CreateCategorySchema,
  GetCategoriesSchema,
  EditCategorySchema,
} from "../schemas/categories.schema.js";
const Receipt = (app, opts, done) => {
  app.post("/create", CreateCategorySchema);
  app.post("/", GetCategoriesSchema);
  app.post("/edit", EditCategorySchema);

  done();
};

export default Receipt;
