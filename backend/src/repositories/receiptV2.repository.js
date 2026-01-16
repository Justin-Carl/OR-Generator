//=============================================================
//  Repository Layer
//  Handles DB queries (no business logic).
//=============================================================
import { WhereFilters } from "../utils/utils.js";

export default class ReceiptRepository {
  constructor(data) {
    this.model = data;
  }

  async create(data) {
    let create = await this.model.create(data);
    return {
      id: create.id,
    };
  }

  async update(id, data) {
    let count = await this.model.count({ where: { id: id } });
    if (count < 0) throw new Error("Details Not found");

    await this.model.update(data, {
      where: { id },
      individualHooks: true,
      fields: Object.keys(data),
    });
    return {
      id,
    };
  }

  async read({
    page = 0,
    pageSize = 10,
    sort = [["id", "ASC"]],
    filter = [],
    attributes = [],
  }) {
    let query = {
      limit: parseInt(pageSize),
      offset: parseInt(page),
      order: sort,
    };

    if (attributes.length !== 0) query["attributes"] = attributes;
    if (filter.length !== 0) query["where"] = WhereFilters(filter);

    // ✅ Fetch both filtered list and total count
    let { count, rows } = await this.model.findAndCountAll(query);

    return {
      total: count,
      list: JSON.parse(JSON.stringify(rows)),
    };
  }

  async readAll({ filter = [], attributes = [], raw = null }) {
    let query = {};

    if (raw) query["raw"] = raw;

    if (attributes.length !== 0) query["attributes"] = attributes;

    if (filter.length !== 0) query["where"] = WhereFilters(filter);

    // ✅ Fetch both filtered list and total count
    let list = await this.model.findAll(query);

    return list;
  }

  async readOne({ filter = [] }) {
    let query = {};

    if (filter.length !== 0) query["where"] = WhereFilters(filter);

    // ✅ Fetch both filtered list and total count
    let list = await this.model.findOne(query);

    return list;
  }
}
