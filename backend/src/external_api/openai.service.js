//=============================================================
//  External API Layer
//  Handles third-party API (no business logic).
//=============================================================

import axiosClient from "../utils/axiosClient.js";

export default class OpenAI_API {
  constructor() {
    this.url = process.env.OPEN_AI_URL;
    this.default_headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPEN_AI_KEY}`, // default auth header
    };
  }

  async response_image_input(config) {
    const res = await axiosClient.post(this.url + "responses", config.data, {
      headers: this.default_headers,
    });

    return res.data;
  }
}
