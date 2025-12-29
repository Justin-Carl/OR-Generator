//=============================================================
//  Repository Layer
//  Handles DB queries (no business logic).
//=============================================================
import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "db", "db.json");
// const fileContent = fs.readFileSync(filePath, "utf-8");
// const e = JSON.parse(fileContent); // array
// const db = e.sort((a, b) => b.id - a.id); //decending

export default class ReceiptRepository {
  constructor() {}
  // Read JSON fresh from file
  _readFile() {
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const db = JSON.parse(fileContent);
    return db.sort((a, b) => b.id - a.id); // descending
  }

  _writeFile(db) {
    fs.writeFileSync(filePath, JSON.stringify(db, null, 2), "utf-8");
  }

  async create(data) {
    const db = this._readFile();

    const maxId = db.length > 0 ? Math.max(...db.map((x) => x.id)) : 0;
    const id = maxId + 1;

    db.push({
      id: id,
      ...data,
    });

    await fs.writeFileSync(filePath, JSON.stringify(db, null, 2), "utf-8");

    return {
      id,
    };
  }

  update(id, data) {
    const db = this._readFile();

    const new_db = db.map((x) => {
      if (x.id === id) {
        return {
          ...x,
          ...data,
        };
      }

      return x;
    });

    this._writeFile(new_db);

    return {
      id,
    };
  }

  read({ page = 1, pageSize = 10, filter = [] }) {
    const db = this._readFile();

    let list = db;
    let totalItems = list.length;
    let totalPages = 0;

    if (filter.length > 0) {
      if (!filter[0].column) throw Error("Column is missing in filter");
      console.log(filter[0].column === "id");
      if (filter[0].column === "id") {
        const new_f = filter[0].value.map((x) => Number(x));
        const db_filter = db.filter((x) => new_f.includes(x.id));
        console.log(db_filter);
        list = db_filter;
        totalItems = list.length;
      }
    }

    if (page) {
      totalPages = Math.ceil(totalItems / pageSize);

      // calculate start and end index
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;

      const paginatedData = list.slice(startIndex, endIndex);
      list = paginatedData;
    }

    return {
      totalItems,
      totalPages,
      list: list,
    };
  }
}
