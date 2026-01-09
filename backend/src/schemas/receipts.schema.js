//=============================================================
//  Schema Layer
//  Maps URLs to controllers.
//=============================================================

// import ReceiptRepository from "../repositories/openai.repository.js";
import ReceiptRepository from "../repositories/receipt.repository.js";
import OpenAI_API from "../external_api/openai.service.js";

import ReceiptsService from "../services/receipts.service.js";
import ReceiptsController from "../controllers/receipts.controller.js";

const repo = new ReceiptRepository();
const openai = new OpenAI_API(); // external api

const service = new ReceiptsService(repo, openai);
const controller = new ReceiptsController(service);

export const UploadReceiptsSchema = {
  handler: controller.uploadReceipt,
};

export const GetReceiptsSchema = {
  handler: controller.getReceipts,
};

export const ExportReceiptSchema = {
  handler: controller.exportReceipts,
};

export const EditReceiptsSchema = {
  handler: controller.editReceipt,
};
