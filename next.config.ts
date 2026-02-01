import type { NextConfig } from "next";
import path from "path";
import dotenv from "dotenv";
import { expand } from "dotenv-expand";

const nodeEnv = process.env.NODE_ENV ?? "development";

// Load .env files in Next.js order (later overrides earlier)
const envFiles = [
  ".env",
  ".env.local",
  `.env.${nodeEnv}`,
  `.env.${nodeEnv}.local`,
];

for (const file of envFiles) {
  expand(dotenv.config({ path: path.resolve(process.cwd(), file) }));
}

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
