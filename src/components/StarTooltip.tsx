import { Box, Text } from '@chakra-ui/react';
import type { Star, PopoverAnchor } from '@/types/star';

interface StarTooltipProps {
  star: Star | null;
  anchor: PopoverAnchor | null;
}

/**
 * 星官悬停提示小气泡
 * 鼠标移到星点附近时显示星官名称，移出后消失
 */
export function StarTooltip({ star, anchor }: StarTooltipProps) {
  if (!star || !anchor) return null;

  const tooltipWidth = 100;
  const offsetX = 14;
  const offsetY = -10;

  let left = anchor.x + offsetX;
  let top = anchor.y + offsetY;

  if (left + tooltipWidth > window.innerWidth - 8) {
    left = anchor.x - tooltipWidth - offsetX;
  }
  if (top < 8) {
    top = anchor.y + 20;
  }

  return (
    <Box
      role="tooltip"
      aria-label={`悬停星官：${star.name}`}
      position="fixed"
      left={`${left}px`}
      top={`${top}px`}
      w={`${tooltipWidth}px`}
      bg="gray.900"
      border="1px solid"
      borderColor="whiteAlpha.400"
      borderRadius="md"
      boxShadow="lg"
      zIndex={20}
      px={2.5}
      py={1.5}
      pointerEvents="none"
      textAlign="center"
    >
      <Text fontWeight="bold" fontSize="sm" noOfLines={1}>
        {star.name}
      </Text>
    </Box>
  );
}
