import {
  Badge,
  Box,
  Button,
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
import { useNavigate } from 'react-router-dom';
import { FavoriteButton } from '@/components/FavoriteButton';
import { useStarStore } from '@/store/starStore';
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
  const navigate = useNavigate();
  const { setPendingLocateStarId } = useStarStore();

  const handleViewInMap = () => {
    if (!star) return;
    setPendingLocateStarId(star.id);
    onClose();
    navigate('/map');
  };

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md">
      <DrawerOverlay />
      <DrawerContent bg="gray.900">
        <DrawerCloseButton aria-label="关闭" />
        <DrawerHeader borderBottomWidth="1px" borderColor="whiteAlpha.200">
          <HStack justify="space-between">
            <Text fontSize="lg" fontWeight="bold">
              {star?.name ?? '星官详情'}
            </Text>
            {star && <FavoriteButton starId={star.id} starName={star.name} />}
          </HStack>
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
              <Button
                colorScheme="purple"
                variant="outline"
                onClick={handleViewInMap}
                aria-label={star ? `在星图中查看并定位${star.name}` : '在星图中查看'}
              >
                在星图中查看
              </Button>
            </VStack>
          )}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
