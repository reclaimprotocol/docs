import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX({
  routes: {
    path: '/',
  }
});

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  redirects: async () => [
    {
      source: '/advance-configurations/advance-options',
      destination: '/advance-options',
      permanent: true
    },
    {
      source: '/sdk/polkadot/substrate-quickstart',
      destination: '/sdk/polkadot/quickstart',
      permanent: true
    },
    {
      source: '/sdk-methods',
      destination: '/',
      permanent: true
    },
    {
      source: '/solidity/supported-networks',
      destination: '/sdk/solidity/supported-networks',
      permanent: true
    },
    {
      source: '/install',
      destination: '/#getting-started',
      permanent: true
    },
    {
      source: '/security',
      destination: '/',
      permanent: true
    },
    {
      source: '/api',
      destination: '/',
      permanent: true
    },
    {
      source: '/whitepaper-and-how-reclaim-protocol-works',
      destination: '/#overview',
      permanent: true
    },
    {
      source: '/node/quickstart',
      destination: '/backend',
      permanent: true
    }
  ],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.shields.io',
      },
    ],
  },
};

export default withMDX(config);
