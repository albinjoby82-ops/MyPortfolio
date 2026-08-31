import {
  CanvasTexture,
  Color,
  LinearFilter,
  LinearMipmapLinearFilter,
  SRGBColorSpace,
} from 'three';
import { sanitizeSvg } from '../../utils/sanitizeSvg';
import type { SvgCanvasTexture } from '../../utils/svgToTexture';

export function forceSvgToSingleColour(svgString: string, colour: string) {
  return sanitizeSvg(svgString, colour, { flattenColors: true });
}

function findPaintSeed(
  edgeMask: Uint8Array,
  width: number,
  height: number,
  x: number,
  y: number,
) {
  const isOpen = (candidateX: number, candidateY: number) =>
    candidateX >= 0 &&
    candidateY >= 0 &&
    candidateX < width &&
    candidateY < height &&
    edgeMask[candidateY * width + candidateX] === 0;

  if (isOpen(x, y)) {
    return { x, y };
  }

  for (let radius = 1; radius <= 10; radius += 1) {
    for (let offsetY = -radius; offsetY <= radius; offsetY += 1) {
      for (let offsetX = -radius; offsetX <= radius; offsetX += 1) {
        if (
          Math.abs(offsetX) !== radius &&
          Math.abs(offsetY) !== radius
        ) {
          continue;
        }

        if (isOpen(x + offsetX, y + offsetY)) {
          return { x: x + offsetX, y: y + offsetY };
        }
      }
    }
  }

  return undefined;
}

export function paintSvgRegion(
  state: SvgCanvasTexture,
  u: number,
  v: number,
  colour?: string,
) {
  if (!state.canvas || !state.edgeMask) {
    return undefined;
  }

  const { canvas, edgeMask } = state;
  const context = canvas.getContext('2d', { willReadFrequently: true });

  if (!context) {
    return undefined;
  }

  const width = canvas.width;
  const height = canvas.height;
  const requestedX = Math.min(
    width - 1,
    Math.max(0, Math.floor(u * width)),
  );
  const requestedY = Math.min(
    height - 1,
    Math.max(0, Math.floor(v * height)),
  );
  const seed = findPaintSeed(
    edgeMask,
    width,
    height,
    requestedX,
    requestedY,
  );

  if (!seed) {
    return undefined;
  }

  const image = context.getImageData(0, 0, width, height);
  const startIndex = (seed.y * width + seed.x) * 4;
  const start = [
    image.data[startIndex],
    image.data[startIndex + 1],
    image.data[startIndex + 2],
    image.data[startIndex + 3],
  ] as const;
  const replacement = colour
    ? (() => {
        const parsed = new Color(colour);
        return [
          Math.round(parsed.r * 255),
          Math.round(parsed.g * 255),
          Math.round(parsed.b * 255),
          255,
        ] as const;
      })()
    : ([0, 0, 0, 0] as const);

  if (start.every((channel, index) => channel === replacement[index])) {
    return undefined;
  }

  const visited = new Uint8Array(width * height);
  const queue = [seed.y * width + seed.x];
  const region: number[] = [];
  let touchesBoundary = false;

  while (queue.length) {
    const pixel = queue.pop() as number;

    if (visited[pixel] || edgeMask[pixel]) {
      continue;
    }

    visited[pixel] = 1;
    const dataIndex = pixel * 4;

    if (
      image.data[dataIndex] !== start[0] ||
      image.data[dataIndex + 1] !== start[1] ||
      image.data[dataIndex + 2] !== start[2] ||
      image.data[dataIndex + 3] !== start[3]
    ) {
      continue;
    }

    const x = pixel % width;
    const y = Math.floor(pixel / width);
    touchesBoundary ||= x === 0 || y === 0 || x === width - 1 || y === height - 1;
    region.push(pixel);

    if (x > 0) queue.push(pixel - 1);
    if (x + 1 < width) queue.push(pixel + 1);
    if (y > 0) queue.push(pixel - width);
    if (y + 1 < height) queue.push(pixel + width);
  }

  if (touchesBoundary || region.length === 0) {
    return undefined;
  }

  region.forEach((pixel) => {
    const dataIndex = pixel * 4;
    image.data[dataIndex] = replacement[0];
    image.data[dataIndex + 1] = replacement[1];
    image.data[dataIndex + 2] = replacement[2];
    image.data[dataIndex + 3] = replacement[3];
  });
  context.putImageData(image, 0, 0);
  state.texture.needsUpdate = true;

  return {
    u: (seed.x + 0.5) / width,
    v: (seed.y + 0.5) / height,
  };
}

function getSvgAspectRatio(svgString: string) {
  const document = new DOMParser().parseFromString(
    svgString,
    'image/svg+xml',
  );
  const svg = document.documentElement;
  const viewBox = svg
    .getAttribute('viewBox')
    ?.trim()
    .split(/[\s,]+/)
    .map(Number);

  if (
    viewBox?.length === 4 &&
    Number.isFinite(viewBox[2]) &&
    Number.isFinite(viewBox[3]) &&
    viewBox[2] > 0 &&
    viewBox[3] > 0
  ) {
    return viewBox[2] / viewBox[3];
  }

  const width = parseFloat(svg.getAttribute('width') ?? '');
  const height = parseFloat(svg.getAttribute('height') ?? '');
  return width > 0 && height > 0 ? width / height : 1;
}

function renderSvgTexture(svgString: string) {
  const aspectRatio = Math.max(0.05, Math.min(20, getSvgAspectRatio(svgString)));
  const longEdge = 1024;
  const width =
    aspectRatio >= 1 ? longEdge : Math.max(1, Math.round(longEdge * aspectRatio));
  const height =
    aspectRatio >= 1 ? Math.max(1, Math.round(longEdge / aspectRatio)) : longEdge;
  const objectUrl = URL.createObjectURL(
    new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' }),
  );
  const image = new Image();

  return new Promise<SvgCanvasTexture>(
    (resolve, reject) => {
      image.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');

          if (!context) {
            throw new Error('SVG rendering is not available in this browser.');
          }

          canvas.width = width;
          canvas.height = height;
          context.clearRect(0, 0, width, height);
          context.drawImage(image, 0, 0, width, height);
          const texture = new CanvasTexture(canvas);
          texture.colorSpace = SRGBColorSpace;
          texture.minFilter = LinearMipmapLinearFilter;
          texture.magFilter = LinearFilter;
          texture.generateMipmaps = true;
          texture.needsUpdate = true;
          resolve({ texture, aspectRatio });
        } catch (error) {
          reject(error);
        } finally {
          URL.revokeObjectURL(objectUrl);
        }
      };
      image.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error('The SVG could not be rendered.'));
      };
      image.decoding = 'async';
      image.src = objectUrl;
    },
  );
}

export function createPaintableSvgDecalTexture(
  svgString: string,
  outlineColour: string,
) {
  const sanitizedSvg = forceSvgToSingleColour(svgString, '#ffffff');
  const aspectRatio = Math.max(
    0.05,
    Math.min(20, getSvgAspectRatio(sanitizedSvg)),
  );
  const longEdge = 1024;
  const width =
    aspectRatio >= 1
      ? longEdge
      : Math.max(1, Math.round(longEdge * aspectRatio));
  const height =
    aspectRatio >= 1
      ? Math.max(1, Math.round(longEdge / aspectRatio))
      : longEdge;
  const objectUrl = URL.createObjectURL(
    new Blob([sanitizedSvg], { type: 'image/svg+xml;charset=utf-8' }),
  );
  const image = new Image();

  return new Promise<SvgCanvasTexture>((resolve, reject) => {
    image.onload = () => {
      try {
        const source = document.createElement('canvas');
        const sourceContext = source.getContext('2d', {
          willReadFrequently: true,
        });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        if (!sourceContext || !context) {
          throw new Error('SVG painting is unavailable in this browser.');
        }

        source.width = width;
        source.height = height;
        canvas.width = width;
        canvas.height = height;
        sourceContext.clearRect(0, 0, width, height);
        sourceContext.drawImage(image, 0, 0, width, height);
        const sourcePixels = sourceContext.getImageData(0, 0, width, height);
        const edgeMask = new Uint8Array(width * height);
        const foreground = new Uint8Array(width * height);

        for (let pixel = 0; pixel < foreground.length; pixel += 1) {
          foreground[pixel] = Number(sourcePixels.data[pixel * 4 + 3] > 32);
        }

        for (let y = 0; y < height; y += 1) {
          for (let x = 0; x < width; x += 1) {
            const pixel = y * width + x;

            if (!foreground[pixel]) {
              continue;
            }

            const isBoundary =
              x === 0 ||
              y === 0 ||
              x === width - 1 ||
              y === height - 1 ||
              !foreground[pixel - 1] ||
              !foreground[pixel + 1] ||
              !foreground[pixel - width] ||
              !foreground[pixel + width];

            if (!isBoundary) {
              continue;
            }

            for (let offsetY = -1; offsetY <= 1; offsetY += 1) {
              for (let offsetX = -1; offsetX <= 1; offsetX += 1) {
                const targetX = x + offsetX;
                const targetY = y + offsetY;

                if (
                  targetX >= 0 &&
                  targetY >= 0 &&
                  targetX < width &&
                  targetY < height
                ) {
                  edgeMask[targetY * width + targetX] = 1;
                }
              }
            }
          }
        }

        const outline = new Color(outlineColour);
        const output = context.createImageData(width, height);

        for (let pixel = 0; pixel < foreground.length; pixel += 1) {
          if (!foreground[pixel]) {
            continue;
          }

          const index = pixel * 4;
          output.data[index] = Math.round(outline.r * 255);
          output.data[index + 1] = Math.round(outline.g * 255);
          output.data[index + 2] = Math.round(outline.b * 255);
          output.data[index + 3] = 255;
        }

        context.putImageData(output, 0, 0);
        const texture = new CanvasTexture(canvas);
        texture.colorSpace = SRGBColorSpace;
        texture.minFilter = LinearMipmapLinearFilter;
        texture.magFilter = LinearFilter;
        texture.generateMipmaps = true;
        texture.needsUpdate = true;
        resolve({ texture, aspectRatio, canvas, edgeMask });
      } catch (error) {
        reject(error);
      } finally {
        URL.revokeObjectURL(objectUrl);
      }
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('The SVG could not be prepared for painting.'));
    };
    image.decoding = 'async';
    image.src = objectUrl;
  });
}

export async function createSvgDecalTexture(
  svgString: string,
  colour: string,
) {
  const forcedSvg = forceSvgToSingleColour(svgString, colour);
  return renderSvgTexture(forcedSvg);
}
