/** @type {import('next').NextConfig} */
import createNextIntlPlugin from "next-intl/plugin";
const withNextIntl = createNextIntlPlugin();

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: process.env.NEXT_PUBLIC_API_BASE_URL.replace("https://", ""),
        pathname: "/**",
      },
    ],
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });

    return config;
  },
};

export default withNextIntl(nextConfig);
