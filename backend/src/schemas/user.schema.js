//=============================================================
//  Schema Layer
//  Maps URLs to controllers.
//=============================================================

// import UserRepository from "../repositories/user.repository.js";
import ReceiptRepository from "../repositories/receiptV2.repository.js";

import UserService from "../services/user.service.js";
import UsersController from "../controllers/user.controller.js";

// const repo = new UserRepository();

const service = new UserService(ReceiptRepository);
const controller = new UsersController(service);

export const UserSchema = {
  handler: controller.CreateUser,
};

export const LoginSchema = {
  handler: controller.Login,
};
export const LogoutSchema = {
  handler: controller.Logout,
};
export const CheckSessionSchema = {
  handler: controller.CheckSession,
};
