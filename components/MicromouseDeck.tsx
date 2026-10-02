import './MicromouseDeck.css';

/**
 * The Micromouse sponsorship deck, embedded as a PDF window in the same style
 * as the GaelForce decks.
 */
export default function MicromouseDeck() {
  return (
    <div className="mmdWindow">
      <div className="mmdBar">
        <span>DUBLIN MICROMOUSE OPEN · SPONSORSHIP DECK</span>
        <a href="/projects/micromouse/sponsorship-deck.pdf" download>
          Download PDF ↗
        </a>
      </div>
      <iframe
        src="/projects/micromouse/sponsorship-deck.pdf#view=FitH&navpanes=0"
        title="Dublin Micromouse Open sponsorship deck"
        loading="lazy"
      />
    </div>
  );
}
