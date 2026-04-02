'use client';

import { useState } from 'react';

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  size?: number;
  readonly?: boolean;
}

export default function StarRating({ rating, onRatingChange, size = 24, readonly = false }: StarRatingProps) {
  const [hover, setHover] = useState(0);

  return (
    <div style={{ display: 'flex', gap: '4px' }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => !readonly && onRatingChange?.(star)}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => !readonly && setHover(0)}
          style={{
            fontSize: `${size}px`,
            color: (hover || rating) >= star ? 'var(--secondary)' : '#E9ECEF',
            transition: 'color 0.2s',
            cursor: readonly ? 'default' : 'pointer',
            padding: '2px'
          }}
        >
          ★
        </button>
      ))}
    </div>
  );
}
