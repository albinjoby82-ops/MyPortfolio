const SVG_NS = 'http://www.w3.org/2000/svg';
const GRAPHIC_TAGS = new Set([
  'circle',
  'ellipse',
  'line',
  'path',
  'polygon',
  'polyline',
  'rect',
  'text',
  'tspan',
]);
const COLOR_PROPERTIES = new Set(['fill', 'stroke', 'stop-color']);

function isExternalReference(value: string) {
  const trimmedValue = value.trim().toLowerCase();

  return (
    trimmedValue.startsWith('http:') ||
    trimmedValue.startsWith('https:') ||
    trimmedValue.startsWith('//') ||
    trimmedValue.startsWith('javascript:') ||
    trimmedValue.startsWith('data:')
  );
}

function shouldReplaceColor(value: string | null) {
  if (!value) {
    return false;
  }

  const normalizedValue = value.trim().toLowerCase();
  return normalizedValue !== 'none' && !normalizedValue.startsWith('url(');
}

type RgbaColor = {
  red: number;
  green: number;
  blue: number;
  alpha: number;
};

function parseCssColor(value: string): RgbaColor | undefined {
  const context = document.createElement('canvas').getContext('2d');

  if (!context || !CSS.supports('color', value)) {
    return undefined;
  }

  context.fillStyle = value;
  const normalizedColor = context.fillStyle;

  if (normalizedColor.startsWith('#')) {
    const hex = normalizedColor.slice(1);
    const expandedHex =
      hex.length === 3
        ? hex
            .split('')
            .map((character) => `${character}${character}`)
            .join('')
        : hex;

    return {
      red: parseInt(expandedHex.slice(0, 2), 16),
      green: parseInt(expandedHex.slice(2, 4), 16),
      blue: parseInt(expandedHex.slice(4, 6), 16),
      alpha: 1,
    };
  }

  const channels = normalizedColor.match(/[\d.]+/g)?.map(Number);

  if (!channels || channels.length < 3) {
    return undefined;
  }

  return {
    red: channels[0],
    green: channels[1],
    blue: channels[2],
    alpha: channels[3] ?? 1,
  };
}

function tintColor(value: string, logoColor: string) {
  const sourceColor = parseCssColor(value);
  const targetColor = parseCssColor(logoColor);

  if (!sourceColor || !targetColor) {
    return logoColor;
  }

  if (sourceColor.alpha === 0) {
    return 'rgba(0, 0, 0, 0)';
  }

  const luminance =
    (sourceColor.red * 0.2126 + sourceColor.green * 0.7152 + sourceColor.blue * 0.0722) /
    255;
  const shade = 0.25 + luminance * 0.75;
  const red = Math.round(targetColor.red * shade);
  const green = Math.round(targetColor.green * shade);
  const blue = Math.round(targetColor.blue * shade);
  const alpha = sourceColor.alpha * targetColor.alpha;

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

function hasUnsafeCssValue(value: string) {
  const normalizedValue = value.replace(/\s+/g, '').toLowerCase();

  return (
    normalizedValue.includes('javascript:') ||
    normalizedValue.includes('expression(') ||
    /url\((?!['"]?#)[^)]+\)/i.test(normalizedValue)
  );
}

function recolorStyle(style: string, logoColor: string, flattenColors: boolean) {
  return style
    .split(';')
    .map((declaration) => declaration.trim())
    .filter(Boolean)
    .filter((declaration) => {
      return !hasUnsafeCssValue(declaration);
    })
    .map((declaration) => {
      const [rawProperty, ...rawValueParts] = declaration.split(':');
      const property = rawProperty.trim().toLowerCase();
      const value = rawValueParts.join(':').trim();

      if (COLOR_PROPERTIES.has(property) && shouldReplaceColor(value)) {
        return `${property}: ${flattenColors ? logoColor : tintColor(value, logoColor)}`;
      }

      if (
        flattenColors &&
        (property === 'opacity' || property === 'fill-opacity' || property === 'stroke-opacity')
      ) {
        return `${property}: 1`;
      }

      return `${property}: ${value}`;
    })
    .join('; ');
}

function sanitizeStyleSheet(styleSheet: string, logoColor: string, flattenColors: boolean) {
  return styleSheet
    .replace(/@import[^;]*;?/gi, '')
    .replace(
      /(fill|stroke|stop-color)\s*:\s*(?!none\b|currentcolor\b|url\()([^;}\n]+)/gi,
      (_match, property: string, value: string) =>
        `${property}: ${
          flattenColors ? logoColor : tintColor(value.trim(), logoColor)
        }`,
    )
    .replace(
      /(opacity|fill-opacity|stroke-opacity)\s*:\s*[^;}\n]+/gi,
      (declaration) => (flattenColors ? `${declaration.split(':')[0]}: 1` : declaration),
    )
    .replace(/[^{}]+\{[^{}]*(?:javascript:|expression\s*\(|url\((?!['"]?#))[^{}]*\}/gi, '')
    .replace(/expression\s*\([^)]*\)/gi, '');
}

function sanitizeElement(element: Element, logoColor: string, flattenColors: boolean) {
  Array.from(element.attributes).forEach((attribute) => {
    const attributeName = attribute.name.toLowerCase();
    const attributeValue = attribute.value;

    if (attributeName.startsWith('on')) {
      element.removeAttribute(attribute.name);
      return;
    }

    if (
      attributeName === 'href' ||
      attributeName === 'xlink:href' ||
      attributeName === 'src'
    ) {
      if (isExternalReference(attributeValue)) {
        element.removeAttribute(attribute.name);
      }
      return;
    }

    if (attributeName === 'style') {
      const sanitizedStyle = recolorStyle(attributeValue, logoColor, flattenColors);

      if (sanitizedStyle) {
        element.setAttribute('style', sanitizedStyle);
      } else {
        element.removeAttribute('style');
      }
      return;
    }

    if (COLOR_PROPERTIES.has(attributeName) && shouldReplaceColor(attributeValue)) {
      element.setAttribute(
        attribute.name,
        flattenColors ? logoColor : tintColor(attributeValue, logoColor),
      );
    }

    if (
      flattenColors &&
      (attributeName === 'opacity' ||
        attributeName === 'fill-opacity' ||
        attributeName === 'stroke-opacity')
    ) {
      element.setAttribute(attribute.name, '1');
    }

    if (
      (attributeName === 'fill' || attributeName === 'stroke') &&
      hasUnsafeCssValue(attributeValue)
    ) {
      element.setAttribute(attribute.name, logoColor);
    }
  });

  const tagName = element.tagName.toLowerCase();
  const hasColor = element.hasAttribute('fill') || element.hasAttribute('stroke');

  if (GRAPHIC_TAGS.has(tagName) && !hasColor) {
    element.setAttribute('fill', logoColor);
  }
}

export function sanitizeSvg(
  svgText: string,
  logoColor: string,
  options: { flattenColors?: boolean } = {},
) {
  const flattenColors = options.flattenColors ?? false;
  const parser = new DOMParser();
  const parsedDocument = parser.parseFromString(svgText, 'image/svg+xml');
  const parserError = parsedDocument.querySelector('parsererror');
  const svgElement = parsedDocument.documentElement;

  if (parserError || svgElement.tagName.toLowerCase() !== 'svg') {
    throw new Error('Invalid SVG file');
  }

  parsedDocument
    .querySelectorAll('script, foreignObject, iframe, object, embed')
    .forEach((element) => element.remove());

  parsedDocument.querySelectorAll('style').forEach((styleElement) => {
    styleElement.textContent = sanitizeStyleSheet(
      styleElement.textContent ?? '',
      logoColor,
      flattenColors,
    );
  });

  parsedDocument.querySelectorAll('*').forEach((element) => {
    sanitizeElement(element, logoColor, flattenColors);
  });

  svgElement.setAttribute('xmlns', SVG_NS);
  svgElement.setAttribute('color', logoColor);

  if (!svgElement.getAttribute('viewBox')) {
    const width = svgElement.getAttribute('width') || '100';
    const height = svgElement.getAttribute('height') || '100';
    svgElement.setAttribute('viewBox', `0 0 ${parseFloat(width) || 100} ${parseFloat(height) || 100}`);
  }

  return new XMLSerializer().serializeToString(svgElement);
}
