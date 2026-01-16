//=============================================================
//  Service Layer
//  Contains business logic, validation, transformations.
//=============================================================
import fs from "fs";
import path from "path";
import { Parser } from "json2csv";
import Categories from "../models/Categories.model.js";

export default class CategoriesService {
  constructor(RepoClass) {
    this.repo = new RepoClass(Categories);
  }

  async createCategory(req) {
    const data = req.body; // get uploaded file
    console.log("====", data);

    delete data.id;

    await this.repo.create({ ...data, user_id: req.user_id });

    return {
      error: false,
      message: "Created successfully!",
    };
  }

  async getCategories(req) {
    let _filter = [{ type: "number", field: "user_id", filter: req.user_id }];
    let attributes = ["id", "description", "title", "status"];
    const { page, pageSize, sort, filters } = req.body;

    if (filters) {
      _filter = [..._filter, ...filters];
    }

    const res = await this.repo.read({
      page,
      pageSize,
      sort,
      filter: _filter,
      attributes,
    });
    return {
      error: false,
      data: res,
    };
  }

  async editCategory(req) {
    const data = req.body;
    const id = data.id;

    delete data.id;

    const res = await this.repo.update(id, data);
    return {
      error: false,
      message: "Data Updated!",
    };
  }
}
