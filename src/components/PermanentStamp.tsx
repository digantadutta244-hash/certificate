import React, { useId } from 'react';

interface PermanentStampProps {
  className?: string;
}

/**
 * Permanent Company Stamp & Proprietor Signature:
 * - Blue rubber stamp:
 *   "For,
 *                Proprietor
 *
 *   M/s. SS Enterprise, Darrang"
 * - Authentic handwritten Proprietor signature placed in the middle of the seal.
 */
export const PermanentStamp: React.FC<PermanentStampProps> = ({ className = '' }) => {
  const filterId = useId();
  const stampFilterId = `rubber-stamp-ink-${filterId.replace(/:/g, '')}`;
  const penFilterId = `pen-ink-${filterId.replace(/:/g, '')}`;

  return (
    <div
      className={`select-none pointer-events-none inline-block ${className}`}
      aria-label="Permanent Company Stamp and Authorized Signature: For, Proprietor, M/s. SS Enterprise, Darrang"
    >
      <svg
        viewBox="0 0 350 148"
        className="w-full h-auto overflow-visible"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Subtle authentic rubber stamp ink texture */}
          <filter id={stampFilterId} x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.06"
              numOctaves="3"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="1.15"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>

          {/* Subtle ballpoint pen ink texture */}
          <filter id={penFilterId} x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.09"
              numOctaves="2"
              result="penNoise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="penNoise"
              scale="0.55"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>

        {/* RUBBER STAMP LAYER (Blue Stamp Ink) */}
        <g
          filter={`url(#${stampFilterId})`}
          fill="#1d4ed8"
          style={{
            fontFamily: "'Arial Narrow', 'Roboto Condensed', 'Plus Jakarta Sans', sans-serif",
          }}
        >
          {/* Top-left: "For," */}
          <text
            x="20"
            y="30"
            fontSize="24"
            fontWeight="700"
            letterSpacing="0.4"
            transform="rotate(-1.1 20 30)"
          >
            For,
          </text>

          {/* Center-top: "Proprietor" */}
          <text
            x="118"
            y="45"
            fontSize="23.5"
            fontWeight="700"
            letterSpacing="0.6"
            transform="rotate(-1.2 118 45)"
          >
            Proprietor
          </text>

          {/* Bottom line: "M/s. SS Enterprise, Darrang" */}
          <text
            x="18"
            y="132"
            fontSize="25"
            fontWeight="700"
            letterSpacing="0.5"
            transform="rotate(-1.3 170 132)"
          >
            M/s. SS Enterprise, Darrang
          </text>
        </g>

        {/* HANDWRITTEN PROPRIETOR SIGNATURE IN THE MIDDLE OF THE SEAL */}
        {/* Exact vector trace of uploaded signature (rotated to horizontal baseline) */}
        <g
          filter={`url(#${penFilterId})`}
          transform="translate(54, 33) rotate(-2) scale(0.30, -0.22) translate(-90, -570)"
          fill="none"
          stroke="#171926"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Main Capital Initial & Long Spine */}
          <path
            d="M 248 212 L 345 534 L 345 314 C 345 305 122 268 122 268 L 456 428 L 382 392"
            strokeWidth="12.5"
          />

          {/* Crossbar on Initial */}
          <path d="M 383 310 L 380 460" strokeWidth="11.5" />

          {/* Cursive Wave Body + Long Baseline + Tall Ascender Loop */}
          <path
            d="M 385 385
               C 398 355, 405 333, 412 333
               C 420 333, 422 385, 428 385
               C 435 385, 445 333, 454 333
               C 462 333, 464 388, 470 388
               C 478 388, 488 342, 495 342
               C 503 342, 507 394, 512 394
               C 518 394, 522 362, 526 362
               C 535 375, 545 388, 555 392
               L 628 418
               C 628 395, 628 383, 628 383
               C 630 430, 632 532, 638 532
               C 650 532, 658 505, 656 475
               C 654 445, 638 424, 628 418
               L 828 466"
            strokeWidth="12"
          />

          {/* Final Terminal Flourish & Cross */}
          <path
            d="M 792 412 L 810 542 L 838 438 L 795 442"
            strokeWidth="11.5"
          />
          <path
            d="M 838 468 L 858 408"
            strokeWidth="11.5"
          />

          {/* Terminal Signature Dot / Hook */}
          <path
            d="M 835 538 L 850 552 L 856 532"
            strokeWidth="12"
          />
        </g>
      </svg>
    </div>
  );
};
