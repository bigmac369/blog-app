import { config } from "dotenv";

config({ path: `.env.${process.env.NODE_ENV || "development"}.local` }); // Extract environment variables from .env file

if (!process.env.JWT_SECRET) {
  throw new Error("❌ JWT_SECRET is missing from .env file.");
}

export const { PORT, NODE_ENV, DB_URI, JWT_SECRET, JWT_EXPIRES_IN } =
  process.env;
