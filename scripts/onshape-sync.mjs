#!/usr/bin/env node
// Pulls a public Onshape document into this repo so the CAD portal can render
// it: one glTF export per tab, plus the assembly's mates as a starting config.
//
//   ONSHAPE_ACCESS_KEY=… ONSHAPE_SECRET_KEY=… \
//     node scripts/onshape-sync.mjs <document-url> [--slug galeforce]
//
// Keys come from https://dev-portal.onshape.com/keys. They stay in your shell —
// nothing here writes them to disk, and the exported files contain no
// credentials. This is a build-time tool: the site itself never calls Onshape.

import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const API_BASE = process.env.ONSHAPE_API_BASE ?? 'https://cad.onshape.com/api/v10';
const ACCESS_KEY = process.env.ONSHAPE_ACCESS_KEY;
const SECRET_KEY = process.env.ONSHAPE_SECRET_KEY;

const args = process.argv.slice(2);
const documentUrl = args.find((a) => !a.startsWith('--'));
const slug = valueOf('--slug') ?? 'onshape';
const outDir = valueOf('--out') ?? path.join('public', 'models', slug);

function valueOf(flag) {
  const index = args.indexOf(flag);
  return index >= 0 ? args[index + 1] : undefined;
}

function fail(message) {
  console.error(`\n✗ ${message}\n`);
  process.exit(1);
}

if (!documentUrl) fail('Pass the Onshape document URL as the first argument.');
if (!ACCESS_KEY || !SECRET_KEY) {
  fail('Set ONSHAPE_ACCESS_KEY and ONSHAPE_SECRET_KEY (dev-portal.onshape.com/keys).');
}

const ids = documentUrl.match(
  /documents\/([0-9a-f]{16,32})\/(w|v|m)\/([0-9a-f]{16,32})(?:\/e\/([0-9a-f]{16,32}))?/i,
);
if (!ids) fail(`Could not read document ids from ${documentUrl}`);
const [, did, wvm, wvmId] = ids;

const auth = 'Basic ' + Buffer.from(`${ACCESS_KEY}:${SECRET_KEY}`).toString('base64');

async function api(pathname, { accept = 'application/json;charset=UTF-8;qs=0.09' } = {}) {
  const url = pathname.startsWith('http') ? pathname : `${API_BASE}${pathname}`;
  const res = await fetch(url, { headers: { Authorization: auth, Accept: accept } });
  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText} — ${url}\n${(await res.text()).slice(0, 400)}`);
  }
  return accept.includes('json') ? res.json() : Buffer.from(await res.arrayBuffer());
}

/**
 * Onshape has moved the synchronous glTF export between paths across API
 * versions, so try the known shapes rather than guessing one.
 */
async function fetchGltf(kind, elementId) {
  const stem = `/${kind}/d/${did}/${wvm}/${wvmId}/e/${elementId}`;
  const candidates = [`${stem}/gltf`, `${stem}/export/gltf`];
  const problems = [];
  for (const candidate of candidates) {
    try {
      return await api(candidate, { accept: 'model/gltf-binary' });
    } catch (error) {
      problems.push(error.message.split('\n')[0]);
    }
  }
  throw new Error(`no glTF endpoint answered:\n    ${problems.join('\n    ')}`);
}

const MATE_TYPES = {
  REVOLUTE: 'revolute',
  SLIDER: 'slider',
  CYLINDRICAL: 'cylindrical',
};

/**
 * Turns the assembly definition's mate features into CadMate drafts. Onshape
 * gives each mate a mated coordinate system whose origin and Z axis are exactly
 * what the viewer pivots around; both are in metres, like the glTF export.
 */
function matesFrom(definition) {
  const root = definition?.rootAssembly ?? {};
  const instanceName = new Map((root.instances ?? []).map((i) => [i.id, i.name]));
  const mates = [];

  for (const feature of root.features ?? []) {
    if (feature.featureType !== 'mate') continue;
    const data = feature.featureData ?? {};
    const type = MATE_TYPES[data.mateType];
    if (!type) continue; // fastened, planar, ball … — no single slider to drive

    const [moved] = data.matedEntities ?? [];
    const cs = moved?.matedCS;
    if (!cs?.origin || !cs?.zAxis) continue;

    const occurrence = moved.matedOccurrence ?? [];
    const nodeNames = occurrence.map((id) => instanceName.get(id) ?? id);

    const mate = {
      id: feature.id ?? data.name,
      name: data.name ?? 'Mate',
      type,
      // Check these against the part names the portal lists — the glTF exporter
      // does not always use the instance name verbatim.
      moves: nodeNames,
      origin: cs.origin.map(Number),
      axis: cs.zAxis.map(Number),
    };

    const limits = data.mateLimits ?? {};
    if (type !== 'slider') {
      mate.angle = {
        min: Number(limits.minRotation ?? -180),
        max: Number(limits.maxRotation ?? 180),
      };
    }
    if (type !== 'revolute') {
      mate.travel = {
        min: Number(limits.minTranslation ?? -0.05),
        max: Number(limits.maxTranslation ?? 0.05),
        scale: 1000,
        unit: 'mm',
      };
    }
    mates.push(mate);
  }
  return mates;
}

const KIND = {
  PARTSTUDIO: { kind: 'part-studio', api: 'partstudios' },
  ASSEMBLY: { kind: 'assembly', api: 'assemblies' },
  DRAWING: { kind: 'drawing', api: undefined },
};

async function main() {
  await mkdir(outDir, { recursive: true });
  console.log(`→ document ${did} (${wvm}/${wvmId})`);

  const elements = await api(`/documents/d/${did}/${wvm}/${wvmId}/elements`);
  const tabs = [];

  for (const element of elements) {
    const mapped = KIND[element.elementType];
    if (!mapped?.api) {
      console.log(`  · skipping ${element.name} (${element.elementType})`);
      continue;
    }

    const fileSlug = element.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const tab = {
      id: fileSlug,
      name: element.name,
      kind: mapped.kind,
      href: `https://cad.onshape.com/documents/${did}/${wvm}/${wvmId}/e/${element.id}`,
    };

    try {
      const glb = await fetchGltf(mapped.api, element.id);
      const file = path.join(outDir, `${fileSlug}.glb`);
      await writeFile(file, glb);
      tab.model = `/${path.relative('public', file).split(path.sep).join('/')}`;
      console.log(`  ✓ ${element.name} → ${file} (${(glb.length / 1024).toFixed(0)} kB)`);
    } catch (error) {
      console.warn(`  ! ${element.name}: ${error.message}`);
    }

    if (mapped.kind === 'assembly') {
      try {
        const definition = await api(`/assemblies/d/${did}/${wvm}/${wvmId}/e/${element.id}`);
        const mates = matesFrom(definition);
        if (mates.length > 0) tab.mates = mates;
        console.log(`    ${mates.length} drivable mate(s)`);
      } catch (error) {
        console.warn(`  ! ${element.name} mates: ${error.message.split('\n')[0]}`);
      }
    }

    tabs.push(tab);
  }

  const configFile = path.join(outDir, 'tabs.json');
  await writeFile(configFile, `${JSON.stringify(tabs, null, 2)}\n`);
  console.log(`\n✓ ${tabs.length} tab(s) written. Config draft: ${configFile}`);
  console.log('  Paste it into content/cad.ts, then check every mate\'s `moves`');
  console.log('  against the part names the portal lists in its inspector.');
}

main().catch((error) => fail(error.message));
