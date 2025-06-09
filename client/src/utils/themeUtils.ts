// utils/themeUtils.ts

// Converts hex to relative luminance
function getLuminance(hexColor: string): number {
  const hex = hexColor.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  const linear = (c: number) =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);

  return 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b);
}

// Determines text color based on contrast
export function getContrastingTextColor(bgColor: string): string {
  const luminance = getLuminance(bgColor);
  return luminance > 0.5 ? "#212529" : "#f8f9fa"; // dark text for light bg, light text for dark bg
}
export const darkenColor = (hex: string, percent: number) => {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.max(0, (num >> 16) - amt);
  const G = Math.max(0, ((num >> 8) & 0x00FF) - amt);
  const B = Math.max(0, (num & 0x0000FF) - amt);
  return `rgb(${R}, ${G}, ${B})`;
};