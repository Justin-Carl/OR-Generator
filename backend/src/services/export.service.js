//=============================================================
//  Service Layer
//  Contains business logic, validation, transformations.
//=============================================================
import fs from "fs";
import path from "path";
import { Parser } from "json2csv";
import Categories from "../models/Categories.model.js";
import Receipts from "../models/Receipts.model.js";

export default class ExportService {
  constructor(RepoClass) {
    this.repoClass = RepoClass;
  }

  async export(req) {
    const { from, to, type } = req.body;
    let RepoModel;
    switch (type) {
      case "receipts":
        RepoModel = Receipts;
        break;

      default:
        RepoModel = Receipts;
        break;
    }

    const repo = new this.repoClass(RepoModel);
    const filter = [
      { type: "date", field: "date", filter: { start: from, end: to } },
    ];
    const attributes = [
      "date",
      "company_name",
      "or_number",
      "vat_reg_tin",
      "description",
      "vatable_sales",
      "vat_amount",
      "total_amount",
    ];

    const res = await repo.readAll({ filter: filter, attributes, raw: true });
    console.log("========", res);

    return res;
  }
}
