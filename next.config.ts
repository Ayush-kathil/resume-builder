import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['nodemailer', 'pdf-parse'],
};

export default nextConfig;
