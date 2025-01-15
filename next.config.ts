import type { NextConfig } from 'next'

const nextConfig: any = {
  /* config options here */
  experimental: {
    missingSuspenseWithCSRBailout: false
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.vietqr.io'
      },
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
        port: ''
      }
    ]
  }
}

export default nextConfig
