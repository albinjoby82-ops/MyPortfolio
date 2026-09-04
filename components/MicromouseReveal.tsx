import './MicromouseReveal.css';
import type { Media } from '@/lib/projects';

/**
 * Hero for the Dublin Micromouse Open detail page.
 *
 * The default hero slot crops its media to 16/8 with object-cover, which would
 * cut the lockup out of a 16/9 reveal animation. This keeps the film whole on
 * the campaign's own near-black ground and puts the event line beside it.
 */
export default function MicromouseReveal({ media }: { media: Media }) {
  return (
    <div className="mmReveal">
      <div className="mmRevealBar">
        <span>ELECSOC · EVENT REVEAL</span>
        <span>BUILD IT. CODE IT. RACE IT.</span>
      </div>

      <div className="mmRevealStage">
        {media.src && (
          <video controls playsInline muted preload="metadata" poster={media.poster}>
            <source src={media.src} type="video/mp4" />
            Your browser does not support MP4 video playback.
          </video>
        )}
      </div>

      <div className="mmRevealMeta">
        <span>Sat 26 Sept 2026</span>
        <span>UCD Village, UCD</span>
        <span>Hosted by UCD ElecSoc</span>
      </div>
    </div>
  );
}
