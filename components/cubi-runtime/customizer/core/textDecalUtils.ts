import {
  CanvasTexture,
  LinearFilter,
  LinearMipmapLinearFilter,
  SRGBColorSpace,
} from 'three';

export const TEXT_DECAL_WIDTH = 1536;
export const TEXT_DECAL_MIN_HEIGHT = 192;

export function fitTextToTarget(
  text: string,
  targetWidth: number,
  targetHeight: number,
  context?: CanvasRenderingContext2D,
  fontFamily = 'Arial, sans-serif',
) {
  const cleanText = text.replace(/\s+/g, ' ').trim();
  const safeWidth = Math.max(1, targetWidth);
  const safeHeight = Math.max(1, targetHeight);
  const measuringContext =
    context ?? document.createElement('canvas').getContext('2d');

  if (!measuringContext || !cleanText) {
    return { text: cleanText, fontSize: 1 };
  }

  let fontSize = safeHeight * 0.72;
  const minimumFontSize = Math.max(8, safeHeight * 0.18);

  while (fontSize > minimumFontSize) {
    measuringContext.font = `800 ${fontSize}px ${fontFamily}`;

    if (measuringContext.measureText(cleanText).width <= safeWidth * 0.94) {
      break;
    }

    fontSize -= Math.max(1, safeHeight * 0.025);
  }

  return { text: cleanText, fontSize };
}

export function createTextDecalTexture(
  text: string,
  colour: string,
  targetAspectRatio: number,
  fontFamily = 'Arial, sans-serif',
) {
  const safeAspectRatio = Math.max(0.25, Math.min(8, targetAspectRatio || 1));
  const canvas = document.createElement('canvas');
  canvas.width = TEXT_DECAL_WIDTH;
  canvas.height = Math.max(
    TEXT_DECAL_MIN_HEIGHT,
    Math.round(TEXT_DECAL_WIDTH / safeAspectRatio),
  );
  const context = canvas.getContext('2d');

  if (!context) {
    throw new Error('Text rendering is not available in this browser.');
  }

  context.clearRect(0, 0, canvas.width, canvas.height);
  const fitted = fitTextToTarget(
    text,
    canvas.width,
    canvas.height,
    context,
    fontFamily,
  );
  context.font = `800 ${fitted.fontSize}px ${fontFamily}`;
  context.fillStyle = colour;
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText(fitted.text, canvas.width / 2, canvas.height / 2);

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.minFilter = LinearMipmapLinearFilter;
  texture.magFilter = LinearFilter;
  texture.generateMipmaps = true;
  texture.needsUpdate = true;

  return texture;
}
