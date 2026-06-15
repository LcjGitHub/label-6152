import { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import { Box, Text, useToken } from '@chakra-ui/react';
import type { Star, StarHitArea, Enclosure } from '@/types/star';
import { hitTestStar } from '@/utils/starUtils';
import {
  drawBackground,
  drawEnclosureRegions,
  drawDecorativeDots,
  drawStarsAndGetHitAreas,
  setupCanvas,
} from '@/utils/canvasDrawUtils';

interface StarMapCanvasProps {
  stars: Star[];
  enclosures: Enclosure[];
  visibleEnclosureIds: Set<string>;
  onStarClick: (star: Star, anchorX: number, anchorY: number) => void;
  /** 鼠标悬停星点时的回调，star 为 null 表示移出 */
  onStarHover?: (star: Star | null, anchorX: number, anchorY: number) => void;
  /** 需要高亮定位的星官 ID */
  highlightStarId?: string | null;
}

/**
 * Canvas 点阵示意星图
 * 通过 forwardRef 暴露内部 canvas 元素，供父组件计算精确锚点
 */
export const StarMapCanvas = forwardRef<HTMLCanvasElement, StarMapCanvasProps>(
  function StarMapCanvas({ stars, enclosures, visibleEnclosureIds, onStarClick, onStarHover, highlightStarId }, ref) {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasNodeRef = useRef<HTMLCanvasElement | null>(null);
    const hitAreasRef = useRef<StarHitArea[]>([]);
    const [hoveredStarId, setHoveredStarId] = useState<string | null>(null);
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

      const ctx = setupCanvas(canvas, width, height, dpr);
      if (!ctx) return;

      drawBackground(ctx, width, height, canvasBg);
      drawEnclosureRegions(ctx, enclosures, visibleEnclosureIds, width, height, enclosureFill, enclosureBorder);
      drawDecorativeDots(ctx, width, height);
      hitAreasRef.current = drawStarsAndGetHitAreas(ctx, stars, visibleEnclosureIds, width, height, dotColor, highlightStarId);
    }, [stars, enclosures, visibleEnclosureIds, canvasBg, dotColor, enclosureFill, enclosureBorder, highlightStarId]);

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

    /**
     * 处理鼠标移动，检测悬停星点
     */
    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasNodeRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;

      const hit = hitTestStar(hitAreasRef.current, px, py);
      if (hit) {
        if (hoveredStarId !== hit.id) {
          setHoveredStarId(hit.id);
        }
        onStarHover?.(hit, e.clientX, e.clientY);
      } else {
        if (hoveredStarId !== null) {
          setHoveredStarId(null);
        }
        onStarHover?.(null, e.clientX, e.clientY);
      }
    };

    /**
     * 处理鼠标离开画布
     */
    const handleMouseLeave = () => {
      if (hoveredStarId !== null) {
        setHoveredStarId(null);
      }
      onStarHover?.(null, 0, 0);
    };

    return (
      <Box ref={containerRef} position="relative" w="full" h="520px" borderRadius="lg" overflow="hidden">
        <canvas
          ref={setCanvasRef}
          onClick={handleClick}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ cursor: hoveredStarId ? 'pointer' : 'crosshair', display: 'block' }}
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
