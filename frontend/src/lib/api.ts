import axios from "axios";
import {getDeviceInfo} from "@/lib/utils";

const getDI = await getDeviceInfo();

export const api = axios.create({
     baseURL: import.meta.env.VITE_API_BASE_URL || "",
  headers: {
    "Content-Type": "application/json",
    //  "pm-scratch-it-m": getDI?.model || "none",
      platformVersion: getDI?.platformVersion || "none",
      platform: getDI?.platform || "none",
  },
  // withCredentials: true,
});

