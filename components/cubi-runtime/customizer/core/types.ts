import type { Object3D, Quaternion, Vector3 } from 'three';

export type CustomizerStepId =
  | 'boardColor'
  | 'cubeColor'
  | 'accentColor'
  | 'logoText'
  | 'paintLogo';

export type UploadedLogo = {
  name: string;
  type: 'image/png' | 'image/jpeg' | 'image/webp';
  size: number;
  file: File;
  /** Print-ready SVG selected by the customer from the converter candidates. */
  svg?: string;
  candidateLabel?: string;
};

export type LogoPaintRole = 'main' | 'logo' | 'erase';

export type LogoPaintRegion = {
  id: string;
  role: LogoPaintRole;
  seed: {
    u: number;
    v: number;
  };
};

export type PresetIcon = {
  id: string;
  name: string;
  svgPath: string;
  svg: string;
  /**
   * Manufacturing-only filled variant of `svg`, used by the 3MF export.
   * Stroke-only display icons extrude as overlapping stroke ribbons that
   * weld into cracked solids; this variant expresses the same mark as
   * clean fill-only geometry (no stroke attributes anywhere). On-screen
   * rendering keeps using `svg` unchanged.
   */
  printSvg?: string;
  enabled: boolean;
  custom?: boolean;
};

export type CubeKey = `cube${number}`;
export type CubeIconTargetKey = `${CubeKey}Icon`;

export type CubeIcons = {
  [cube: CubeKey]: PresetIcon;
};

export type CubeLinks = Partial<Record<CubeKey, string>>;

export type ProductCustomizationState = {
  boardColor: string;
  cubeColor: string;
  accentColor: string;
  cubeIconColor: string;
  logoFile?: UploadedLogo;
  /** Text shown on the logo target when no logo is uploaded yet. Defaults to
   * "YOUR LOGO"; marketing surfaces override it (e.g. the homepage's own
   * brand mark) without touching the real customizer's placeholder. */
  logoPlaceholderText?: string;
  selectedPresetIcon?: string | null;
  customText: string;
  textFont: string;
  cubeIcons: CubeIcons;
  cubeLinks: CubeLinks;
  logoPaintRegions: LogoPaintRegion[];
};

export type ProductMeshRoles = {
  board: string[];
  /** Optional structural piece that fits together with the board but must be
   * exported as a separate printable object. */
  base?: string[];
  cubes: string[];
  accent: string[];
  logoZones?: string[];
  textZones?: string[];
  iconZones?: string[][];
  /** Target planes whose authored/derived outward normal needs reversing.
   * Applied centrally so viewer decals and manufacturing insets stay aligned. */
  flippedTargets?: TargetKey[];
  ignored?: string[];
};

export type ProductCustomizerConfig = {
  productId: string;
  productName: string;
  productSlug: string;
  libraryId: string;
  productImages: string[];
  modelPath: string;
  priceLabel?: string;
  shortDescription: string;
  longDescription?: string;
  enabled: boolean;
  comingSoon?: boolean;
  customizerSteps: CustomizerStepId[];
  defaultCustomizationState: ProductCustomizationState;
  meshRoles: ProductMeshRoles;
  /**
   * Optional orientation correction applied to the loaded model root as a
   * quaternion `[x, y, z, w]`. CAD tools (e.g. Fusion 360) often author models
   * Z-up; loaded into three.js's Y-up world they appear tipped on their side.
   * This re-seats the model upright and facing forward. Applied identically by
   * the viewer, the 3MF export, and the order design package so target
   * placement, insets, and printable geometry all stay consistent. Omitted for
   * products already authored Y-up (e.g. the tap boards).
   */
  orientation?: [number, number, number, number];
  cameraDefaults?: {
    position?: [number, number, number];
    target?: [number, number, number];
    zoom?: number;
  };
};

export type TargetKey = 'boardLogo' | 'boardText' | CubeIconTargetKey;

export type TargetPlacement = {
  key: TargetKey;
  sourceName: string;
  position: Vector3;
  quaternion: Quaternion;
  width: number;
  height: number;
};

export type ModelPartInfo = {
  id: string;
  name: string;
  type: string;
  isMesh: boolean;
  materialNames: string[];
  visible: boolean;
  size: [number, number, number];
};

export type DetectedModelParts = {
  board: Object3D[];
  base: Object3D[];
  cubes: Object3D[];
  accent: Object3D[];
  targets: Partial<Record<TargetKey, Object3D>>;
};

export type ViewerModelReport = {
  parts: ModelPartInfo[];
  detectedNames: {
    board?: string;
    cubes: string[];
    targets: Partial<Record<TargetKey, string>>;
  };
  missingTargets: TargetKey[];
  targetPlacements: Partial<
    Record<TargetKey, { width: number; height: number; sourceName: string }>
  >;
};

export type Product3DViewerProps = {
  config: ProductCustomizerConfig;
  customization: ProductCustomizationState;
  logoPaintRole?: LogoPaintRole;
  onLogoPaintRegion?: (region: LogoPaintRegion) => void;
  meshRoleOverrides?: Partial<ProductMeshRoles>;
  onModelReport?: (report: ViewerModelReport | undefined) => void;
};

export function cloneCustomizationState(
  state: ProductCustomizationState,
): ProductCustomizationState {
  return {
    ...state,
    logoFile: state.logoFile ? { ...state.logoFile } : undefined,
    cubeIcons: Object.fromEntries(
      Object.entries(state.cubeIcons).map(([cube, icon]) => [
        cube,
        { ...icon },
      ]),
    ) as CubeIcons,
    cubeLinks: { ...state.cubeLinks },
    logoPaintRegions: state.logoPaintRegions.map((region) => ({
      ...region,
      seed: { ...region.seed },
    })),
  };
}
