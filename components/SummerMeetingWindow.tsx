'use client';

import { useRef, useState, type TouchEvent } from 'react';
import './SummerMeetingWindow.css';

const SUMMER_PHOTOS = [
  {
    src: '/projects/galeforce/summer-meetings/meeting-01.jpeg',
    alt: 'GaelForce members reviewing robot concepts during a summer meeting',
    caption: 'Reviewing drivetrain ideas during a summer design meeting.',
  },
  {
    src: '/projects/galeforce/summer-meetings/meeting-02.jpeg',
    alt: 'GaelForce members testing electronics and prototype hardware in the lab',
    caption: 'Testing electronics and prototype hardware in the lab.',
  },
  {
    src: '/projects/galeforce/summer-meetings/meeting-03.jpeg',
    alt: 'A GaelForce member sketching mechanism ideas on a whiteboard',
    caption: 'Sketching mechanism ideas during a design session.',
  },
  {
    src: '/projects/galeforce/summer-meetings/meeting-04.jpeg',
    alt: 'GaelForce members sorting and assembling 3D-printed prototype parts',
    caption: 'Sorting and assembling 3D-printed prototype parts.',
  },
  {
    src: '/projects/galeforce/summer-meetings/meeting-05.jpeg',
    alt: 'A GaelForce member unpacking tools and supplies for prototype work',
    caption: 'Unpacking tools and supplies for prototype work.',
  },
  {
    src: '/projects/galeforce/summer-meetings/meeting-06.jpeg',
    alt: 'A GaelForce member working with equipment in the engineering workshop',
    caption: 'Working with equipment in the engineering workshop.',
  },
  {
    src: '/projects/galeforce/summer-meetings/meeting-07.jpeg',
    alt: 'GaelForce members planning the next stage of the robot build',
    caption: 'Planning the next stage of the robot build.',
  },
];

export default function SummerMeetingWindow() {
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const activePhoto = SUMMER_PHOTOS[activeIndex];

  function showPrevious() {
    setActiveIndex((current) =>
      current === 0 ? SUMMER_PHOTOS.length - 1 : current - 1,
    );
  }

  function showNext() {
    setActiveIndex((current) =>
      current === SUMMER_PHOTOS.length - 1 ? 0 : current + 1,
    );
  }

  function handleTouchStart(event: TouchEvent<HTMLDivElement>) {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  }

  function handleTouchEnd(event: TouchEvent<HTMLDivElement>) {
    if (touchStartX.current === null) return;

    const endX = event.changedTouches[0]?.clientX ?? touchStartX.current;
    const distance = endX - touchStartX.current;
    touchStartX.current = null;

    if (Math.abs(distance) < 45) return;
    if (distance > 0) showPrevious();
    else showNext();
  }

  return (
    <figure className="summerMeetingWindow">
      <div className="summerMeetingWindowBar">
        <span>GAELFORCE · SUMMER WORK LOG</span>
        <span aria-live="polite">
          {String(activeIndex + 1).padStart(2, '0')} /{' '}
          {String(SUMMER_PHOTOS.length).padStart(2, '0')}
        </span>
      </div>

      <div
        className="summerMeetingViewport"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <img
          className="summerMeetingBackdrop"
          src={activePhoto.src}
          alt=""
          aria-hidden="true"
        />
        <img
          key={activePhoto.src}
          className="summerMeetingPhoto"
          src={activePhoto.src}
          alt={activePhoto.alt}
        />

        <div className="summerMeetingControls">
          <button type="button" onClick={showPrevious} aria-label="Show previous summer photo">
            ←
          </button>
          <button type="button" onClick={showNext} aria-label="Show next summer photo">
            →
          </button>
        </div>
      </div>

      <figcaption>{activePhoto.caption}</figcaption>

      <div className="summerMeetingDots" aria-label="Choose summer work photo">
        {SUMMER_PHOTOS.map((photo, index) => (
          <button
            key={photo.src}
            type="button"
            className={index === activeIndex ? 'isActive' : undefined}
            onClick={() => setActiveIndex(index)}
            aria-label={`Show summer photo ${index + 1}`}
            aria-current={index === activeIndex ? 'true' : undefined}
          />
        ))}
      </div>
    </figure>
  );
}
