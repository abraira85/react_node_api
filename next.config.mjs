/** @type {import('next').NextConfig} */
const nextConfig = {
    swcMinify: true,
    poweredByHeader: false,
    async redirects() {
        return [
            {
                source: "/",
                destination: "/admin/users",
                permanent: true,
            },
            {
                source: "/en",
                destination: "/en/admin/users",
                permanent: true,
            },
            {
                source: "/es",
                destination: "/es/admin/users",
                permanent: true,
            },
            {
                source: "/en/admin",
                destination: "/en/admin/users",
                permanent: true,
            },
            {
                source: "/es/admin",
                destination: "/es/admin/users",
                permanent: true,
            },
        ];
    },
    webpack(config, { isServer }) {
        const conf = config;

        conf.module.rules.push({
            test: /\.svg$/,
            use: {
                loader: "@svgr/webpack",
            },
        });

        return conf;
    },
};

export default nextConfig;
