import {
  PROVIDER_LABEL,
  TAB_KIND_LABEL,
  onshapeEmbedUrl,
  type CadDocument,
} from '@/lib/cad';
import CadModelViewer from './CadModelViewer';
import './CadPortal.css';

type Props = {
  document: CadDocument;
  title?: string;
  kicker?: string;
  intro?: string;
  compact?: boolean;
};

export default function CadPortal({
  document,
  title,
  kicker,
  intro,
  compact = false,
}: Props) {
  const tab = document.tabs[0];
  const embed = tab?.embed ? onshapeEmbedUrl(tab.embed) : undefined;
  const model = tab?.model;
  const sourceUrl = tab?.href ?? document.href;
  const provider = PROVIDER_LABEL[document.provider];

  return (
    <section className={compact ? 'cadPortal cadPortal--compact' : 'cadPortal gutter'}>
      <div className="cadPortalInner">
        <div className="cadPortalHeading">
          <span className="cadKicker">{kicker ?? 'Interactive CAD'}</span>
          <div>
            <h3>{title ?? document.name}</h3>
            {intro && <p>{intro}</p>}
          </div>
        </div>

        <div className="cadWindow">
          <div className="cadWindowBar">
            <span>{provider.toUpperCase()} · INTERACTIVE CAD</span>
            {sourceUrl && (
              <a href={sourceUrl} target="_blank" rel="noreferrer">
                Open in {provider} ↗
              </a>
            )}
          </div>

          <div className="cadWindowTitlebar">
            <div>
              <span>{tab ? TAB_KIND_LABEL[tab.kind] : 'CAD model'}</span>
              <strong>{tab?.name ?? document.name}</strong>
            </div>
            <span className="cadLiveStatus">
              <i aria-hidden="true" /> {embed ? 'Live viewer' : model ? 'Interactive model' : 'Viewer ready'}
            </span>
          </div>

          <div className="cadStage">
            {embed ? (
              <iframe
                src={embed}
                title={`${document.name} interactive CAD model`}
                loading="lazy"
                allow="fullscreen; xr-spatial-tracking"
                allowFullScreen
              />
            ) : model ? (
              <CadModelViewer src={model} name={document.name} />
            ) : (
              <div className="cadWaiting">
                <div className="cadWaitingGrid" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </div>
                <span className="cadWaitingLabel">Onshape-connected model</span>
                <strong>{document.name}</strong>
                <p>The interactive assembly will appear here once its published viewer is connected.</p>
              </div>
            )}
          </div>

          <div className="cadWindowFoot">
            <span>{embed || model ? 'Drag to rotate · scroll or pinch to zoom · right-drag to pan' : 'Interactive assembly window'}</span>
            <span>Source of truth · Onshape</span>
          </div>
        </div>
      </div>
    </section>
  );
}
