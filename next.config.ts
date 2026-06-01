import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: "www.hoka.com" },
      { hostname: "www.salomon.com" },
      { hostname: "www.brooksrunning.com" },
      { hostname: "www.saucony.com" },
      { hostname: "www.altrarunning.com" },
      { hostname: "www.lasportiva.com" },
      { hostname: "www.inov-8.com" },
      { hostname: "assets.adidas.com" },
      { hostname: "static.nike.com" },
      { hostname: "www.on.com" },
      { hostname: "images.asics.com" },
      { hostname: "s3.amazonaws.com" },
      { hostname: "nb.scene7.com" },
      { hostname: "cdn.shopify.com" },
      { hostname: "m.media-amazon.com" },
      { hostname: "images.ctfassets.net" },
      { hostname: "nathansports.com" },
      { hostname: "www.clifbar.com" },
      { hostname: "www.precisionfuelandhydration.com" },
      { hostname: "guenergy.com" },
      { hostname: "springenergy.com" },
      { hostname: "maurten.com" },
      { hostname: "www.scienceinsport.com" },
      { hostname: "images.runningwarehouse.com" },
      { hostname: "www.thenorthface.com.au" },
      { hostname: "www.osprey.com" },
      { hostname: "www.blackdiamondequipment.com" },
      { hostname: "www.ultimatedirection.com" },
      { hostname: "www.raidlight.com" },
      { hostname: "www.arcteryx.com" },
      { hostname: "www.patagonia.com" },
    ],
  },
};

export default nextConfig;
