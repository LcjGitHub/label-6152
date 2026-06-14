import {
  Badge,
  Box,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Heading,
  HStack,
  Text,
  VStack,
} from '@chakra-ui/react';
import type { Star } from '@/types/star';

interface StarDetailDrawerProps {
  star: Star | null;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * 星官详情 Drawer（列表页使用）
 */
export function StarDetailDrawer({ star, isOpen, onClose }: StarDetailDrawerProps) {
  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md">
      <DrawerOverlay />
      <DrawerContent bg="gray.900">
        <DrawerCloseButton />
        <DrawerHeader borderBottomWidth="1px" borderColor="whiteAlpha.200">
          {star?.name ?? '星官详情'}
        </DrawerHeader>
        <DrawerBody>
          {star && (
            <VStack align="stretch" spacing={4} pt={2}>
              <HStack>
                <Badge colorScheme="purple">{star.enclosure}</Badge>
                <Badge colorScheme="blue">视星等 {star.magnitude}</Badge>
              </HStack>
              <Box>
                <Heading size="sm" mb={2} color="gray.400">
                  简介
                </Heading>
                <Text lineHeight="tall">{star.summary}</Text>
              </Box>
              <Box>
                <Heading size="sm" mb={2} color="gray.400">
                  坐标
                </Heading>
                <Text fontSize="sm" color="gray.500">
                  示意位置：{star.x}% × {star.y}%
                </Text>
              </Box>
            </VStack>
          )}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
