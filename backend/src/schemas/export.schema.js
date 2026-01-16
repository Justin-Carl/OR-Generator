//=============================================================
//  Schema Layer
//  Maps URLs to controllers.
//=============================================================

import ReceiptRepository from "../repositories/receiptV2.repository.js";

// import Categories from "../models/Categories.model.js";

import ExportService from "../services/export.service.js";
import ExportController from "../controllers/export.controller.js";

// const repo = new ReceiptRepository();

const service = new ExportService(ReceiptRepository);
const controller = new ExportController(service);

export const ExportSchema = {
  handler: controller.Export,
};
