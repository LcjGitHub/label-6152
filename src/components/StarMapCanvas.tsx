import { forwardRef, useCallback, useEffect, useRef, useState, useImperativeHandle } from 'react';
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
import {
  DEFAULT_TRANSFORM,
  screenToWorld,
  zoomAtPoint,
  panBy,
  type ViewTransform,
} from '@/utils/transformUtils';

export interface StarMapCanvasHandle {
  resetView: () => void;
  getCanvas: () => HTMLCanvasElement | null;
}

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
export const StarMapCanvas = forwardRef<StarMapCanvasHandle, StarMapCanvasProps>(
  function StarMapCanvas({ stars, enclosures, visibleEnclosureIds, onStarClick, onStarHover, highlightStarId }, ref) {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasNodeRef = useRef<HTMLCanvasElement | null>(null);
    const hitAreasRef = useRef<StarHitArea[]>([]);
    const transformRef = useRef<ViewTransform>({ ...DEFAULT_TRANSFORM });
    const isDraggingRef = useRef(false);
    const lastMousePosRef = useRef({ x: 0, y: 0 });
    const [hoveredStarId, setHoveredStarId] = useState<string | null>(null);
    const [transform, setTransform] = useState<ViewTransform>({ ...DEFAULT_TRANSFORM });
    const [canvasBg, dotColor, enclosureFill, enclosureBorder] = useToken('colors', [
      'star.canvas',
      'star.dot',
      'star.enclosure',
      'star.enclosureBorder',
    ]);

    const resetView = useCallback(() => {
      const newTransform = { ...DEFAULT_TRANSFORM };
      transformRef.current = newTransform;
      setTransform(newTransform);
    }, []);

    useImperativeHandle(
      ref,
      () => ({
        resetView,
        getCanvas: () => canvasNodeRef.current,
      }),
      [resetView],
    );

    /**
     * 合并外部转发 ref 与内部 canvas 引用
     */
    const setCanvasRef = useCallback((node: HTMLCanvasElement | null) => {
      canvasNodeRef.current = node;
    }, []);

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

      const currentTransform = transformRef.current;

      drawBackground(ctx, width, height, canvasBg);
      drawEnclosureRegions(ctx, enclosures, visibleEnclosureIds, width, height, enclosureFill, enclosureBorder, currentTransform);
      drawDecorativeDots(ctx, width, height, undefined, currentTransform);
      hitAreasRef.current = drawStarsAndGetHitAreas(ctx, stars, visibleEnclosureIds, width, height, dotColor, highlightStarId, currentTransform);
    }, [stars, enclosures, visibleEnclosureIds, canvasBg, dotColor, enclosureFill, enclosureBorder, highlightStarId]);

    useEffect(() => {
      draw();
    }, [draw, transform]);

    useEffect(() => {
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

      if (isDraggingRef.current) {
        return;
      }

      const rect = canvas.getBoundingClientRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;

      const { x: worldX, y: worldY } = screenToWorld(px, py, transformRef.current);
      const hit = hitTestStar(hitAreasRef.current, worldX, worldY);
      if (hit) {
        onStarClick(hit, e.clientX, e.clientY);
      }
    };

    /**
     * 处理鼠标按下，开始拖拽
     */
    const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
      isDraggingRef.current = false;
      lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    };

    /**
     * 处理鼠标移动，检测悬停星点和拖拽
     */
    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasNodeRef.current;
      if (!canvas) return;

      if (e.buttons === 1) {
        const dx = e.clientX - lastMousePosRef.current.x;
        const dy = e.clientY - lastMousePosRef.current.y;

        if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
          isDraggingRef.current = true;
        }

        if (isDraggingRef.current) {
          const newTransform = panBy(transformRef.current, dx, dy);
          transformRef.current = newTransform;
          setTransform(newTransform);
          lastMousePosRef.current = { x: e.clientX, y: e.clientY };
          return;
        }
      }

      const rect = canvas.getBoundingClientRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;

      const { x: worldX, y: worldY } = screenToWorld(px, py, transformRef.current);
      const hit = hitTestStar(hitAreasRef.current, worldX, worldY);
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
     * 处理鼠标抬起
     */
    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    /**
     * 处理滚轮缩放
     */
    const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
      e.preventDefault();
      const canvas = canvasNodeRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;

      const newTransform = zoomAtPoint(transformRef.current, px, py, e.deltaY);
      if (newTransform !== transformRef.current) {
        transformRef.current = newTransform;
        setTransform(newTransform);
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

    const getCursor = () => {
      if (isDraggingRef.current) return 'grabbing';
      if (hoveredStarId) return 'pointer';
      return 'grab';
    };

    return (
      <Box ref={containerRef} position="relative" w="full" h="520px" borderRadius="lg" overflow="hidden">
        <canvas
          ref={setCanvasRef}
          onClick={handleClick}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onWheel={handleWheel}
          style={{ cursor: getCursor(), display: 'block' }}
        />
        <Text
          position="absolute"
          bottom={3}
          right={4}
          fontSize="xs"
          color="whiteAlpha.500"
          pointerEvents="none"
        >
          滚轮缩放 · 拖拽平移 · 点击星点查看简介
        </Text>
      </Box>
    );
  },
);
