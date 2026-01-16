/**
 * Import the framework and instantiate it
 */
import "dotenv/config";
import Fastify from "fastify";
import cors from "@fastify/cors";

/**
 * Routes
 */
import Receipt from "./src/routes/receipts.route.js";
import User from "./src/routes/user.route.js";
import Category from "./src/routes/categories.route.js";
import Export from "./src/routes/export.route.js";

import conn from "./db/conn.js";
import Associations from "./src/models/association/index.js";
import { auth } from "./authentication/auth.js";
const fastify = Fastify({
  logger: {
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
      },
      levels: "debug",
    },
  },
  // logger: true,
  trustProxy: true,
  disableRequestLogging: false,
  level: "debug",
});
fastify.server.setTimeout(60 * 60 * 1000); // 10 minutes in milliseconds

const start = async () => {
  try {
    /**
     * Register Modules
     */
    fastify.register(cors, {
      origin: (origin, cb) => {
        if (!origin) return cb(null, true); // allow non-browser requests
        const allowed = ["localhost", "34.126.144.53"];
        const hostname = new URL(origin).hostname;
        if (allowed.includes(hostname)) cb(null, true);
        else cb(new Error("Not allowed"));
      },
      methods: ["GET", "POST", "PUT", "OPTIONS"],
      exposedHeaders: ["Content-Disposition"],
      credentials: true,
    });

    // jwt
    fastify.register(import("@fastify/jwt"), {
      secret: process.env.JWT_SECRET,
    });

    fastify.register(import("@fastify/cookie"), {
      secret: process.env.JWT_SECRET,
      cookie: {
        secure: true, // Insecure setting for development
        httpOnly: true,
        sameSite: "Lax",
        path: "/",
        maxAge: 180 * 24 * 60 * 60, // 180 days in seconds
      },
    });

    fastify
      .decorate("fastify1", fastify)
      .decorateRequest("jwtVerfiy", {
        getter() {
          return fastify.jwt.verify;
        },
      })
      .addHook("onRequest", auth);

    // multipart
    fastify.register(import("@fastify/multipart"), {
      limits: {
        fieldNameSize: 1000, // Max field name size in bytes
        fileSize: 10000000, // Max field value size in bytes
        fields: 50, // Max number of non-file fields
        fileSize: 10000000000, // For multipart forms, the max file size in bytes
        files: 2, // Max number of file fields
        headerPairs: 2000, // Max number of header key=>value pairs
        parts: 10000, // For multipart forms, the max number of parts (fields + files)
      },
      attachFieldsToBody: true,
    });

    fastify.register(import("@fastify/csrf-protection"));

    /**
     *error handler
     */
    fastify.setErrorHandler((err, req, res) => {
      res.status(err.statusCode || 500).send({
        error: true,
        message: err.message || "Internal Server Error",
      });
    });
    // if not found return server error only
    fastify.setNotFoundHandler((request, res) => {
      res.status(404).send({
        error: true,
        message: `Something went wrong please contact us`,
        statusCode: 404,
      });
    });

    /**
     * Global Crash Guards
     * - avoid app from crashing every theres an error.
     */
    process.on("unhandledRejection", (reason) => {
      console.error("🧨 Unhandled Rejection:", reason);
    });

    process.on("uncaughtException", (err) => {
      console.error("💥 Uncaught Exception:", err);
    });

    /**
     * Register Routes
     */
    fastify.register(Receipt, {
      prefix: "/receipt",
    });

    fastify.register(User, {
      prefix: "/user",
    });

    fastify.register(Category, {
      prefix: "/category",
    });

    fastify.register(Export, {
      prefix: "/export",
    });

    const connected = await conn.auth();
    if (connected) {
      await conn.auth();
      await Associations();
      await conn.sync();
    }

    fastify.listen({ port: process.env.PORT });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
