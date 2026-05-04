import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
    allowedDevOrigins: ['192.168.100.100'],
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '*.supabase.co',
            },
        ],
    },
    reactCompiler: false,
}

export default nextConfig
