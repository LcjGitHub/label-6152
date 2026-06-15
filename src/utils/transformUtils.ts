export interface ViewTransform {
  scale: number;
  offsetX: number;
  offsetY: number;
}

export const DEFAULT_TRANSFORM: ViewTransform = {
  scale: 1,
  offsetX: 0,
  offsetY: 0,
};

export const MIN_SCALE = 0.5;
export const MAX_SCALE = 3;
export const ZOOM_STEP = 0.1;

export function screenToWorld(
  screenX: number,
  screenY: number,
  transform: ViewTransform,
): { x: number; y: number } {
  const { scale, offsetX, offsetY } = transform;
  return {
    x: (screenX - offsetX) / scale,
    y: (screenY - offsetY) / scale,
  };
}

export function worldToScreen(
  worldX: number,
  worldY: number,
  transform: ViewTransform,
): { x: number; y: number } {
  const { scale, offsetX, offsetY } = transform;
  return {
    x: worldX * scale + offsetX,
    y: worldY * scale + offsetY,
  };
}

export function applyTransformToContext(
  ctx: CanvasRenderingContext2D,
  transform: ViewTransform,
): void {
  ctx.translate(transform.offsetX, transform.offsetY);
  ctx.scale(transform.scale, transform.scale);
}

export function clampScale(scale: number): number {
  return Math.max(MIN_SCALE, Math.min(MAX_SCALE, scale));
}

export function zoomAtPoint(
  currentTransform: ViewTransform,
  screenX: number,
  screenY: number,
  delta: number,
): ViewTransform {
  const { scale: currentScale, offsetX, offsetY } = currentTransform;

  const worldX = (screenX - offsetX) / currentScale;
  const worldY = (screenY - offsetY) / currentScale;

  const scaleFactor = delta > 0 ? 1 - ZOOM_STEP : 1 + ZOOM_STEP;
  const newScale = clampScale(currentScale * scaleFactor);

  if (newScale === currentScale) {
    return currentTransform;
  }

  const newOffsetX = screenX - worldX * newScale;
  const newOffsetY = screenY - worldY * newScale;

  return {
    scale: newScale,
    offsetX: newOffsetX,
    offsetY: newOffsetY,
  };
}

export function panBy(
  currentTransform: ViewTransform,
  dx: number,
  dy: number,
): ViewTransform {
  return {
    ...currentTransform,
    offsetX: currentTransform.offsetX + dx,
    offsetY: currentTransform.offsetY + dy,
  };
}
