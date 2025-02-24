import { remarkMermaid } from '@theguild/remark-mermaid';
import { remarkInstall } from 'fumadocs-docgen';
import { defineDocs, defineConfig } from 'fumadocs-mdx/config';

export const { docs, meta } = defineDocs({
  dir: 'content/docs',
});

export default defineConfig({
  mdxOptions: {
    remarkPlugins: [remarkMermaid, remarkInstall],
  },
});
