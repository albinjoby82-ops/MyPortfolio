import {
  Box3,
  Color,
  Material,
  Matrix4,
  Mesh,
  Object3D,
  Quaternion,
  Vector3,
} from 'three';
import type {
  CubeIconTargetKey,
  DetectedModelParts,
  ModelPartInfo,
  ProductMeshRoles,
  TargetKey,
  TargetPlacement,
} from './types';

/** The targets a product's model is expected to expose. A board panel is only
 *  expected when the config actually declares zones for it: the Cubi Lite line
 *  has no logo or text panel on its slim board, so demanding those would report
 *  them as permanently "missing" and show a warning over a perfectly good
 *  model. Mirrors CustomizerPanel's `hasLogoTarget` test. */
export function getTargetKeys(meshRoles: ProductMeshRoles): TargetKey[] {
  return [
    ...(meshRoles.logoZones?.length ? (['boardLogo'] as const) : []),
    ...(meshRoles.textZones?.length ? (['boardText'] as const) : []),
    ...(meshRoles.iconZones ?? []).map(
      (_, index) => `cube${index + 1}Icon` as CubeIconTargetKey,
    ),
  ];
}

type NameMatcher = string | RegExp;

function matchesName(name: string, matcher: NameMatcher) {
  if (typeof matcher === 'string') {
    return name.toLowerCase().includes(matcher.toLowerCase());
  }

  matcher.lastIndex = 0;
  return matcher.test(name);
}

export function findObjectByNamesOrIncludes(
  scene: Object3D,
  matchers: NameMatcher[],
) {
  let match: Object3D | undefined;

  scene.traverse((object) => {
    if (!match && matchers.some((matcher) => matchesName(object.name, matcher))) {
      match = object;
    }
  });

  return match;
}

export function findObjectsByNamesOrIncludes(
  scene: Object3D,
  matchers: NameMatcher[],
) {
  const matches: Object3D[] = [];

  scene.traverse((object) => {
    if (matchers.some((matcher) => matchesName(object.name, matcher))) {
      matches.push(object);
    }
  });

  return matches;
}

export function findObjectsByExactNames(scene: Object3D, names: string[]) {
  if (names.length === 0) {
    return [];
  }

  const normalizedNames = new Set(
    names.map((name) => name.trim().toLowerCase()).filter(Boolean),
  );
  const matches: Object3D[] = [];

  scene.traverse((object) => {
    if (normalizedNames.has(object.name.trim().toLowerCase())) {
      matches.push(object);
    }
  });

  return matches;
}

export function getWorldBounds(object: Object3D) {
  object.updateWorldMatrix(true, true);
  return new Box3().setFromObject(object);
}

/**
 * Applies a product's authored orientation correction to the loaded model
 * root, in place. Products modelled Z-up (CAD default) appear tipped on their
 * side once loaded into three.js's Y-up world; the config's `orientation`
 * quaternion re-seats them upright and facing forward. Called identically by
 * the viewer, the 3MF export, and the order design package — before
 * `detectModelParts` — so target placement, insets, and printable geometry
 * are all computed in the same corrected frame.
 */
export function applyModelOrientation(
  scene: Object3D,
  orientation?: [number, number, number, number],
) {
  if (!orientation) {
    return;
  }

  const [x, y, z, w] = orientation;
  scene.quaternion.premultiply(new Quaternion(x, y, z, w));
  scene.updateMatrixWorld(true);
}

/** Every triangle of an object's descendant meshes, in world space. */
function collectWorldTriangles(object: Object3D): Vector3[][] {
  object.updateWorldMatrix(true, false);
  const triangles: Vector3[][] = [];

  object.traverse((child) => {
    const mesh = child as Mesh;
    const position = mesh.geometry?.getAttribute('position');

    if (!mesh.isMesh || !position) {
      return;
    }

    const index = mesh.geometry.getIndex();
    const count = index ? index.count : position.count;
    const at = (i: number) => {
      const vertexIndex = index ? index.getX(i) : i;
      return new Vector3()
        .fromBufferAttribute(position, vertexIndex)
        .applyMatrix4(mesh.matrixWorld);
    };

    for (let i = 0; i + 2 < count; i += 3) {
      triangles.push([at(i), at(i + 1), at(i + 2)]);
    }
  });

  return triangles;
}

/**
 * Builds the flat decal plane (logo / text / icon) that sits on a hidden
 * target body's outward face.
 *
 * The surface frame is derived from the target's real geometry rather than its
 * axis-aligned bounding box: the normal is taken from the target's
 * largest-area triangle (a flat plate's biggest faces are its two flat sides),
 * so it is correct for a target that faces any direction and even for one
 * modelled at an angle — an AABB heuristic gets both of those wrong. "Up" on
 * the decal follows world-up (falling back to world-Z only when the surface
 * itself faces straight up or down), which keeps logos and text upright on
 * vertical, front-facing, and sloped faces alike.
 */
export function createPlaneForTarget(
  targetObject: Object3D,
  padding = 0.86,
  key: TargetKey = 'boardLogo',
): TargetPlacement {
  const triangles = collectWorldTriangles(targetObject);
  const vertices = triangles.flat();

  const centroid = new Vector3();
  vertices.forEach((vertex) => centroid.add(vertex));
  centroid.multiplyScalar(1 / Math.max(1, vertices.length));

  // Surface normal = normal of the largest triangle.
  const normal = new Vector3(0, 0, 1);
  const edge1 = new Vector3();
  const edge2 = new Vector3();
  const faceNormal = new Vector3();
  let bestArea = -1;
  for (const [a, b, c] of triangles) {
    faceNormal.crossVectors(edge1.subVectors(b, a), edge2.subVectors(c, a));
    const area = faceNormal.length();
    if (area > bestArea) {
      bestArea = area;
      normal.copy(faceNormal).normalize();
    }
  }

  // Point the normal outward so the decal lifts off the visible surface rather
  // than sinking into the body. "Outward" is taken as away from the nearest
  // other mesh — i.e. the body the target plate sits on — which is reliable
  // even for a thin plate on a panel that is offset from the model's overall
  // centre of mass (where an "away from the whole model" test flips the sign).
  const own = new Set<Object3D>();
  targetObject.traverse((object) => own.add(object));
  let root = targetObject;
  while (root.parent) {
    root = root.parent;
  }
  let outwardFrom: Vector3 | undefined;
  let nearestDistance = Infinity;
  const bounds = new Box3();
  const otherCentre = new Vector3();
  root.traverse((object) => {
    const mesh = object as Mesh;
    if (own.has(object) || !mesh.isMesh || !mesh.geometry) {
      return;
    }
    bounds.setFromObject(mesh).getCenter(otherCentre);
    const distance = otherCentre.distanceToSquared(centroid);
    if (distance < nearestDistance) {
      nearestDistance = distance;
      outwardFrom = otherCentre.clone();
    }
  });
  if (!outwardFrom) {
    outwardFrom = bounds.setFromObject(root).getCenter(new Vector3());
  }
  if (normal.dot(new Vector3().subVectors(centroid, outwardFrom)) < 0) {
    normal.negate();
  }

  // Some joined/asymmetric bodies make the centre-based outward test
  // ambiguous (the Cubi Base wedge shifts the body centre far in front of
  // its upright logo panel). Product detection marks those authored target
  // planes so every consumer applies the same correction.
  if (targetObject.userData.cubiFlipTargetNormal === true) {
    normal.negate();
  }

  // In-plane frame, kept upright via world-up.
  const upReference =
    Math.abs(normal.y) > 0.9 ? new Vector3(0, 0, 1) : new Vector3(0, 1, 0);
  const up = upReference.clone().addScaledVector(normal, -upReference.dot(normal));
  if (up.lengthSq() < 1e-8) {
    up.set(0, 1, 0);
  }
  up.normalize();
  if (up.dot(upReference) < 0) {
    up.negate();
  }
  const right = new Vector3().crossVectors(up, normal).normalize();

  // Extents of the target in the (right, up, normal) frame.
  let rMin = Infinity;
  let rMax = -Infinity;
  let uMin = Infinity;
  let uMax = -Infinity;
  let nMax = -Infinity;
  const delta = new Vector3();
  for (const vertex of vertices) {
    delta.subVectors(vertex, centroid);
    const r = delta.dot(right);
    const u = delta.dot(up);
    const n = delta.dot(normal);
    rMin = Math.min(rMin, r);
    rMax = Math.max(rMax, r);
    uMin = Math.min(uMin, u);
    uMax = Math.max(uMax, u);
    nMax = Math.max(nMax, n);
  }
  const width = rMax - rMin;
  const height = uMax - uMin;

  // Lift the plane a hair past the outermost surface point along the normal.
  const position = centroid
    .clone()
    .addScaledVector(normal, nMax + Math.max(width, height) * 0.0025);
  const quaternion = new Quaternion().setFromRotationMatrix(
    new Matrix4().makeBasis(right, up, normal),
  );

  return {
    key,
    sourceName: targetObject.name,
    position,
    quaternion,
    width: Math.max(width * padding, 0.0001),
    height: Math.max(height * padding, 0.0001),
  };
}

function colourMaterial(material: Material, colour: string) {
  const candidate = material as Material & { color?: Color };

  if (candidate.color) {
    candidate.color.set(colour);
    material.needsUpdate = true;
  }
}

export function applyMaterialColour(object: Object3D, colour: string) {
  object.traverse((child) => {
    const mesh = child as Mesh;

    if (!mesh.isMesh) {
      return;
    }

    if (Array.isArray(mesh.material)) {
      mesh.material.forEach((material) => colourMaterial(material, colour));
    } else {
      colourMaterial(mesh.material, colour);
    }
  });
}

export function cloneSceneMaterials(scene: Object3D) {
  scene.traverse((child) => {
    const mesh = child as Mesh;

    if (!mesh.isMesh) {
      return;
    }

    mesh.material = Array.isArray(mesh.material)
      ? mesh.material.map((material) => material.clone())
      : mesh.material.clone();
  });
}

export function disposeSceneMaterials(scene: Object3D) {
  scene.traverse((child) => {
    const mesh = child as Mesh;

    if (!mesh.isMesh) {
      return;
    }

    const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    materials.forEach((material) => material.dispose());
  });
}

function removeNestedMatches(objects: Object3D[]) {
  const objectSet = new Set(objects);

  return objects.filter((object) => {
    let parent = object.parent;

    while (parent) {
      if (objectSet.has(parent)) {
        return false;
      }

      parent = parent.parent;
    }

    return true;
  });
}

export function detectModelParts(
  scene: Object3D,
  meshRoles: ProductMeshRoles,
): DetectedModelParts {
  const targets: Partial<Record<TargetKey, Object3D>> = {};
  const targetKeys = getTargetKeys(meshRoles);
  const targetNames = new Map<TargetKey, string[]>([
    ['boardLogo', meshRoles.logoZones ?? []],
    ['boardText', meshRoles.textZones ?? []],
    ...(meshRoles.iconZones ?? []).map(
      (names, index) =>
        [`cube${index + 1}Icon` as CubeIconTargetKey, names] as const,
    ),
  ]);

  targetKeys.forEach((key) => {
    const names = targetNames.get(key) ?? [];
    targets[key] =
      findObjectsByExactNames(scene, names)[0] ??
      findObjectByNamesOrIncludes(scene, names);
    if (targets[key]) {
      targets[key].userData.cubiFlipTargetNormal =
        meshRoles.flippedTargets?.includes(key) ?? false;
    }
  });

  // Only the logo and text targets are pure placeholders that must never be
  // treated as printable/visible bodies. An icon target may double as the
  // visible tap cap it is inset into (see the Cubi Base config, where the same
  // mesh is listed in both `cubes` and `iconZones`), so it is intentionally not
  // excluded here — that keeps the cap visible and exported.
  const targetObjects = new Set(
    [targets.boardLogo, targets.boardText].filter(
      (object): object is Object3D => Boolean(object),
    ),
  );
  const exactCubes = findObjectsByExactNames(scene, meshRoles.cubes);
  const cubeCandidates = exactCubes.length
    ? exactCubes
    : findObjectsByNamesOrIncludes(scene, meshRoles.cubes);
  const cubes = removeNestedMatches(cubeCandidates).filter(
    (object) => !targetObjects.has(object),
  );
  const exactBoard = findObjectsByExactNames(scene, meshRoles.board);
  const boardCandidates = exactBoard.length
    ? exactBoard
    : findObjectsByNamesOrIncludes(scene, meshRoles.board);
  const exactAccent = findObjectsByExactNames(scene, meshRoles.accent);
  const accentCandidates = exactAccent.length
    ? exactAccent
    : findObjectsByNamesOrIncludes(scene, meshRoles.accent);
  const exactBase = findObjectsByExactNames(scene, meshRoles.base ?? []);
  const baseCandidates = exactBase.length
    ? exactBase
    : findObjectsByNamesOrIncludes(scene, meshRoles.base ?? []);

  return {
    board: removeNestedMatches(boardCandidates).filter(
      (object) => !targetObjects.has(object),
    ),
    base: removeNestedMatches(baseCandidates).filter(
      (object) => !targetObjects.has(object),
    ),
    cubes,
    accent: removeNestedMatches(accentCandidates).filter(
      (object) => !targetObjects.has(object),
    ),
    targets,
  };
}

function materialNamesFor(object: Object3D) {
  const mesh = object as Mesh;

  if (!mesh.isMesh) {
    return [];
  }

  return (Array.isArray(mesh.material) ? mesh.material : [mesh.material]).map(
    (material) => material.name || '(unnamed material)',
  );
}

export function inspectModelParts(scene: Object3D): ModelPartInfo[] {
  const parts: ModelPartInfo[] = [];

  scene.traverse((object) => {
    const bounds = getWorldBounds(object);
    const size = bounds.isEmpty()
      ? new Vector3()
      : bounds.getSize(new Vector3());

    parts.push({
      id: object.uuid,
      name: object.name || '(unnamed)',
      type: object.type,
      isMesh: Boolean((object as Mesh).isMesh),
      materialNames: materialNamesFor(object),
      visible: object.visible,
      size: [size.x, size.y, size.z],
    });
  });

  return parts;
}
