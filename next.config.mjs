/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "4000",
        pathname: "/uploads/images/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "4002",
        pathname: "/uploads/images/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "1201",
        pathname: "/uploads/images/**",
      },
      {
        protocol: "https",
        hostname: "graphql102.s500.vn",
        port: "",
        pathname: "/uploads/images/**",
      },
      {
        protocol: "https",
        hostname: "graphql.ebtech.vn",
        port: "",
        pathname: "/uploads/images/**",
      },
      {
        protocol: "https",
        hostname: "g.ellib.vn",
        port: "",
        pathname: "/uploads/images/**",
      },
      {
        protocol: "https",
        hostname: "api.ellib.vn",
        port: "",
        pathname: "/uploads/images/**",
      },
    ],
  },
};

export default nextConfig;
