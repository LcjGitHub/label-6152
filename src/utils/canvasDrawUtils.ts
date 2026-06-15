import type { Star, StarHitArea, Enclosure } from '@/types/star';
import { magnitudeToRadius, percentToPixel } from './starUtils';

export interface EnclosureRegion {
  x: number;
  y: number;
  w: number;
  h: number;
}

export const ENCLOSURE_REGIONS: Record<string, EnclosureRegion> = {
  ziwei: { x: 28, y: 12, w: 44, h: 28 },
  taiwei: { x: 32, y: 38, w: 40, h: 28 },
  tianshi: { x: 20, y: 62, w: 56, h: 30 },
};

export const DECORATIVE_DOT_COUNT = 80;

export interface DrawColors {
  canvasBg: string;
  dotColor: string;
  enclosureFill: string;
  enclosureBorder: string;
}

export function drawBackground(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  color: string,
): void {
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, width, height);
}

export function drawEnclosureRegions(
  ctx: CanvasRenderingContext2D,
  enclosures: Enclosure[],
  visibleEnclosureIds: Set<string>,
  width: number,
  height: number,
  fillColor: string,
  borderColor: string,
): void {
  enclosures.forEach((enc) => {
    if (!visibleEnclosureIds.has(enc.id)) return;
    const region = ENCLOSURE_REGIONS[enc.id];
    if (!region) return;

    const rx = percentToPixel(region.x, width);
    const ry = percentToPixel(region.y, height);
    const rw = percentToPixel(region.w, width);
    const rh = percentToPixel(region.h, height);

    ctx.fillStyle = fillColor;
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(rx, ry, rw, rh, 8);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = 'rgba(200, 210, 255, 0.5)';
    ctx.font = '13px "Noto Sans SC", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(enc.name, rx + 10, ry + 22);
  });
}

export function drawDecorativeDots(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  count: number = DECORATIVE_DOT_COUNT,
): void {
  ctx.fillStyle = 'rgba(255,255,255,0.15)';
  for (let i = 0; i < count; i++) {
    const sx = ((i * 137.508) % 100) / 100 * width;
    const sy = ((i * 97.31) % 100) / 100 * height;
    const sr = (i % 3) * 0.5 + 0.5;
    ctx.beginPath();
    ctx.arc(sx, sy, sr, 0, Math.PI * 2);
    ctx.fill();
  }
}

export function drawStarHighlightRing(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
): void {
  const hlRadius = radius + 12;
  ctx.strokeStyle = 'rgba(159, 122, 234, 0.9)';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(cx, cy, hlRadius, 0, Math.PI * 2);
  ctx.stroke();

  const hlGlow = ctx.createRadialGradient(cx, cy, radius, cx, cy, hlRadius + 8);
  hlGlow.addColorStop(0, 'rgba(159, 122, 234, 0.35)');
  hlGlow.addColorStop(1, 'rgba(159, 122, 234, 0)');
  ctx.fillStyle = hlGlow;
  ctx.beginPath();
  ctx.arc(cx, cy, hlRadius + 8, 0, Math.PI * 2);
  ctx.fill();
}

export function drawStar(
  ctx: CanvasRenderingContext2D,
  star: Star,
  cx: number,
  cy: number,
  radius: number,
  dotColor: string,
): void {
  const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius * 2.5);
  gradient.addColorStop(0, 'rgba(255, 245, 157, 0.35)');
  gradient.addColorStop(1, 'rgba(255, 245, 157, 0)');
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 2.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = dotColor;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = 'rgba(230, 235, 255, 0.75)';
  ctx.font = '11px "Noto Sans SC", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(star.name, cx, cy + radius + 14);
}

export function drawStarsAndGetHitAreas(
  ctx: CanvasRenderingContext2D,
  stars: Star[],
  visibleEnclosureIds: Set<string>,
  width: number,
  height: number,
  dotColor: string,
  highlightStarId?: string | null,
): StarHitArea[] {
  const hitAreas: StarHitArea[] = [];
  stars.forEach((star) => {
    if (!visibleEnclosureIds.has(star.enclosureId)) return;
    const cx = percentToPixel(star.x, width);
    const cy = percentToPixel(star.y, height);
    const radius = magnitudeToRadius(star.magnitude);

    drawStar(ctx, star, cx, cy, radius, dotColor);

    if (highlightStarId && star.id === highlightStarId) {
      drawStarHighlightRing(ctx, cx, cy, radius);
    }

    hitAreas.push({ star, cx, cy, radius: radius + 6 });
  });
  return hitAreas;
}

export function setupCanvas(
  canvas: HTMLCanvasElement,
  width: number,
  height: number,
  dpr: number,
): CanvasRenderingContext2D | null {
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, width, height);
  return ctx;
}
