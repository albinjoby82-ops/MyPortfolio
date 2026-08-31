export type MasterFont = {
  id: string;
  label: string;
  cssFontFamily: string;
};

// Later this can come from the admin backend.
export const masterFonts: MasterFont[] = [
  { id: 'arial', label: 'Arial', cssFontFamily: 'Arial, sans-serif' },
  { id: 'segoe-ui', label: 'Segoe UI', cssFontFamily: '"Segoe UI", sans-serif' },
  { id: 'verdana', label: 'Verdana', cssFontFamily: 'Verdana, sans-serif' },
  { id: 'tahoma', label: 'Tahoma', cssFontFamily: 'Tahoma, sans-serif' },
  { id: 'trebuchet-ms', label: 'Trebuchet MS', cssFontFamily: '"Trebuchet MS", sans-serif' },
  { id: 'times-new-roman', label: 'Times New Roman', cssFontFamily: '"Times New Roman", serif' },
  { id: 'georgia', label: 'Georgia', cssFontFamily: 'Georgia, serif' },
  { id: 'courier-new', label: 'Courier New', cssFontFamily: '"Courier New", monospace' },
  { id: 'impact', label: 'Impact', cssFontFamily: 'Impact, sans-serif' },
];

export function getMasterFont(fontId: string) {
  return masterFonts.find((font) => font.id === fontId) ?? masterFonts[0];
}
