import { useState, useEffect, useRef, useCallback } from 'react';
import { Box, Heading, Text, VStack, HStack, Checkbox, Flex } from '@chakra-ui/react';
import { useStarStore } from '@/store/starStore';
import { StarMapCanvas } from '@/components/StarMapCanvas';
import { StarDetailPopover } from '@/components/StarDetailPopover';
import { StarTooltip } from '@/components/StarTooltip';
import { LegendPanel } from '@/components/LegendPanel';
import { percentToPixel } from '@/utils/starUtils';
import type { Star, PopoverAnchor } from '@/types/star';

const ENCLOSURE_OPTIONS = [
  { id: 'ziwei', name: '紫微垣' },
  { id: 'taiwei', name: '太微垣' },
  { id: 'tianshi', name: '天市垣' },
] as const;

export function StarMapPage() {
  const { stars, enclosures, pendingLocateStarId, clearPendingLocateStarId } = useStarStore();
  const [selectedStar, setSelectedStar] = useState<Star | null>(null);
  const [anchor, setAnchor] = useState<PopoverAnchor | null>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [highlightStarId, setHighlightStarId] = useState<string | null>(null);
  const [hoveredStar, setHoveredStar] = useState<Star | null>(null);
  const [hoverAnchor, setHoverAnchor] = useState<PopoverAnchor | null>(null);
  const [visibleEnclosureIds, setVisibleEnclosureIds] = useState<Set<string>>(
    new Set(ENCLOSURE_OPTIONS.map((e) => e.id)),
  );
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleEnclosureToggle = useCallback(
    (enclosureId: string) => {
      setVisibleEnclosureIds((prev) => {
        const next = new Set(prev);
        if (next.has(enclosureId)) {
          if (next.size <= 1) return prev;
          next.delete(enclosureId);
        } else {
          next.add(enclosureId);
        }
        return next;
      });
    },
    [],
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

  useEffect(() => {
    if (!pendingLocateStarId) return;

    const star = stars.find((s) => s.id === pendingLocateStarId);
    if (!star) {
      clearPendingLocateStarId();
      return;
    }

    const timer = setTimeout(() => {
      const canvas = canvasRef.current;
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
  }, [pendingLocateStarId, stars, clearPendingLocateStarId]);

  return (
    <VStack align="stretch" spacing={4}>
      <Box>
        <Heading size="lg" mb={2}>
          简化星图
        </Heading>
        <Text color="gray.400" fontSize="sm">
          Canvas 点阵示意三垣星官分布，坐标为 Mock 百分比位置，非真实天文数据。
        </Text>
      </Box>

      <Flex gap={6} align="center" flexWrap="wrap">
        {ENCLOSURE_OPTIONS.map((opt) => (
          <Checkbox
            key={opt.id}
            isChecked={visibleEnclosureIds.has(opt.id)}
            isDisabled={visibleEnclosureIds.size === 1 && visibleEnclosureIds.has(opt.id)}
            onChange={() => handleEnclosureToggle(opt.id)}
            colorScheme="brand"
            sx={{ '.chakra-checkbox__label': { fontSize: 'sm' } }}
          >
            {opt.name}
          </Checkbox>
        ))}
      </Flex>

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
