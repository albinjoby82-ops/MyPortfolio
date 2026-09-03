import CadPortal from '@/components/CadPortal';
import { galeForceCadDocument, galeForceCadIsSample } from '@/content/cad';

/**
 * The CAD section on the GaelForce page. Copy changes while the portal is still
 * running on the stand-in model, so the page never implies a sample box is a
 * GaelForce part.
 */
export default function GaleForceCad() {
  return (
    <CadPortal
      document={galeForceCadDocument}
      kicker={galeForceCadIsSample ? 'CAD portal · sample model' : '04 · CAD'}
      title={
        galeForceCadIsSample
          ? 'The CAD portal, waiting on its first export.'
          : 'Click through the CAD the way it was modelled.'
      }
      intro={
        galeForceCadIsSample
          ? 'This is a stand-in model, not a GaelForce part — it is here so the portal can be tried out before the real exports land. Switch between the tabs on the left, hide or solo individual parts, pull the assembly apart, and drive the mates. Real Onshape tabs drop straight in.'
          : 'Every tab in the Onshape document is here: the Part Studios where each part is modelled, and the assembly that puts them together. Hide parts, isolate one, pull the whole thing apart, or drive the mates through the movement they were built for.'
      }
    />
  );
}
