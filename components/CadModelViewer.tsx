'use client';

import { Suspense, useEffect, useMemo } from 'react';
import { Bounds, ContactShadows, OrbitControls, useBounds, useGLTF } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Box3, Quaternion, Vector3, type Object3D } from 'three';
import { orderMates, type CadMate } from '@/lib/cad';

export type MateValues = Record<string, { angle?: number; travel?: number }>;

type Props = {
  /** URL of the GLB export. */
  model: string;
  mates: CadMate[];
  values: MateValues;
  /** Node names to hide. */
  hidden: string[];
  /** When set, only this node is shown. */
  isolated?: string;
  /** 0–1. Pushes parts out along the vector from the model centre. */
  explode: number;
  /** Called once the GLB is parsed, with every named part in it. */
  onParts?: (parts: string[]) => void;
  /** Bump to re-frame the camera on the model. */
  fitToken?: number;
  background?: string;
};

/** Rotation about an arbitrary axis, in degrees. */
function axisQuaternion(axis: Vector3, degrees: number): Quaternion {
  return new Quaternion().setFromAxisAngle(axis, (degrees * Math.PI) / 180);
}

function useSceneParts(model: string) {
  const { scene } = useGLTF(model);

  // useGLTF caches by URL, so every consumer would otherwise share — and
  // mutate — one scene graph. Clone before touching visibility or transforms.
  return useMemo(() => {
    const cloned = scene.clone(true);
    cloned.updateWorldMatrix(true, true);

    const topLevel = [...cloned.children];
    const bounds = new Box3().setFromObject(cloned);
    const centre = bounds.getCenter(new Vector3());
    const size = bounds.getSize(new Vector3()).length() || 1;

    const named: string[] = [];
    cloned.traverse((child) => {
      if ((child as { isMesh?: boolean }).isMesh && child.name) named.push(child.name);
    });

    // Explode direction per top-level part: away from the model centre, so the
    // assembly opens up instead of scattering.
    const explodeAxis = new Map<string, Vector3>();
    for (const node of topLevel) {
      const partCentre = new Box3().setFromObject(node).getCenter(new Vector3());
      const away = partCentre.clone().sub(centre);
      if (away.lengthSq() < 1e-8) away.set(0, 1, 0);
      explodeAxis.set(node.name, away.normalize().multiplyScalar(size * 0.22));
    }

    return { topLevel, parts: named.length > 0 ? named : topLevel.map((n) => n.name), explodeAxis };
  }, [scene]);
}

/** Re-frames the camera when the portal asks for it. */
function FitOnDemand({ token }: { token: number }) {
  const bounds = useBounds();

  useEffect(() => {
    if (token > 0) bounds.refresh().clip().fit();
  }, [token, bounds]);

  return null;
}

/** One part, with visibility and explode offset applied. */
function Part({
  node,
  offset,
  visible,
}: {
  node: Object3D;
  offset: Vector3;
  visible: boolean;
}) {
  useEffect(() => {
    node.visible = visible;
  }, [node, visible]);

  return (
    <group position={offset}>
      <primitive object={node} />
    </group>
  );
}

function Model({ model, mates, values, hidden, isolated, explode, onParts, fitToken = 0 }: Props) {
  const { topLevel, parts, explodeAxis } = useSceneParts(model);

  useEffect(() => {
    onParts?.(parts);
  }, [parts, onParts]);

  const isVisible = (name: string) =>
    isolated ? name === isolated : !hidden.includes(name);

  const nodeByName = useMemo(() => {
    const map = new Map<string, Object3D>();
    for (const node of topLevel) map.set(node.name, node);
    return map;
  }, [topLevel]);

  const ordered = useMemo(() => orderMates(mates), [mates]);

  // Every node a mate moves is rendered inside that mate's pivot instead of at
  // the top level.
  const driven = useMemo(() => {
    const owned = new Set<string>();
    for (const mate of ordered) for (const name of mate.moves) owned.add(name);
    return owned;
  }, [ordered]);

  const childMates = useMemo(() => {
    const map = new Map<string | undefined, CadMate[]>();
    for (const mate of ordered) {
      const key = mate.parent && ordered.some((m) => m.id === mate.parent) ? mate.parent : undefined;
      map.set(key, [...(map.get(key) ?? []), mate]);
    }
    return map;
  }, [ordered]);

  const renderPart = (name: string) => {
    const node = nodeByName.get(name);
    if (!node) return null;
    const away = explodeAxis.get(name) ?? new Vector3();
    return (
      <Part
        key={name}
        node={node}
        offset={away.clone().multiplyScalar(explode)}
        visible={isVisible(name)}
      />
    );
  };

  /**
   * T(origin) · R(axis, angle) · T(axis · travel) · T(-origin) — the standard
   * pivot sandwich, which is what an Onshape mate connector describes.
   */
  const renderMate = (mate: CadMate) => {
    const origin = new Vector3(...mate.origin);
    const axis = new Vector3(...mate.axis);
    if (axis.lengthSq() < 1e-8) axis.set(0, 1, 0);
    axis.normalize();

    const value = values[mate.id] ?? {};
    const rotation = axisQuaternion(axis, value.angle ?? 0);
    const slide = axis.clone().multiplyScalar(value.travel ?? 0);

    return (
      <group key={mate.id} position={origin} quaternion={rotation}>
        <group position={slide}>
          <group position={origin.clone().negate()}>
            {mate.moves.map(renderPart)}
            {(childMates.get(mate.id) ?? []).map(renderMate)}
          </group>
        </group>
      </group>
    );
  };

  return (
    /* Fits once on mount, with margin to spare so an exploded assembly stays
       inside the frame. Deliberately not `observe`: that re-fits on every
       bounds change, so the camera crawls while a mate is being dragged. The
       Fit view button re-frames on demand instead. */
    <Bounds fit clip margin={1.55}>
      <FitOnDemand token={fitToken} />
      <group>
        {topLevel.filter((node) => !driven.has(node.name)).map((node) => renderPart(node.name))}
        {(childMates.get(undefined) ?? []).map(renderMate)}
      </group>
    </Bounds>
  );
}

/**
 * Renders a CAD export with orbit controls, isolate/hide, an explode slider and
 * live mate motion. Everything runs client-side against a self-hosted GLB — no
 * CAD account, no API call at page load.
 */
export default function CadModelViewer(props: Props) {
  const { background = '#eeeae2', model } = props;

  return (
    <Canvas
      frameloop="demand"
      camera={{ position: [4.5, 3.2, 5.5], fov: 38 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
    >
      <color attach="background" args={[background]} />
      <ambientLight intensity={1.15} />
      <directionalLight position={[5, 8, 6]} intensity={2.1} />
      <directionalLight position={[-6, 3, -4]} intensity={0.65} />

      <Suspense fallback={null}>
        {/* Remount on model change so framing and clones reset cleanly. */}
        <Model key={model} {...props} />
        <ContactShadows
          position={[0, -0.01, 0]}
          opacity={0.28}
          scale={16}
          blur={2.6}
          far={9}
          frames={1}
          resolution={512}
        />
      </Suspense>

      <OrbitControls makeDefault enableDamping dampingFactor={0.08} zoomSpeed={0.9} />
    </Canvas>
  );
}
