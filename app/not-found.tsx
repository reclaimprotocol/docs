import Link from 'next/link';

export default function NotFound() {
  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center"
      style={{ zIndex: 9999, backgroundColor: '#f5f5f5' }}
    >
      <div className="dark:hidden absolute inset-0" style={{ backgroundColor: '#f5f5f5' }} />
      <div className="hidden dark:block absolute inset-0" style={{ backgroundColor: '#0a0a0a' }} />
      <div className="relative flex flex-col items-center">
        <h1 className="text-8xl font-bold text-neutral-900 dark:text-neutral-100">404</h1>
        <p className="mt-4 text-xl text-neutral-600 dark:text-neutral-400 text-center">
          This page could not be found.
        </p>
        <Link
          href="/"
          className="mt-8 px-6 py-3 rounded-md bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 hover:opacity-90 transition-opacity font-medium"
        >
          Go back home
        </Link>
      </div>
    </div>
  );
}
