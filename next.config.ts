import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

export default {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  basePath: isProd ? "/uni.com" : "",
  assetPrefix: isProd ? "/uni.com/" : "",
};

export default nextConfig;
