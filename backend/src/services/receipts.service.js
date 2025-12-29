//=============================================================
//  Service Layer
//  Contains business logic, validation, transformations.
//=============================================================
import fs from "fs";
import path from "path";
import { Parser } from "json2csv";

export default class ReceiptsService {
  constructor(repo, external_service) {
    this.repo = repo;
    this.es = external_service;
  }

  async uploadReceipt(req) {
    const data = await req.body.file; // get uploaded file
    console.log("====", data);
    const filePath = path.join(process.cwd(), "assets/images", data.filename);
    // save file
    await data
      .toBuffer()
      .then((buffer) => fs.promises.writeFile(filePath, buffer));

    console.log(
      "Upload success!! ",
      `${process.cwd()}/assets/images/${data.filename}`
    );

    const imageBase64 = fs.readFileSync(
      `${process.cwd()}/assets/images/${data.filename}`,
      { encoding: "base64" }
    );

    const config = {
      data: {
        model: "gpt-4.1",
        input: [
          {
            role: "system",
            content: [
              {
                type: "input_text",
                text: "You are a helpful assistant that extracts key details from receipts.",
              },
            ],
          },
          {
            role: "user",
            content: [
              { type: "input_text", text: "what is in this image?" },
              {
                type: "input_image",
                image_url: "data:image/jpeg;base64," + imageBase64,
              },
            ],
          },
        ],
        tools: [
          {
            type: "function",
            name: "extract_receipt_data",
            description: "Extract details from a receipt image",
            parameters: {
              type: "object",
              properties: {
                company_name: {
                  type: "string",
                  description: "The company name of the receipt",
                },
                vat_exempt_sales: {
                  type: "string",
                  description: "The VAT Exempt sales of the receipt",
                },
                date: {
                  type: "string",
                  description:
                    "The date of the receipt, in MM/DD/YYYY format, e.g., 11/11/2025",
                  pattern: "^(0[1-9]|1[0-2])/([0-2][0-9]|3[01])/\\d{4}$",
                },
                total_amount: {
                  type: "string",
                  description: "The Total Amount of the receipt",
                },
                description: {
                  type: "string",
                  description: "The Description of the receipt",
                },
              },
              required: ["company_name"],
            },
          },
        ],
        tool_choice: "required",
      },
    };
    // const openai_response = await this.repo.response_image_input(config);
    const openai_response = await this.es.response_image_input(config);

    const d = {
      arguments: JSON.stringify({
        ...JSON.parse(openai_response.output[0].arguments),
        status: "AI",
      }),
      imageName: data.filename,
      createdAt: new Date(),
    };

    this.repo.create(d);

    return {
      error: false,
      message: "Uploaded successfully!",
    };
  }

  async getReceipts(req) {
    console.log(req);
    const { page, pageSize } = req.query;
    const res = await this.repo.read({ page, pageSize });
    return {
      error: false,
      data: res,
    };
  }

  async exportReceipts(req) {
    console.log(req);
    const { filter } = req.body;
    console.log(filter);
    const res = await this.repo.read({ filter });
    const fields = [
      "company_name",
      "vat_exempt_sales",
      "date",
      "total_amount",
      "description",
    ];
    const parser = new Parser({ fields });
    const csv = parser.parse(res.list.map((x) => JSON.parse(x.arguments)));

    return csv;
  }

  async editReceipt(req) {
    const data = req.body;
    const id = data.id;

    delete data.id;

    data.status = "Updated";

    const new_data = {
      arguments: JSON.stringify(data),
    };
    const res = await this.repo.update(id, new_data);
    return {
      error: false,
      message: "Data Updated!",
    };
  }
}
