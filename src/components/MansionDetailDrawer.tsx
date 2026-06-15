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
  Tag,
  Wrap,
  WrapItem,
  Divider,
} from '@chakra-ui/react';
import type { LunarMansion } from '@/types/lunarMansion';

interface MansionDetailDrawerProps {
  mansion: LunarMansion | null;
  isOpen: boolean;
  onClose: () => void;
}

const directionColors: Record<string, string> = {
  '东方苍龙': 'green',
  '北方玄武': 'cyan',
  '西方白虎': 'orange',
  '南方朱雀': 'red',
};

export function MansionDetailDrawer({ mansion, isOpen, onClose }: MansionDetailDrawerProps) {
  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md">
      <DrawerOverlay />
      <DrawerContent bg="gray.900">
        <DrawerCloseButton aria-label="关闭" />
        <DrawerHeader borderBottomWidth="1px" borderColor="whiteAlpha.200">
          <VStack align="stretch" spacing={2}>
            <HStack justify="space-between">
              <Text fontSize="xl" fontWeight="bold">
                {mansion?.name ?? '星宿详情'}
              </Text>
              <Badge fontSize="sm" colorScheme={mansion ? directionColors[mansion.direction] : 'gray'}>
                第 {mansion?.order ?? '-'} 宿
              </Badge>
            </HStack>
            <Text fontSize="sm" color="gray.400">
              {mansion?.pinyin}
            </Text>
          </VStack>
        </DrawerHeader>
        <DrawerBody>
          {mansion && (
            <VStack align="stretch" spacing={4} pt={2}>
              <HStack wrap="wrap">
                <Badge colorScheme={directionColors[mansion.direction]}>{mansion.direction}</Badge>
                <Badge colorScheme="purple">{mansion.symbol}</Badge>
                <Badge colorScheme="blue">最佳观测：{mansion.bestSeason}</Badge>
              </HStack>

              <Box>
                <Heading size="sm" mb={2} color="gray.400">
                  简介
                </Heading>
                <Text lineHeight="tall">{mansion.summary}</Text>
              </Box>

              <Divider borderColor="whiteAlpha.200" />

              <Box>
                <Heading size="sm" mb={2} color="gray.400">
                  详细说明
                </Heading>
                <Text lineHeight="tall" fontSize="sm">
                  {mansion.description}
                </Text>
              </Box>

              <Box>
                <Heading size="sm" mb={2} color="gray.400">
                  主要恒星
                </Heading>
                <Wrap>
                  {mansion.stars.map((star, idx) => (
                    <WrapItem key={idx}>
                      <Tag size="sm" colorScheme="teal" variant="subtle">
                        {star}
                      </Tag>
                    </WrapItem>
                  ))}
                </Wrap>
              </Box>
            </VStack>
          )}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
