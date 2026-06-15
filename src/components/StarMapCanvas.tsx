import { forwardRef, useCallback, useEffect, useRef } from 'react';
import { Box, Text, useToken } from '@chakra-ui/react';
import type { Star, StarHitArea, Enclosure } from '@/types/star';
import { magnitudeToRadius, percentToPixel, hitTestStar } from '@/utils/starUtils';

interface StarMapCanvasProps {
  stars: Star[];
  enclosures: Enclosure[];
  onStarClick: (star: Star, anchorX: number, anchorY: number) => void;
  /** 需要高亮定位的星官 ID */
  highlightStarId?: string | null;
}

/** 三垣示意区域（百分比） */
const ENCLOSURE_REGIONS: Record<string, { x: number; y: number; w: number; h: number }> = {
  ziwei: { x: 28, y: 12, w: 44, h: 28 },
  taiwei: { x: 32, y: 38, w: 40, h: 28 },
  tianshi: { x: 20, y: 62, w: 56, h: 30 },
};

/**
 * Canvas 点阵示意星图
 * 通过 forwardRef 暴露内部 canvas 元素，供父组件计算精确锚点
 */
export const StarMapCanvas = forwardRef<HTMLCanvasElement, StarMapCanvasProps>(
  function StarMapCanvas({ stars, enclosures, onStarClick, highlightStarId }, ref) {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasNodeRef = useRef<HTMLCanvasElement | null>(null);
    const hitAreasRef = useRef<StarHitArea[]>([]);
    const [canvasBg, dotColor, enclosureFill, enclosureBorder] = useToken('colors', [
      'star.canvas',
      'star.dot',
      'star.enclosure',
      'star.enclosureBorder',
    ]);

    /**
     * 合并外部转发 ref 与内部 canvas 引用
     */
    const setCanvasRef = useCallback(
      (node: HTMLCanvasElement | null) => {
        canvasNodeRef.current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLCanvasElement | null>).current = node;
        }
      },
      [ref],
    );

    /**
     * 绘制星图
     */
    const draw = useCallback(() => {
      const canvas = canvasNodeRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const width = rect.width;
      const height = rect.height;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      // 背景
      ctx.fillStyle = canvasBg;
      ctx.fillRect(0, 0, width, height);

      // 三垣区域
      enclosures.forEach((enc) => {
        const region = ENCLOSURE_REGIONS[enc.id];
        if (!region) return;

        const rx = percentToPixel(region.x, width);
        const ry = percentToPixel(region.y, height);
        const rw = percentToPixel(region.w, width);
        const rh = percentToPixel(region.h, height);

        ctx.fillStyle = enclosureFill;
        ctx.strokeStyle = enclosureBorder;
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

      // 背景装饰星点
      const seedStars = 80;
      ctx.fillStyle = 'rgba(255,255,255,0.15)';
      for (let i = 0; i < seedStars; i++) {
        const sx = ((i * 137.508) % 100) / 100 * width;
        const sy = ((i * 97.31) % 100) / 100 * height;
        const sr = (i % 3) * 0.5 + 0.5;
        ctx.beginPath();
        ctx.arc(sx, sy, sr, 0, Math.PI * 2);
        ctx.fill();
      }

      // 星官星点
      const hitAreas: StarHitArea[] = [];
      stars.forEach((star) => {
        const cx = percentToPixel(star.x, width);
        const cy = percentToPixel(star.y, height);
        const radius = magnitudeToRadius(star.magnitude);

        // 光晕
        const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius * 2.5);
        gradient.addColorStop(0, 'rgba(255, 245, 157, 0.35)');
        gradient.addColorStop(1, 'rgba(255, 245, 157, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(cx, cy, radius * 2.5, 0, Math.PI * 2);
        ctx.fill();

        // 星点
        ctx.fillStyle = dotColor;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fill();

        // 标签
        ctx.fillStyle = 'rgba(230, 235, 255, 0.75)';
        ctx.font = '11px "Noto Sans SC", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(star.name, cx, cy + radius + 14);

        // 高亮定位环
        if (highlightStarId && star.id === highlightStarId) {
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

        hitAreas.push({ star, cx, cy, radius: radius + 6 });
      });

      hitAreasRef.current = hitAreas;
    }, [stars, enclosures, canvasBg, dotColor, enclosureFill, enclosureBorder, highlightStarId]);

    useEffect(() => {
      draw();
      const handleResize = () => draw();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, [draw]);

    /**
     * 处理 Canvas 点击
     */
    const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasNodeRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;

      const hit = hitTestStar(hitAreasRef.current, px, py);
      if (hit) {
        onStarClick(hit, e.clientX, e.clientY);
      }
    };

    return (
      <Box ref={containerRef} position="relative" w="full" h="520px" borderRadius="lg" overflow="hidden">
        <canvas
          ref={setCanvasRef}
          onClick={handleClick}
          style={{ cursor: 'crosshair', display: 'block' }}
        />
        <Text
          position="absolute"
          bottom={3}
          right={4}
          fontSize="xs"
          color="whiteAlpha.500"
          pointerEvents="none"
        >
          点击星点查看简介
        </Text>
      </Box>
    );
  },
);
