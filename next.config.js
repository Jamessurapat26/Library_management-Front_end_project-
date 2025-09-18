/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        // Disable ESLint during builds
        ignoreDuringBuilds: true,
    },
    typescript: {
        // Disable type checking during builds for now
        ignoreBuildErrors: true,
    },
}

module.exports = nextConfig