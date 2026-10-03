/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
  skipTrailingSlashRedirect: true,
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
      {
        protocol: "https",
        hostname: "yt3.ggpht.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "scontent.fidr4-2.fna.fbcdn.net",
        pathname: "/**",
      },
    ],
    // Optimize images for production
    formats: ["image/avif", "image/webp"],
  },

  allowedDevOrigins: [""],
  output: "standalone",
};

export default config;
