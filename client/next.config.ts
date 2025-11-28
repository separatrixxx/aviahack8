const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'sun*-*.userapi.com',
            },
        ],
    },
    experimental: {
        svgr: true,
        turbo: true,
    },
};

export default nextConfig;