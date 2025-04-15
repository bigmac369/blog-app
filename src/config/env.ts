import { config } from "dotenv";

config({ path: `.env.${process.env.NODE_ENV || "development"}.local` }); // Extract environment variables from .env file

export const { PORT, NODE_ENV, DB_URI } = process.env;
