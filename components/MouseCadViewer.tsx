'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Bounds, Center } from '@react-three/drei';

/** The mouse's 3D printed case, exported from the SolidWorks STEP file. */
const MODEL = '/models/micromouse/micromouse-case.glb';

function Case() {
  const { scene } = useGLTF(MODEL);
  return (
    <Bounds fit clip observe margin={1.25}>
      <Center>
        <primitive object={scene} />
      </Center>
    </Bounds>
  );
}

export default function MouseCadViewer() {
  return (
    <div className="mmcCad">
      <Canvas camera={{ position: [0.12, 0.1, 0.14], fov: 35 }} dpr={[1, 2]}>
        <color attach="background" args={['#1b1e25']} />
        <ambientLight intensity={0.9} />
        <directionalLight position={[0.3, 0.5, 0.4]} intensity={2.2} />
        <directionalLight position={[-0.4, 0.2, -0.3]} intensity={0.9} />
        <Suspense fallback={null}>
          <Case />
        </Suspense>
        <OrbitControls makeDefault enablePan={false} autoRotate autoRotateSpeed={1.4} />
      </Canvas>
      <span className="mmcChip">3D · DRAG TO ROTATE</span>
    </div>
  );
}
