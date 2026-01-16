//=============================================================
//  Repository Layer
//  Handles DB queries (no business logic).
//=============================================================
import Users from "../models/Users.model.js";

import { WhereFilters } from "../utils/utils.js";

export default class UserRepository {
  constructor() {}

  async create(data) {
    let create = await Users.create(data);
    return {
      id: create.id,
    };
  }

  update(id, data) {
    return {
      id,
    };
  }

  async read({ page = 1, pageSize = 10, sort = [["id", "ASC"]], filter = [] }) {
    let query = {
      limit: parseInt(pageSize),
      offset: parseInt(page),
      order: sort,
    };

    if (filter.length !== 0) query["where"] = WhereFilters(filter);

    // ✅ Fetch both filtered list and total count
    let { count, rows } = await Users.findAndCountAll(query);

    return {
      total: count,
      list: JSON.parse(JSON.stringify(rows)),
    };
  }

  async readAll({ filter = [] }) {
    let query = {};

    if (filter.length !== 0) query["where"] = WhereFilters(filter);

    // ✅ Fetch both filtered list and total count
    let list = await Users.findOne(query);

    return list;
  }
}
