//=============================================================
//  Controller Layer
//  Receives HTTP request → calls service → returns response.
//=============================================================

export default class CategoriesController {
  constructor(service) {
    this.service = service;
  }

  createCategory = async (req, reply) => {
    const result = await this.service.createCategory(req);
    reply.send(result);
  };

  getCategories = async (req, reply) => {
    console.log(">>>>>>", req.body);
    const result = await this.service.getCategories(req);
    reply.send(result);
  };

  editCategory = async (req, reply) => {
    const result = await this.service.editCategory(req);
    reply.send(result);
  };
}
