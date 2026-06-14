import {
  Badge,
  Box,
  HStack,
  IconButton,
  Text,
  VStack,
} from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';
import type { Star, PopoverAnchor } from '@/types/star';

interface StarDetailPopoverProps {
  star: Star | null;
  anchor: PopoverAnchor | null;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * 星官详情浮动卡片（星图页点击星点后显示）
 */
export function StarDetailPopover({ star, anchor, isOpen, onClose }: StarDetailPopoverProps) {
  if (!isOpen || !star || !anchor) return null;

  const cardWidth = 280;
  const left = Math.min(Math.max(anchor.x - cardWidth / 2, 8), window.innerWidth - cardWidth - 8);
  const top = Math.max(anchor.y - 140, 80);

  return (
    <>
      <Box position="fixed" inset={0} zIndex={10} onClick={onClose} />
      <Box
        position="fixed"
        left={`${left}px`}
        top={`${top}px`}
        w={`${cardWidth}px`}
        bg="gray.800"
        border="1px solid"
        borderColor="whiteAlpha.300"
        borderRadius="md"
        boxShadow="xl"
        zIndex={11}
        p={4}
      >
        <HStack justify="space-between" mb={2}>
          <Text fontWeight="bold" fontSize="md">
            {star.name}
          </Text>
          <IconButton
            aria-label="关闭"
            icon={<CloseIcon boxSize={2.5} />}
            size="xs"
            variant="ghost"
            onClick={onClose}
          />
        </HStack>
        <VStack align="stretch" spacing={2}>
          <HStack>
            <Badge colorScheme="purple" fontSize="xs">
              {star.enclosure}
            </Badge>
            <Badge colorScheme="blue" fontSize="xs">
              视星等 {star.magnitude}
            </Badge>
          </HStack>
          <Text fontSize="sm" lineHeight="tall" color="gray.200">
            {star.summary}
          </Text>
        </VStack>
      </Box>
    </>
  );
}
