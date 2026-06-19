/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "c4qrl532oo.ufs.sh",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "163jz9wo57.ufs.sh",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "media.licdn.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "pbs.twimg.com",
        pathname: "/**",
      },
    ],
    // Optimize images for production
    formats: ["image/avif", "image/webp"],
  },

  allowedDevOrigins: [
    "440a-2405-201-3007-a8ac-2cfb-d137-1a8f-5f63.ngrok-free.app",
  ],
};

export default config;
