//=============================================================
//  Controller Layer
//  Receives HTTP request → calls service → returns response.
//=============================================================

import moment from "moment";

export default class ExportController {
  constructor(service) {
    this.service = service;
  }
  toCSV(data, columns, headers) {
    const header = headers.join(",");
    // const header = columns.join(",");
    var vat_amount = 0;
    var vatable_sales = 0;
    var total_amount = 0;

    let rows = data.map((row) =>
      columns
        .map((col) => {
          let value = row[col] ?? "";
          if (col === "date" && value) {
            value = moment(value).format("MM/DD/YYYY");
          }

          if (col === "vat_amount" && value) {
            vat_amount += Number(value);
          }
          if (col === "vatable_sales" && value) {
            vatable_sales += Number(value);
          }
          if (col === "total_amount" && value) {
            total_amount += Number(value);
          }
          // escape commas and quotes
          return `"${String(value).replace(/"/g, '""')}"`;
        })
        .join(",")
    );

    rows.push(`, , , , , ${vat_amount}, ${vatable_sales}, ${total_amount}`);
    return [header, ...rows].join("\n");
  }

  Export = async (req, reply) => {
    const result = await this.service.export(req);
    const columns = [
      "date",
      "company_name",
      "or_number",
      "vat_reg_tin",
      "description",
      "vat_amount",
      "vatable_sales",
      "total_amount",
    ];

    const headers = [
      "Date",
      "Company Name",
      "OR No.",
      "VAT No.",
      "PARTICULARS",
      "VAT Amount",
      "VATable Sales",
      "Total Amount",
    ];

    const csv = this.toCSV(result, columns, headers);
    reply.header("Content-Type", "text/csv");
    reply.header(
      "Content-Disposition",
      `attachment; filename=${req.body.type}.csv`
    );
    reply.status(200).send(csv);
  };
}
