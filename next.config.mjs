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
    }
  ]
};

export default withMDX(config);
