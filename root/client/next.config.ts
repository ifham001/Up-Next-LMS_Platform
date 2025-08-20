import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  
  domain: "*",
  crossOrigin: "anonymous",
  images:{
    domains:[
     'storage.googleapis.com', 
      'lms-platform12.storage.googleapis.com'
    ]
  }
  
};


export default nextConfig;
