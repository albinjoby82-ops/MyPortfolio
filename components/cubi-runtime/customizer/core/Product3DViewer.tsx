import { Bounds, ContactShadows, OrbitControls } from '@react-three/drei';
import { Canvas, type ThreeEvent } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import { DoubleSide, Object3D } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import ViewerLights from '../../components/Product3DViewer/ViewerLights';
import type { SvgCanvasTexture } from '../../utils/svgToTexture';
import {
  applyMaterialColour,
  applyModelOrientation,
  cloneSceneMaterials,
  createPlaneForTarget,
  detectModelParts,
  disposeSceneMaterials,
  getTargetKeys,
  inspectModelParts,
} from './modelSceneUtils';
import {
  createPaintableSvgDecalTexture,
  createSvgDecalTexture,
  paintSvgRegion,
} from './svgDecalUtils';
import { createTextDecalTexture } from './textDecalUtils';
import { getMasterFont } from '../config/masterFonts';
import type {
  CubeIconTargetKey,
  CubeKey,
  DetectedModelParts,
  LogoPaintRegion,
  LogoPaintRole,
  Product3DViewerProps,
  ProductMeshRoles,
  TargetPlacement,
  ViewerModelReport,
} from './types';

type ModelStatus =
  | { kind: 'loading' }
  | { kind: 'ready'; report: ViewerModelReport }
  | { kind: 'error'; message: string };

function SvgTargetPlane({
  placement,
  svg,
  colour,
  paintable = false,
  paintRole,
  paintRegions = [],
  mainColour,
  onPaintRegion,
}: {
  placement: TargetPlacement;
  svg: string;
  colour: string;
  paintable?: boolean;
  paintRole?: LogoPaintRole;
  paintRegions?: LogoPaintRegion[];
  mainColour?: string;
  onPaintRegion?: (region: LogoPaintRegion) => void;
}) {
  const [textureState, setTextureState] = useState<SvgCanvasTexture>();
  const paintRegionSignature = JSON.stringify(paintRegions);
  const baseSignature = `${paintable ? 'paint' : 'flat'}|${colour}|${mainColour ?? ''}|${svg}`;
  // Rasterizing the SVG and rebuilding the paint edge mask is expensive, so
  // this tracks what the live canvas already shows: pointer paints are applied
  // incrementally in handlePaint, and the resulting state round-trip must not
  // rebuild the texture from scratch.
  const appliedRef = useRef<{ base: string; regions: string } | undefined>(
    undefined,
  );
  const textureStateRef = useRef<SvgCanvasTexture | undefined>(undefined);

  useEffect(() => {
    const previous = textureStateRef.current;

    if (previous && previous !== textureState) {
      previous.texture.dispose();
    }

    textureStateRef.current = textureState;
  }, [textureState]);

  useEffect(
    () => () => {
      textureStateRef.current?.texture.dispose();
      textureStateRef.current = undefined;
    },
    [],
  );

  useEffect(() => {
    if (
      textureStateRef.current &&
      appliedRef.current?.base === baseSignature &&
      appliedRef.current.regions === paintRegionSignature
    ) {
      return undefined;
    }

    let active = true;

    const createTexture = paintable
      ? createPaintableSvgDecalTexture(svg, colour)
      : createSvgDecalTexture(svg, colour);

    createTexture
      .then((result) => {
        if (!active) {
          result.texture.dispose();
          return;
        }

        if (paintable) {
          paintRegions.forEach((region) => {
            const regionColour =
              region.role === 'main'
                ? mainColour
                : region.role === 'logo'
                  ? colour
                  : undefined;
            paintSvgRegion(
              result,
              region.seed.u,
              region.seed.v,
              regionColour,
            );
          });
        }

        appliedRef.current = {
          base: baseSignature,
          regions: paintRegionSignature,
        };
        setTextureState(result);
      })
      .catch(() => {
        if (active) {
          appliedRef.current = undefined;
          setTextureState(undefined);
        }
      });

    return () => {
      active = false;
    };
    // The two signatures cover svg/colour/mainColour/paintable/paintRegions.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseSignature, paintRegionSignature]);

  const handlePaint = (event: ThreeEvent<PointerEvent>) => {
    if (
      !paintable ||
      !paintRole ||
      !textureState ||
      !event.uv ||
      !onPaintRegion
    ) {
      return;
    }

    event.stopPropagation();
    const regionColour =
      paintRole === 'main'
        ? mainColour
        : paintRole === 'logo'
          ? colour
          : undefined;
    const seed = paintSvgRegion(
      textureState,
      event.uv.x,
      1 - event.uv.y,
      regionColour,
    );

    if (seed) {
      const region: LogoPaintRegion = {
        id: crypto.randomUUID(),
        role: paintRole,
        seed,
      };

      // The live canvas already shows this paint; record it so the state
      // update coming back from the parent skips the texture rebuild.
      appliedRef.current = {
        base: baseSignature,
        regions: JSON.stringify([...paintRegions, region]),
      };
      onPaintRegion(region);
    }
  };

  const fittedSize = useMemo(() => {
    if (!textureState) {
      return [placement.width, placement.height] as const;
    }

    const targetAspect = placement.width / placement.height;

    if (textureState.aspectRatio >= targetAspect) {
      return [
        placement.width,
        placement.width / textureState.aspectRatio,
      ] as const;
    }

    return [
      placement.height * textureState.aspectRatio,
      placement.height,
    ] as const;
  }, [placement.height, placement.width, textureState]);

  if (!textureState) {
    return null;
  }

  return (
    <mesh
      position={placement.position}
      quaternion={placement.quaternion}
      renderOrder={10}
      onPointerDown={handlePaint}
    >
      <planeGeometry args={[fittedSize[0], fittedSize[1]]} />
      <meshBasicMaterial
        map={textureState.texture}
        transparent
        alphaTest={0.02}
        depthWrite={false}
        polygonOffset
        polygonOffsetFactor={-4}
        side={DoubleSide}
        toneMapped={false}
      />
    </mesh>
  );
}

function TextTargetPlane({
  placement,
  text,
  colour,
  fontFamily,
}: {
  placement: TargetPlacement;
  text: string;
  colour: string;
  fontFamily: string;
}) {
  const texture = useMemo(
    () =>
      createTextDecalTexture(
        text,
        colour,
        placement.width / placement.height,
        fontFamily,
      ),
    [colour, fontFamily, placement.height, placement.width, text],
  );

  useEffect(() => () => texture.dispose(), [texture]);

  if (!text.trim()) {
    return null;
  }

  return (
    <mesh
      position={placement.position}
      quaternion={placement.quaternion}
      renderOrder={10}
    >
      <planeGeometry args={[placement.width, placement.height]} />
      <meshBasicMaterial
        map={texture}
        transparent
        alphaTest={0.02}
        depthWrite={false}
        polygonOffset
        polygonOffsetFactor={-4}
        side={DoubleSide}
        toneMapped={false}
      />
    </mesh>
  );
}

function ProductModel({
  props,
  onStatusChange,
}: {
  props: Product3DViewerProps;
  onStatusChange: (status: ModelStatus) => void;
}) {
  const [scene, setScene] = useState<Object3D>();
  const [placements, setPlacements] = useState<
    Partial<Record<TargetPlacement['key'], TargetPlacement>>
  >({});
  // Role detection walks the whole scene several times; it is done once at
  // load and cached. Mesh-role changes remount this component via modelKey.
  const detectedRef = useRef<DetectedModelParts | undefined>(undefined);

  useEffect(() => {
    let active = true;
    let loadedScene: Object3D | undefined;
    const loader = new GLTFLoader();
    onStatusChange({ kind: 'loading' });

    loader.load(
      props.config.modelPath,
      (gltf) => {
        if (!active) {
          return;
        }

        loadedScene = gltf.scene.clone(true);
        cloneSceneMaterials(loadedScene);
        applyModelOrientation(loadedScene, props.config.orientation);
        loadedScene.updateMatrixWorld(true);
        const detected = detectModelParts(loadedScene, props.config.meshRoles);
        detectedRef.current = detected;
        const targetKeys = getTargetKeys(props.config.meshRoles);
        const nextPlacements: Partial<
          Record<TargetPlacement['key'], TargetPlacement>
        > = {};

        // A target that also serves as a visible body (e.g. a tap cap that both
        // positions the icon and is itself printed) must stay visible; only
        // pure placeholder targets (logo/text planes) are hidden.
        const bodySet = new Set<Object3D>([
          ...detected.board,
          ...detected.base,
          ...detected.cubes,
          ...detected.accent,
        ]);

        targetKeys.forEach((key) => {
          const target = detected.targets[key];

          if (target) {
            nextPlacements[key] = createPlaneForTarget(target, 0.86, key);
            if (!bodySet.has(target)) {
              target.visible = false;
            }
          }
        });

        detected.board.forEach((boardPart) => {
          applyMaterialColour(
            boardPart,
            props.customization.boardColor,
          );
        });

        detected.base.forEach((basePart) => {
          applyMaterialColour(basePart, props.customization.boardColor);
        });

        detected.cubes.forEach((cube) => {
          applyMaterialColour(cube, props.customization.cubeColor);
        });

        detected.accent.forEach((accent) => {
          applyMaterialColour(accent, props.customization.accentColor);
        });

        const report: ViewerModelReport = {
          parts: inspectModelParts(loadedScene),
          detectedNames: {
            board: detected.board[0]?.name,
            cubes: detected.cubes.map((cube) => cube.name),
            targets: Object.fromEntries(
              Object.entries(detected.targets)
                .filter((entry) => Boolean(entry[1]))
                .map(([key, object]) => [key, object?.name]),
            ),
          },
          missingTargets: targetKeys.filter(
            (key) => !detected.targets[key],
          ),
          targetPlacements: Object.fromEntries(
            Object.entries(nextPlacements)
              .filter((entry) => Boolean(entry[1]))
              .map(([key, placement]) => [
                key,
                {
                  width: placement?.width ?? 0,
                  height: placement?.height ?? 0,
                  sourceName: placement?.sourceName ?? '',
                },
              ]),
          ),
        };

        setPlacements(nextPlacements);
        setScene(loadedScene);
        onStatusChange({ kind: 'ready', report });
      },
      undefined,
      () => {
        if (active) {
          console.warn(
            `[customizer] Could not load ${props.config.productName} model from ${props.config.modelPath}.`,
          );
          onStatusChange({
            kind: 'error',
            message: '3D model not added yet.',
          });
        }
      },
    );

    return () => {
      active = false;

      if (loadedScene) {
        disposeSceneMaterials(loadedScene);
      }
    };
    // The model is loaded once; colour updates are handled below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const detected = detectedRef.current;

    if (!scene || !detected) {
      return;
    }

    detected.board.forEach((boardPart) => {
      applyMaterialColour(boardPart, props.customization.boardColor);
    });

    detected.base.forEach((basePart) => {
      applyMaterialColour(basePart, props.customization.boardColor);
    });

    detected.cubes.forEach((cube) => {
      applyMaterialColour(cube, props.customization.cubeColor);
    });

    detected.accent.forEach((accent) => {
      applyMaterialColour(accent, props.customization.accentColor);
    });
  }, [
    props.customization.accentColor,
    props.customization.boardColor,
    props.customization.cubeColor,
    scene,
  ]);

  if (!scene) {
    return null;
  }

  const iconPlanes = Object.entries(placements).map(([key, placement]) => {
    if (
      !placement ||
      !/^cube\d+Icon$/.test(key)
    ) {
      return null;
    }

    const target = key as CubeIconTargetKey;
    const cube = key.slice(0, -4) as CubeKey;
    const icon = props.customization.cubeIcons[cube];

    if (!icon) {
      return null;
    }

    return (
      <SvgTargetPlane
        key={target}
        placement={placement}
        svg={icon.svg}
        colour={props.customization.cubeIconColor}
      />
    );
  });

  // maxDuration is set far below drei's 1s default: `fit` still auto-sizes
  // the camera to the model (needed — models vary in scale, and a fixed
  // cameraDefaults distance left some tiny in frame), but a near-instant
  // fit has no visible pop-in to interrupt, and finishes before a user's
  // drag/scroll could land mid-animation and race Bounds' own OrbitControls
  // handoff logic (the crash from a visible, second-long fly-to).
  return (
    <Bounds fit clip margin={1.25} maxDuration={0.05}>
      <group>
        <primitive object={scene} />
        {placements.boardLogo && props.customization.logoFile?.svg ? (
          <SvgTargetPlane
            placement={placements.boardLogo}
            svg={props.customization.logoFile.svg}
            colour={props.customization.accentColor}
            paintable
            paintRole={props.logoPaintRole}
            paintRegions={props.customization.logoPaintRegions}
            mainColour={props.customization.boardColor}
            onPaintRegion={props.onLogoPaintRegion}
          />
        ) : placements.boardLogo ? (
          <TextTargetPlane
            placement={placements.boardLogo}
            text={props.customization.logoPlaceholderText ?? 'YOUR LOGO'}
            colour={props.customization.accentColor}
            fontFamily="Arial, sans-serif"
          />
        ) : null}
        {placements.boardText ? (
          <TextTargetPlane
            placement={placements.boardText}
            text={props.customization.customText}
            colour={props.customization.accentColor}
            fontFamily={
              getMasterFont(props.customization.textFont).cssFontFamily
            }
          />
        ) : null}
        {iconPlanes}
      </group>
    </Bounds>
  );
}

function mergeMeshRoles(
  base: ProductMeshRoles,
  overrides?: Partial<ProductMeshRoles>,
): ProductMeshRoles {
  return {
    board: overrides?.board?.length ? overrides.board : base.board,
    base: overrides?.base?.length ? overrides.base : base.base,
    cubes: overrides?.cubes?.length ? overrides.cubes : base.cubes,
    accent: overrides?.accent?.length ? overrides.accent : base.accent,
    logoZones: overrides?.logoZones?.length
      ? overrides.logoZones
      : base.logoZones,
    textZones: overrides?.textZones?.length
      ? overrides.textZones
      : base.textZones,
    iconZones: overrides?.iconZones?.some((zone) => zone.length)
      ? overrides.iconZones
      : base.iconZones,
    flippedTargets: overrides?.flippedTargets?.length
      ? overrides.flippedTargets
      : base.flippedTargets,
    ignored: overrides?.ignored?.length ? overrides.ignored : base.ignored,
  };
}

export default function Product3DViewer(props: Product3DViewerProps) {
  const [status, setStatus] = useState<ModelStatus>({ kind: 'loading' });

  useEffect(() => {
    props.onModelReport?.(
      status.kind === 'ready' ? status.report : undefined,
    );
  }, [props.onModelReport, status]);

  const modelSpan =
    status.kind === 'ready'
      ? Math.max(
          0.001,
          ...status.report.parts.flatMap((part) => part.size),
        )
      : 1;
  const minimumCameraDistance = Math.max(0.001, modelSpan * 0.28);
  const maximumCameraDistance = Math.max(
    minimumCameraDistance * 4,
    modelSpan * 24,
  );
  // Stable identities matter here: ProductModel effects key off the config
  // object, and modelKey remounts the model when the resolved roles change.
  const resolvedMeshRoles = useMemo(
    () => mergeMeshRoles(props.config.meshRoles, props.meshRoleOverrides),
    [props.config.meshRoles, props.meshRoleOverrides],
  );
  const resolvedConfig = useMemo(
    () => ({ ...props.config, meshRoles: resolvedMeshRoles }),
    [props.config, resolvedMeshRoles],
  );
  const modelKey = useMemo(
    () => `${props.config.productId}:${JSON.stringify(resolvedMeshRoles)}`,
    [props.config.productId, resolvedMeshRoles],
  );
  const resolvedProps: Product3DViewerProps = {
    ...props,
    config: resolvedConfig,
  };
  const cameraPosition =
    props.config.cameraDefaults?.position ?? ([4.8, 3.4, 6.2] as const);
  const cameraTarget =
    props.config.cameraDefaults?.target ?? ([0, 0, 0] as const);

  return (
    <div
      className="tapBoard2Viewer"
      aria-label={`${props.config.productName} 3D viewer`}
    >
      <div className={`tapBoard2Status ${status.kind}`}>
        {status.kind === 'loading'
          ? `Loading ${props.config.productName} model…`
          : null}
        {status.kind === 'ready'
          ? `Model loaded · ${status.report.parts.filter((part) => part.isMesh).length} meshes`
          : null}
        {status.kind === 'error' ? status.message : null}
      </div>
      {status.kind === 'ready' && status.report.missingTargets.length > 0 ? (
        <div className="tapBoard2TargetWarning">
          Missing {status.report.missingTargets.length} target
          {status.report.missingTargets.length === 1 ? '' : 's'} — open the
          inspector for exported names.
        </div>
      ) : null}
      <Canvas
        frameloop="demand"
        camera={{
          position: cameraPosition,
          fov: 36,
          zoom: props.config.cameraDefaults?.zoom ?? 1,
        }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
      >
        <color attach="background" args={['#eeeae2']} />
        <ViewerLights />
        <ProductModel
          key={modelKey}
          props={resolvedProps}
          onStatusChange={setStatus}
        />
        <ContactShadows
          position={[0, -1.5, 0]}
          opacity={0.25}
          scale={8}
          blur={2.8}
          far={4}
          frames={1}
          resolution={256}
        />
        <OrbitControls
          makeDefault
          enableDamping
          dampingFactor={0.08}
          minDistance={minimumCameraDistance}
          maxDistance={maximumCameraDistance}
          zoomSpeed={1.15}
          maxPolarAngle={Math.PI * 0.9}
          target={cameraTarget}
        />
      </Canvas>
    </div>
  );
}
