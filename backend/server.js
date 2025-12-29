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

const start = () => {
  try {
    /**
     * Register Modules
     */
    fastify.register(cors, {
      origin: (origin, cb) => {
        if (!origin) {
          return cb(null, true);
        }

        let hostname = "";
        try {
          hostname = new URL(origin).hostname;
        } catch (err) {
          console.error("Failed to parse Origin:", origin);
          return cb(new Error("Invalid origin"));
        }

        const allowedHostnames = ["localhost", "34.81.183.170"];
        if (allowedHostnames.includes(hostname)) {
          return cb(null, true);
        } else {
          return cb(new Error("You are not allowed here"));
        }
      },
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    });

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

    fastify.listen({ port: process.env.PORT });
  } catch (error) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
