//=============================================================
//  Repository Layer
//  Handles DB queries (no business logic).
//=============================================================
import Details from "../models/Details.model.js";

export default class ReceiptRepository {
  constructor() {}

  async create(data) {
    let create = await Details.create(data);
    return {
      id: create.id,
    };
  }

  async update(id, data) {
    let count = await Details.count({ where: { id: id } });
    if (count < 0) throw new Error("Details Not found");

    await Details.update(data, {
      where: { id },
      individualHooks: true,
      fields: Object.keys(data),
    });

    return id;
  }

  async read({ page = 0, pageSize = 10, sort = [["id", "ASC"]], filter = [] }) {
    let query = {
      limit: parseInt(pageSize),
      offset: parseInt(page),
      order: sort,
    };

    if (filter.length !== 0) query["where"] = WhereFilters(filter);

    // ✅ Fetch both filtered list and total count
    let { count, rows } = await Details.findAndCountAll(query);

    return {
      total: count,
      list: JSON.parse(JSON.stringify(rows)),
    };
  }
}
