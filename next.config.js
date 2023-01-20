/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["images.extrapolate.workers.dev", "replicate.delivery"],
  },
  async redirects() {
    return [
      {
        source: "/github",
        destination: "https://github.com/steven-tey/extrapolate",
        permanent: false,
      },
      {
        source: "/p",
        destination: "/",
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
