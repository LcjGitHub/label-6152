import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Box, Heading, Text, VStack, HStack, Checkbox, Flex, Button } from '@chakra-ui/react';
import { ViewIcon } from '@chakra-ui/icons';
import { useStarStore } from '@/store/starStore';
import { StarMapCanvas, type StarMapCanvasHandle } from '@/components/StarMapCanvas';
import { StarDetailPopover } from '@/components/StarDetailPopover';
import { StarTooltip } from '@/components/StarTooltip';
import { LegendPanel } from '@/components/LegendPanel';
import { percentToPixel } from '@/utils/starUtils';
import type { Star, PopoverAnchor } from '@/types/star';

/**
 * 简化星图页
 */
export function StarMapPage() {
  const { stars, enclosures, pendingLocateStarId, clearPendingLocateStarId } = useStarStore();
  const [selectedStar, setSelectedStar] = useState<Star | null>(null);
  const [anchor, setAnchor] = useState<PopoverAnchor | null>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [highlightStarId, setHighlightStarId] = useState<string | null>(null);
  const [hoveredStar, setHoveredStar] = useState<Star | null>(null);
  const [hoverAnchor, setHoverAnchor] = useState<PopoverAnchor | null>(null);
  const [visibleEnclosureIds, setVisibleEnclosureIds] = useState<Set<string>>(() => {
    const ids = new Set<string>();
    enclosures.forEach((enc) => ids.add(enc.id));
    return ids;
  });
  const canvasRef = useRef<StarMapCanvasHandle>(null);

  const onlyOneLeft = useMemo(() => visibleEnclosureIds.size === 1, [visibleEnclosureIds]);

  const handleEnclosureToggle = useCallback(
    (enclosureId: string) => {
      setVisibleEnclosureIds((prev) => {
        const next = new Set(prev);
        if (next.has(enclosureId)) {
          if (next.size <= 1) return prev;
          next.delete(enclosureId);

          setSelectedStar((cur) => {
            if (cur && cur.enclosureId === enclosureId) return null;
            return cur;
          });
          setPopoverOpen((cur) => {
            const star = selectedStar;
            if (star && star.enclosureId === enclosureId) return false;
            return cur;
          });
          setHighlightStarId((cur) => {
            if (cur) {
              const s = stars.find((x) => x.id === cur);
              if (s && s.enclosureId === enclosureId) return null;
            }
            return cur;
          });
        } else {
          next.add(enclosureId);
        }
        return next;
      });
    },
    [selectedStar, stars],
  );

  const handleStarClick = (star: Star, anchorX: number, anchorY: number) => {
    setSelectedStar(star);
    setAnchor({ x: anchorX, y: anchorY });
    setPopoverOpen(true);
    setHighlightStarId(star.id);
  };

  const handleStarHover = (star: Star | null, anchorX: number, anchorY: number) => {
    setHoveredStar(star);
    if (star) {
      setHoverAnchor({ x: anchorX, y: anchorY });
    } else {
      setHoverAnchor(null);
    }
  };

  const handleClosePopover = () => {
    setPopoverOpen(false);
    setSelectedStar(null);
    setAnchor(null);
  };

  const handleResetView = useCallback(() => {
    canvasRef.current?.resetView();
  }, []);

  useEffect(() => {
    if (!pendingLocateStarId) return;

    const star = stars.find((s) => s.id === pendingLocateStarId);
    if (!star) {
      clearPendingLocateStarId();
      return;
    }

    if (!visibleEnclosureIds.has(star.enclosureId)) {
      setVisibleEnclosureIds((prev) => {
        const next = new Set(prev);
        next.add(star.enclosureId);
        return next;
      });
    }

    const timer = setTimeout(() => {
      const canvas = canvasRef.current?.getCanvas();
      if (!canvas) {
        clearPendingLocateStarId();
        return;
      }

      const rect = canvas.getBoundingClientRect();
      const anchorX = rect.left + percentToPixel(star.x, rect.width);
      const anchorY = rect.top + percentToPixel(star.y, rect.height);

      setSelectedStar(star);
      setAnchor({ x: anchorX, y: anchorY });
      setPopoverOpen(true);
      setHighlightStarId(star.id);
      clearPendingLocateStarId();
    }, 150);

    return () => clearTimeout(timer);
  }, [pendingLocateStarId, stars, clearPendingLocateStarId, visibleEnclosureIds]);

  return (
    <VStack align="stretch" spacing={4}>
      <Flex justify="space-between" align="flex-start">
        <Box>
          <Heading size="lg" mb={2}>
            简化星图
          </Heading>
          <Text color="gray.400" fontSize="sm">
            Canvas 点阵示意三垣星官分布，坐标为 Mock 百分比位置，非真实天文数据。
          </Text>
        </Box>
        <Button
          leftIcon={<ViewIcon />}
          size="sm"
          variant="outline"
          colorScheme="brand"
          onClick={handleResetView}
        >
          重置视图
        </Button>
      </Flex>

      <Box role="group" aria-label="按垣域显示">
        <Flex gap={6} align="center" flexWrap="wrap">
          <Text fontSize="sm" fontWeight="medium" color="gray.200" mr={-2}>
            按垣域显示
          </Text>
          {enclosures.map((enc) => (
            <Checkbox
              key={enc.id}
              isChecked={visibleEnclosureIds.has(enc.id)}
              isDisabled={onlyOneLeft && visibleEnclosureIds.has(enc.id)}
              onChange={() => handleEnclosureToggle(enc.id)}
              colorScheme="brand"
              sx={{ '.chakra-checkbox__label': { fontSize: 'sm' } }}
            >
              {enc.name}
            </Checkbox>
          ))}
          {onlyOneLeft && (
            <Text fontSize="xs" color="gray.500" fontStyle="italic">
              至少保留一个垣域
            </Text>
          )}
        </Flex>
      </Box>

      <HStack align="stretch" spacing={4}>
        <Box position="relative" flex="1">
          <StarMapCanvas
            ref={canvasRef}
            stars={stars}
            enclosures={enclosures}
            visibleEnclosureIds={visibleEnclosureIds}
            onStarClick={handleStarClick}
            onStarHover={handleStarHover}
            highlightStarId={highlightStarId}
          />
          <StarDetailPopover
            star={selectedStar}
            anchor={anchor}
            isOpen={popoverOpen}
            onClose={handleClosePopover}
          />
          <StarTooltip
            star={popoverOpen && hoveredStar?.id === selectedStar?.id ? null : hoveredStar}
            anchor={hoverAnchor}
          />
        </Box>
        <LegendPanel />
      </HStack>
    </VStack>
  );
}
