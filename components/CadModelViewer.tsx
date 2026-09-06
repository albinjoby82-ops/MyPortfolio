'use client';

import { Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Bounds, Html, OrbitControls, useGLTF } from '@react-three/drei';

function Model({ src }: { src: string }) {
  const { scene } = useGLTF(src, false, false);

  return (
    <Bounds fit clip observe margin={1.25}>
      <primitive object={scene} dispose={null} />
    </Bounds>
  );
}

export default function CadModelViewer({ src, name }: { src: string; name: string }) {
  const viewer = useRef<HTMLDivElement>(null);

  return (
    <div ref={viewer} className="cadModelViewer" aria-label={`${name} interactive 3D model`}>
      <Canvas
        frameloop="demand"
        dpr={[1, 1.5]}
        camera={{ fov: 34, near: 0.01, far: 10000, position: [4, 3, 5] }}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      >
        <color attach="background" args={['#e7edf0']} />
        <hemisphereLight intensity={0.85} color="#ffffff" groundColor="#596670" />
        <directionalLight position={[5, 8, 6]} intensity={1.7} />
        <directionalLight position={[-5, 2, -4]} intensity={0.65} />
        <Suspense fallback={<Html center className="cadModelLoading">Loading CAD…</Html>}>
          <Model src={src} />
        </Suspense>
        <OrbitControls makeDefault enableDamping dampingFactor={0.08} />
      </Canvas>
      <button
        type="button"
        className="cadFullscreen"
        onClick={() => viewer.current?.requestFullscreen()}
      >
        Fullscreen ↗
      </button>
    </div>
  );
}
