import {
  CanvasTexture,
  LinearFilter,
  LinearMipmapLinearFilter,
  SRGBColorSpace,
} from 'three';

const MAX_TEXTURE_SIZE = 2048;
const TARGET_LONG_EDGE = 1024;

export type SvgCanvasTexture = {
  texture: CanvasTexture;
  aspectRatio: number;
  canvas?: HTMLCanvasElement;
  edgeMask?: Uint8Array;
};

function getSvgAspectRatio(svgText: string) {
  const document = new DOMParser().parseFromString(svgText, 'image/svg+xml');
  const svg = document.documentElement;
  const viewBox = svg.getAttribute('viewBox')?.trim().split(/[\s,]+/).map(Number);

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

function getCanvasDimensions(aspectRatio: number) {
  const safeAspect = Math.min(
    Math.max(aspectRatio, 1 / MAX_TEXTURE_SIZE),
    MAX_TEXTURE_SIZE,
  );

  if (safeAspect >= 1) {
    return {
      width: Math.min(TARGET_LONG_EDGE, MAX_TEXTURE_SIZE),
      height: Math.max(1, Math.round(TARGET_LONG_EDGE / safeAspect)),
    };
  }

  return {
    width: Math.max(1, Math.round(TARGET_LONG_EDGE * safeAspect)),
    height: Math.min(TARGET_LONG_EDGE, MAX_TEXTURE_SIZE),
  };
}

export function svgToTexture(svgText: string): Promise<SvgCanvasTexture> {
  const blob = new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' });
  const objectUrl = URL.createObjectURL(blob);
  const image = new Image();

  return new Promise((resolve, reject) => {
    image.onload = () => {
      try {
        const aspectRatio = getSvgAspectRatio(svgText);
        const { width, height } = getCanvasDimensions(aspectRatio);
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        if (!context) {
          throw new Error('Canvas rendering is not available.');
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
  });
}
