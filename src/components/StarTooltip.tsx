import { Badge, Box, HStack, Text } from '@chakra-ui/react';
import type { Star, PopoverAnchor } from '@/types/star';

interface StarTooltipProps {
  star: Star | null;
  anchor: PopoverAnchor | null;
}

/**
 * 星官悬停提示小气泡
 * 鼠标移到星点附近时显示星官名称和所属垣，移出后消失
 */
export function StarTooltip({ star, anchor }: StarTooltipProps) {
  if (!star || !anchor) return null;

  const tooltipWidth = 160;
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
      p={2.5}
      pointerEvents="none"
    >
      <Text fontWeight="bold" fontSize="sm" mb={1.5}>
        {star.name}
      </Text>
      <HStack spacing={1.5}>
        <Badge colorScheme="purple" fontSize="xs">
          {star.enclosure}
        </Badge>
        <Text fontSize="xs" color="gray.400">
          视星等 {star.magnitude}
        </Text>
      </HStack>
    </Box>
  );
}
