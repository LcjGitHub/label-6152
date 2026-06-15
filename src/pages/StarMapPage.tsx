import { useState } from 'react';
import { Box, Heading, Text, VStack, HStack } from '@chakra-ui/react';
import { useStarStore } from '@/store/starStore';
import { StarMapCanvas } from '@/components/StarMapCanvas';
import { StarDetailPopover } from '@/components/StarDetailPopover';
import { LegendPanel } from '@/components/LegendPanel';
import type { Star, PopoverAnchor } from '@/types/star';

/**
 * 简化星图页
 */
export function StarMapPage() {
  const { stars, enclosures } = useStarStore();
  const [selectedStar, setSelectedStar] = useState<Star | null>(null);
  const [anchor, setAnchor] = useState<PopoverAnchor | null>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);

  /**
   * 星点点击回调
   */
  const handleStarClick = (star: Star, anchorX: number, anchorY: number) => {
    setSelectedStar(star);
    setAnchor({ x: anchorX, y: anchorY });
    setPopoverOpen(true);
  };

  const handleClosePopover = () => {
    setPopoverOpen(false);
    setSelectedStar(null);
    setAnchor(null);
  };

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

      <HStack align="stretch" spacing={4}>
        <Box position="relative" flex="1">
          <StarMapCanvas stars={stars} enclosures={enclosures} onStarClick={handleStarClick} />
          <StarDetailPopover
            star={selectedStar}
            anchor={anchor}
            isOpen={popoverOpen}
            onClose={handleClosePopover}
          />
        </Box>
        <LegendPanel />
      </HStack>
    </VStack>
  );
}
