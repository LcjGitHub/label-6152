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
  Text,
  VStack,
} from '@chakra-ui/react';
import type { AstronomyTerm } from '@/types/astronomyTerm';
import { CATEGORIES } from '@/types/astronomyTerm';

interface AstronomyTermDrawerProps {
  term: AstronomyTerm | null;
  isOpen: boolean;
  onClose: () => void;
}

export function AstronomyTermDrawer({ term, isOpen, onClose }: AstronomyTermDrawerProps) {
  const categoryInfo = term
    ? CATEGORIES.find((cat) => cat.name === term.category) ?? null
    : null;

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md">
      <DrawerOverlay />
      <DrawerContent bg="gray.900">
        <DrawerCloseButton aria-label="关闭" />
        <DrawerHeader borderBottomWidth="1px" borderColor="whiteAlpha.200">
          <VStack align="stretch" spacing={2}>
            <Text fontSize="lg" fontWeight="bold">
              {term?.name ?? '术语详情'}
            </Text>
            {term && categoryInfo && (
              <Badge colorScheme={categoryInfo.colorScheme} alignSelf="flex-start">
                {term.category}
              </Badge>
            )}
          </VStack>
        </DrawerHeader>
        <DrawerBody>
          {term && (
            <VStack align="stretch" spacing={5} pt={2}>
              <Box>
                <Heading size="sm" mb={2} color="gray.400">
                  简要释义
                </Heading>
                <Text lineHeight="tall" color="gray.200">
                  {term.summary}
                </Text>
              </Box>
              <Box>
                <Heading size="sm" mb={2} color="gray.400">
                  详细说明
                </Heading>
                <Text lineHeight="tall" color="gray.200">
                  {term.detail}
                </Text>
              </Box>
            </VStack>
          )}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
