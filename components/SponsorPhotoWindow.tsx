'use client';

import { useState } from 'react';
import './SponsorPhotoWindow.css';

export type SponsorPhoto = {
  src: string;
  alt: string;
  caption?: string;
};

type Props = {
  photos: SponsorPhoto[];
};

export default function SponsorPhotoWindow({ photos }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const hasPhotos = photos.length > 0;
  const activePhoto = hasPhotos ? photos[activeIndex] : undefined;

  function showPrevious() {
    setActiveIndex((current) =>
      current === 0 ? photos.length - 1 : current - 1,
    );
  }

  function showNext() {
    setActiveIndex((current) =>
      current === photos.length - 1 ? 0 : current + 1,
    );
  }

  return (
    <figure className="sponsorPhotoWindow">
      <div className="sponsorPhotoWindowBar">
        <span>SPONSORSHIP DELIVERIES · PHOTO LOG</span>
        {hasPhotos && (
          <span aria-live="polite">
            {String(activeIndex + 1).padStart(2, '0')} /{' '}
            {String(photos.length).padStart(2, '0')}
          </span>
        )}
      </div>

      <div className="sponsorPhotoViewport">
        {activePhoto ? (
          <img src={activePhoto.src} alt={activePhoto.alt} />
        ) : (
          <div className="sponsorPhotoEmpty">
            <span aria-hidden="true">＋</span>
            <strong>Sponsorship photos ready to add</strong>
            <p>Delivery and unboxing photos will appear here.</p>
          </div>
        )}

        {photos.length > 1 && (
          <div className="sponsorPhotoControls">
            <button
              type="button"
              onClick={showPrevious}
              aria-label="Show previous sponsorship photo"
            >
              ←
            </button>
            <button
              type="button"
              onClick={showNext}
              aria-label="Show next sponsorship photo"
            >
              →
            </button>
          </div>
        )}
      </div>

      {activePhoto?.caption && (
        <figcaption>{activePhoto.caption}</figcaption>
      )}

      {photos.length > 1 && (
        <div className="sponsorPhotoDots" aria-label="Choose sponsorship photo">
          {photos.map((photo, index) => (
            <button
              key={photo.src}
              type="button"
              className={index === activeIndex ? 'isActive' : undefined}
              onClick={() => setActiveIndex(index)}
              aria-label={`Show photo ${index + 1}`}
              aria-current={index === activeIndex ? 'true' : undefined}
            />
          ))}
        </div>
      )}
    </figure>
  );
}
