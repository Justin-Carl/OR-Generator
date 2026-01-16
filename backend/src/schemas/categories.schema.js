//=============================================================
//  Schema Layer
//  Maps URLs to controllers.
//=============================================================

import ReceiptRepository from "../repositories/receiptV2.repository.js";

// import Categories from "../models/Categories.model.js";

import CategoriesService from "../services/categories.service.js";
import CategoriesController from "../controllers/categories.controller.js";

// const repo = new ReceiptRepository();

const service = new CategoriesService(ReceiptRepository);
const controller = new CategoriesController(service);

export const CreateCategorySchema = {
  handler: controller.createCategory,
};

export const GetCategoriesSchema = {
  handler: controller.getCategories,
};

export const EditCategorySchema = {
  handler: controller.editCategory,
};
