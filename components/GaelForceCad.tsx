import CadPortal from './CadPortal';
import { gaelForceCadDocuments } from '@/content/cad';
import './CadPortal.css';

export default function GaelForceCad() {
  return (
    <section className="cadGallery" aria-labelledby="cad-gallery-title">
      <div className="cadGalleryHeading">
        <span className="cadKicker">CAD studies</span>
        <div>
          <h3 id="cad-gallery-title">CAD iterations</h3>
          <p>Open a model to inspect it. New iterations can be added here as the design develops.</p>
        </div>
      </div>
      <div className="cadGrid">
        {gaelForceCadDocuments.filter((document) => document.tabs.length > 0).map((document) => (
          <CadPortal key={document.id} document={document} />
        ))}
      </div>
    </section>
  );
}
