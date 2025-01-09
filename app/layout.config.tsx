import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';

/**
 * Shared layout configurations
 *
 * you can configure layouts individually from:
 * Home Layout: app/(home)/layout.tsx
 * Docs Layout: app/docs/layout.tsx
 */
export const baseOptions: BaseLayoutProps = {
  nav: {
    title: <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><img src="/assets/logo.png" alt="logo" width={25} height={25} />Reclaim Protocol Docs</div>,
  },
};
