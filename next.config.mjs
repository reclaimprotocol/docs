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
      source: '/js/backend',
      destination: '/backend',
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
      source: '/js/frontend',
      destination: '/js/installation',
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
  ]
};

export default withMDX(config);
