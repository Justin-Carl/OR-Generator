//=============================================================
//  Controller Layer
//  Receives HTTP request → calls service → returns response.
//=============================================================

export default class ReceiptsController {
  constructor(service) {
    this.service = service;
  }

  uploadReceipt = async (req, reply) => {
    const result = await this.service.uploadReceipt(req);
    reply.send(result);
  };

  getReceipts = async (req, reply) => {
    console.log(">>>>>>", req.body);
    const result = await this.service.getReceipts(req);
    reply.send(result);
  };

  exportReceipts = async (req, reply) => {
    const result = await this.service.exportReceipts(req);
    reply.header("Content-Type", "text/csv");
    reply.header("Content-Disposition", "attachment; filename=users.csv");
    reply.status(200).send(result);
    // reply.send(result);
  };

  editReceipt = async (req, reply) => {
    const result = await this.service.editReceipt(req);
    reply.send(result);
  };
}
