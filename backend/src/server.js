const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const path = require("path");

const { env, corsOrigins } = require("./utils/env");
const { connectDb } = require("./utils/db");
const { notFound } = require("./middleware/notFound");
const { errorHandler } = require("./middleware/errorHandler");

const authRoutes = require("./routes/auth.routes");
const postRoutes = require("./routes/post.routes");
const userRoutes = require("./routes/user.routes");
const uploadRoutes = require("./routes/upload.routes");

async function main() {
  await connectDb(env.MONGODB_URI);

  const app = express();
  const isProd = env.NODE_ENV === "production";

  // Normalize: strip trailing slashes for comparison
  const normalizedCorsOrigins = corsOrigins.map((o) => o.replace(/\/+$/, ""));
  console.log("Allowed CORS origins:", normalizedCorsOrigins);

  app.use(
    cors({
      origin(origin, cb) {
        // allow non-browser clients / same-origin
        if (!origin) return cb(null, true);
        // dev-friendly: allow any localhost port (dev only)
        if (!isProd && /^http:\/\/localhost:\d+$/.test(origin)) return cb(null, true);
        if (!isProd && /^http:\/\/127\.0\.0\.1:\d+$/.test(origin)) return cb(null, true);

        const clean = origin.replace(/\/+$/, "");
        // check explicit allow-list
        if (normalizedCorsOrigins.includes(clean)) return cb(null, true);
        // allow known deployment platforms (netlify, vercel, render)
        if (/\.netlify\.app$/.test(clean)) return cb(null, true);
        if (/\.vercel\.app$/.test(clean)) return cb(null, true);
        if (/\.onrender\.com$/.test(clean)) return cb(null, true);

        console.error(`CORS blocked origin: "${origin}" | Allowed: ${normalizedCorsOrigins.join(", ")}`);
        return cb(new Error("Not allowed by CORS"));
      },
      credentials: true,
    })
  );
  app.use(express.json({ limit: "1mb" }));
  app.use(cookieParser());
  app.use(morgan("dev"));

  app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

  app.get("/api/health", (_req, res) => res.json({ ok: true }));

  app.use("/api/auth", authRoutes);
  app.use("/api/posts", postRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/uploads", uploadRoutes);

  app.use(notFound);
  app.use(errorHandler);

  const host = isProd ? "0.0.0.0" : "localhost";
  app.listen(env.PORT, host, () => {
    console.log(`API listening on http://${host}:${env.PORT}`);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

