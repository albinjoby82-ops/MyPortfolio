import CadPortal from './CadPortal';
import { gaelForceCadDocuments } from '@/content/cad';

export default function GaelForceCad() {
  return <>{gaelForceCadDocuments.filter((doc) => doc.tabs.length > 0).map((doc) => (
    <CadPortal key={doc.id} document={doc} compact kicker="CAD studies"
      title={doc.name} intro={doc.summary} />
  ))}</>;
}
