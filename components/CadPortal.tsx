'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import {
  PROVIDER_LABEL,
  TAB_KIND_LABEL,
  onshapeEmbedUrl,
  type CadDocument,
} from '@/lib/cad';
import './CadPortal.css';

const CadModelViewer = dynamic(() => import('./CadModelViewer'), {
  ssr: false,
  loading: () => <div className="cadModelFallback">Loading CAD…</div>,
});

export default function CadPortal({ document }: { document: CadDocument }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const tab = document.tabs[0];
  const embed = tab?.embed ? onshapeEmbedUrl(tab.embed) : undefined;
  const model = tab?.model;
  const sourceUrl = tab?.href ?? document.href;
  const provider = PROVIDER_LABEL[document.provider];

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    if (open && !element.open) element.showModal();
    if (!open && element.open) element.close();
  }, [open]);

  return (
    <>
      <button
        type="button"
        className="cadCard"
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
      >
        <span className="cadCardBar">
          <span>{provider.toUpperCase()} · CAD</span>
          <span>OPEN ↗</span>
        </span>
        <span className="cadCardPreview">
          {tab?.poster ? (
            <img src={tab.poster} alt={`${document.name} CAD preview`} />
          ) : (
            <span className="cadCardBlueprint" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
          )}
        </span>
        <span className="cadCardCopy">
          <span>{tab ? TAB_KIND_LABEL[tab.kind] : 'CAD model'}</span>
          <strong>{document.name}</strong>
          {document.summary && <em>{document.summary}</em>}
        </span>
      </button>

      <dialog
        ref={dialog}
        className="cadDialog"
        onClose={() => setOpen(false)}
        onClick={(event) => {
          if (event.target === event.currentTarget) setOpen(false);
        }}
      >
        <div className="cadDialogWindow">
          <div className="cadWindowBar">
            <span>{provider.toUpperCase()} · INTERACTIVE CAD</span>
            <div>
              {sourceUrl && (
                <a href={sourceUrl} target="_blank" rel="noreferrer">
                  Open in {provider} ↗
                </a>
              )}
              <button type="button" onClick={() => setOpen(false)} aria-label="Close CAD viewer">
                Close ×
              </button>
            </div>
          </div>

          <div className="cadWindowTitlebar">
            <div>
              <span>{tab ? TAB_KIND_LABEL[tab.kind] : 'CAD model'}</span>
              <strong>{document.name}</strong>
            </div>
            <span className="cadLiveStatus">
              <i aria-hidden="true" /> {embed ? 'Live viewer' : model ? 'Interactive model' : 'Viewer pending'}
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
            ) : model && open ? (
              <CadModelViewer src={model} name={document.name} />
            ) : (
              <div className="cadModelFallback">Interactive model coming soon.</div>
            )}
          </div>

          <div className="cadWindowFoot">
            <span>{embed || model ? 'Drag to rotate · right-drag to pan' : 'Interactive assembly window'}</span>
            <span>Source of truth · Onshape</span>
          </div>
        </div>
      </dialog>
    </>
  );
}
