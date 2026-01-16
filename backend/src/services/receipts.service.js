//=============================================================
//  Service Layer
//  Contains business logic, validation, transformations.
//=============================================================
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { imageHash } from "image-hash";

import { Parser } from "json2csv";
import Details from "../models/Details.model.js";
import Categories from "../models/Categories.model.js";
import Receipts from "../models/Receipts.model.js";
import { error } from "console";

export default class ReceiptsService {
  constructor(RepoClass, external_service) {
    this.repo = new RepoClass(Receipts);
    this.repo2 = new RepoClass(Categories);

    this.es = external_service;
  }

  async uploadReceipt(req) {
    const data = await req.body.file; // get uploaded file
    const buffer = await data.toBuffer(); // get raw bytes

    //3 Layers for image duplicate detection
    //================ Layer 1 duplicate detection ==============
    const iHash = await this.CryptographicHash(buffer); //Layer 1
    if (!iHash) {
      console.log("=====> Duplicate image detected at Layer 1.");
      return {
        error: true,
        message: "Duplicate Image",
      };
    }
    //============================================================

    const filePath = path.join(process.cwd(), "assets/images", data.filename);
    // save file
    await fs.promises.writeFile(filePath, buffer);
    // await data
    //   .toBuffer()
    //   .then((buffer) => fs.promises.writeFile(filePath, buffer));

    //================ Layer 2 duplicate detection ==============
    const pHash = await this.PerpetualHashing(filePath, req);
    if (!pHash) {
      console.log("=====> Duplicate image detected at Layer 2.");
      return { error: true, message: "Visually duplicate image detected" };
    }
    //============================================================

    console.log(
      "Upload success!! ",
      `${process.cwd()}/assets/images/${data.filename}`
    );

    const imageBase64 = fs.readFileSync(
      `${process.cwd()}/assets/images/${data.filename}`,
      { encoding: "base64" }
    );

    const category_list = await this.repo2.readAll({
      filter: [{ type: "number", field: "user_id", filter: req.user_id }],
    });

    let categories_string = "";

    if (category_list.length > 0) {
      let m = category_list.map((x) => `- ${x.title} ${x.description} \n`);
      categories_string = m.join("", ",");
    } else {
      return {
        error: true,
        message: "No category found.",
      };
    }

    const config = {
      data: {
        model: "gpt-4.1",
        input: [
          {
            role: "system",
            content: [
              {
                type: "input_text",
                // text: "You are a helpful assistant that extracts key details from receipts.",
                text: `You are a helpful assistant that extracts key details from receipts and generates expense insights.

    Your tasks:
    1. Extract all standard receipt details:
       - company_name
       - address
       - VAT/TIN information
       - vatable_sales, vat_exempt_sales, vat_amount
       - date (MM/DD/YYYY)
       - total_amount
       - description / particulars
       - VAT compliance notes if missing or unclear

    2. Categorize each expense based on the following user-defined categories:
    ${categories_string}

    3. For categorization:
       - Pick the most appropriate category based on receipt details.
       - If no match, classify as "Others".
       - Provide a confidence score (0.0–1.0) and a short reasoning explaining why this category was chosen.

    Output:
    - JSON object including all extracted fields.
    - Include a new field 'expense_insights' with:
      {
        category: string,
        confidence: number,
        reasoning: string
      }`,
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
            description:
              "Extract details from a receipt image and generate expense insights including category classification.",
            parameters: {
              type: "object",
              properties: {
                company_name: {
                  type: "string",
                  description: "The company name of the receipt",
                },
                address: {
                  type: "string",
                  description:
                    "Business address printed on the receipt (street, city, or branch address). Return null if not visible.",
                },
                vat_reg_tin: {
                  type: "string",
                  description:
                    "VAT Registered TIN of the seller (e.g. 'VAT Reg TIN: 123-456-789-000'). If not present, return null.",
                },
                or_number: {
                  type: "string",
                  description:
                    "Official Receipt Number (OR No.). May appear as 'OR No', 'O.R. No', or 'Receipt No'. Return null if not visible.",
                },
                vat_exempt_sales: {
                  type: "string",
                  description:
                    "VAT-exempt sales amount, if any. Return null if not applicable.",
                },
                vatable_sales: {
                  type: "string",
                  description:
                    "Amount net of VAT (Vatable / VATable Sales / Amount less VAT). Return null if not shown.",
                },
                vat_amount: {
                  type: "string",
                  description:
                    "VAT amount (usually 12%). Return null if not shown.",
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

                expense_insights: {
                  type: "object",
                  description: "AI-generated insights about the expense",
                  properties: {
                    category: {
                      type: "string",
                      description:
                        "Best-matched expense category based on user-defined categories. Use 'Others' if no match.",
                    },
                    confidence: {
                      type: "number",
                      description: "Confidence score from 0.0 to 1.0",
                    },
                    reasoning: {
                      type: "string",
                      description:
                        "Short explanation why this category was chosen",
                    },
                  },
                  required: ["category"],
                },

                vat_compliance_notes: {
                  type: "string",
                  description:
                    "Notes if VAT info is missing or unclear (e.g. 'No VAT Reg TIN found', 'No VAT breakdown shown').",
                },
              },
              required: ["company_name", "total_amount", "expense_insights"],
            },
          },
        ],
        tool_choice: "required",
      },
    };
    // const openai_response = await this.repo.response_image_input(config);
    const openai_response = await this.es.response_image_input(config);

    if (openai_response.output[0].arguments) {
      const args = JSON.parse(openai_response.output[0].arguments);

      //================ Layer 3 duplicate detection ==============
      const content_finger_print =
        args.company_name + "-" + args.date + "-" + args.total_amount;

      const existing_content = await this.ContentFingerPrint(
        content_finger_print,
        req
      );

      if (existing_content) {
        console.log("=====> Duplicate image detected at Layer 3.");
        return {
          error: true,
          message: "Duplicate image detected",
        };
      }
      //============================================================

      const d = {
        arguments: JSON.stringify({
          ...args,
          status: "AI",
        }),
        imageName: data.filename,
        ...args,
        expense_insights_category: args.expense_insights.category,
        expense_insights_confidence: args.expense_insights.confidence,
        expense_insights_reasoning: args.expense_insights.reasoning,
        user_id: req.user_id,
        imageHash: iHash,
        pHash: pHash,
        content_finger_print: content_finger_print,
      };

      await this.repo.create(d);
    }

    return {
      error: false,
      message: "Uploaded successfully!",
    };
  }

  async getReceipts(req) {
    console.log(req.body);
    const { page, pageSize, sort, filters } = req.body;
    const res = await this.repo.read({ page, pageSize, sort, filter: filters });
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
    const expense_insights = data.expense_insights;

    delete data.id;
    delete data.expense_insights;

    data.status = "Updated";

    const new_data = {
      ...data,
      // arguments: JSON.stringify(data),
    };
    const res = await this.repo.update(id, new_data);
    return {
      error: false,
      message: "Data Updated!",
    };
  }

  async CryptographicHash(buffer) {
    const sha256Hash = crypto.createHash("sha256").update(buffer).digest("hex");
    // 2. Check DB for existing hash
    const existing = await this.repo.readOne({
      filter: [{ type: "string", field: "imageHash", filter: sha256Hash }],
    });

    if (!existing) {
      return sha256Hash;
    }
    return null;
  }

  async PerpetualHashing(filePath, req) {
    // Compute perceptual hash
    const pHash = await this.ComputePHash(filePath);
    console.log("Perceptual hash:", pHash);
    // Find candidates with same prefix
    const candidates = await this.repo.readAll({
      attributes: ["pHash"],
      filter: [
        {
          type: "string_like",
          field: "pHash",
          filter: pHash.slice(0, 7) + "%",
        },
        {
          type: "number",
          field: "user_id",
          filter: req.user_id,
        },
      ],
      raw: true,
    }); // get the data that has the first 7 characters.
    console.log("Candidates for prefix:", candidates);

    if (candidates.length > 0) {
      for (const img of candidates) {
        // A small distance → images are visually very similar (have more similarities in phash)
        // A large distance → images are different
        if (this.HammingDistance(pHash, img.pHash) <= 5) {
          return null;
        }
      }
    }

    return pHash;
  }
  // Helper to compute perceptual hash (Promise-based)
  async ComputePHash(filePath) {
    return new Promise((resolve, reject) => {
      imageHash(filePath, 16, true, (err, hash) => {
        if (err) reject(err);
        else resolve(hash);
      });
    });
  }

  HammingDistance(hash1, hash2) {
    let dist = 0;
    for (let i = 0; i < hash1.length; i++) {
      if (hash1[i] !== hash2[i]) dist++;
    }
    return dist;
  }

  async ContentFingerPrint(content, req) {
    const contents = await this.repo.readAll({
      attributes: ["content_finger_print"],
      filter: [
        {
          type: "string",
          field: "content_finger_print",
          filter: content,
        },
        {
          type: "number",
          field: "user_id",
          filter: req.user_id,
        },
      ],
      raw: true,
    });

    if (contents.length > 0) {
      return true;
    }
    return false;
  }
}
