'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

const slides = [
  {
    title: 'Choose the data source',
    description:
      'The user selects the website or institution that contains the information to verify.',
    image: '/images/verification-flow/select-provider.png',
    alt: 'Verification start screen with country, employer, and Rippling selected as the source',
  },
  {
    title: 'Review what will be checked',
    description:
      'Reclaim shows the user what they need to do and which fields will be verified.',
    image: '/images/verification-flow/get-ready.png',
    alt: 'Getting ready screen explaining the login and verification steps',
  },
  {
    title: 'Log in at the source website',
    description:
      'The user signs in directly with the original website; Reclaim does not receive their password.',
    image: '/images/verification-flow/login.png',
    alt: 'Rippling login screen asking the user to enter their password',
  },
  {
    title: 'Generate the proof',
    description:
      'After login, Reclaim checks the source response and generates a cryptographic proof.',
    image: '/images/verification-flow/generate-proof.png',
    alt: 'Verification progress screen saying this should only take a few seconds',
  },
  {
    title: 'Submit verified fields',
    description:
      'The proof is submitted with only the verified fields needed by the application.',
    image: '/images/verification-flow/complete.png',
    alt: 'Verification completed screen listing verified employment fields',
  },
];

export function VerificationSlideshow() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentSlide = slides[currentIndex];

  function showPrevious() {
    setCurrentIndex((index) => (index === 0 ? slides.length - 1 : index - 1));
  }

  function showNext() {
    setCurrentIndex((index) => (index === slides.length - 1 ? 0 : index + 1));
  }

  return (
    <div className="not-prose my-6 overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-950">
      <div className="flex flex-col gap-4 p-4 sm:p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase text-blue-600 dark:text-blue-400">
              Step {currentIndex + 1} of {slides.length}
            </p>
            <h3 className="mt-1 text-lg font-semibold text-neutral-950 dark:text-neutral-50">
              {currentSlide.title}
            </h3>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-neutral-600 dark:text-neutral-300">
              {currentSlide.description}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={showPrevious}
              aria-label="Previous verification step"
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-neutral-200 text-neutral-700 transition-colors hover:bg-neutral-100 dark:border-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-900"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={showNext}
              aria-label="Next verification step"
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-neutral-200 text-neutral-700 transition-colors hover:bg-neutral-100 dark:border-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-900"
            >
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="overflow-hidden rounded-md border border-neutral-200 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900">
          <img
            src={currentSlide.image}
            alt={currentSlide.alt}
            className="block aspect-[1326/731] w-full object-cover"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {slides.map((slide, index) => {
            const isActive = currentIndex === index;

            return (
              <button
                key={slide.image}
                type="button"
                onClick={() => setCurrentIndex(index)}
                aria-label={`Show verification step ${index + 1}: ${slide.title}`}
                aria-current={isActive ? 'step' : undefined}
                className={
                  isActive
                    ? 'h-2.5 w-8 rounded-full bg-blue-600 transition-all dark:bg-blue-400'
                    : 'h-2.5 w-2.5 rounded-full bg-neutral-300 transition-all hover:bg-neutral-400 dark:bg-neutral-700 dark:hover:bg-neutral-600'
                }
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
