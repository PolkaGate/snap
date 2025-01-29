export const updateSvgDimensions = (svgString: string, width: number | string, height?: number | string): string => {
  // If only one value is provided, set both width and height to the same value
  if (height === undefined) {
    height = width;
  }

  // Convert numbers to strings if needed
  const widthStr = typeof width === 'number' ? `${width}px` : width;
  const heightStr = typeof height === 'number' ? `${height}px` : height;

  // Replace the width and height in the SVG string
  return svgString.replace(/(<svg[^>]+)(width="[^"]*")([^>]+>)/, `$1width="${widthStr}"$3`)
                  .replace(/(<svg[^>]+)(height="[^"]*")([^>]+>)/, `$1height="${heightStr}"$3`);
};