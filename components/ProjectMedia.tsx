import type { GalleryImage, VideoItem } from '@/lib/gallery';
import './ProjectMedia.css';

/** Photos and videos for a project page, laid out as a mosaic and a video wall. */
export default function ProjectMedia({
  photos,
  videos,
  photosTitle = 'Photos',
  videosTitle = 'Videos',
}: {
  photos: (GalleryImage & { alt: string })[];
  videos: VideoItem[];
  photosTitle?: string;
  videosTitle?: string;
}) {
  if (photos.length === 0 && videos.length === 0) return null;
  return (
    <section className="pb-14 gutter pmSection">
      {photos.length > 0 && (
        <>
          <h2 className="eyebrow mb-[18px] block">{photosTitle}</h2>
          <div className="pmPhotos" data-count={photos.length} data-many={photos.length > 5}>
            {photos.map((p) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={p.src} src={p.src} alt={p.alt} loading="lazy" />
            ))}
          </div>
        </>
      )}
      {videos.length > 0 && (
        <>
          <h2 className="eyebrow mb-[18px] mt-12 block">{videosTitle}</h2>
          <div className="pmVideos">
            {videos.map((v) => (
              <video
                key={v.src}
                className="pmVideo"
                src={v.src}
                poster={v.poster}
                controls
                playsInline
                preload="none"
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
