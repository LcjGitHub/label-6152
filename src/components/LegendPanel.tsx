import { useState } from 'react';
import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  VStack,
  useToken,
  Collapse,
  IconButton,
} from '@chakra-ui/react';
import { ChevronRightIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { LEGEND_DATA, magnitudeToRadius } from '@/utils/starUtils';
import type { LegendCategory } from '@/utils/starUtils';

interface LegendPanelProps {
  defaultCollapsed?: boolean;
}

/**
 * 三垣区域示意图标
 */
function EnclosureIcon() {
  const [enclosureFill, enclosureBorder] = useToken('colors', [
    'star.enclosure',
    'star.enclosureBorder',
  ]);

  return (
    <Box w="80px" h="24px" flexShrink={0} display="flex" alignItems="center">
      <Box
        w="36px"
        h="24px"
        borderRadius="md"
        bg={enclosureFill}
        border="1px solid"
        borderColor={enclosureBorder}
      />
    </Box>
  );
}

function StarMagnitudeIcon() {
  const [dotColor] = useToken('colors', ['star.dot']);
  const magnitudes = [1.5, 3, 4.5];

  return (
    <Flex w="80px" h="24px" align="flex-end" justify="space-around" flexShrink={0}>
      {magnitudes.map((mag, i) => {
        const radius = magnitudeToRadius(mag);
        return (
          <Flex key={i} direction="column" align="center">
            <Box
              w={`${radius * 2}px`}
              h={`${radius * 2}px`}
              borderRadius="full"
              bg={dotColor}
            />
            <Text
              fontSize="10px"
              color="gray.400"
              lineHeight="1"
              mt="1px"
              aria-label={`视星等 ${mag}`}
              role="img"
            >
              {mag}
            </Text>
          </Flex>
        );
      })}
    </Flex>
  );
}

/**
 * 背景散点示意图标
 */
function BackgroundDotsIcon() {
  const dots = [
    { x: 4, y: 6, r: 1.5 },
    { x: 14, y: 10, r: 1 },
    { x: 24, y: 5, r: 2 },
    { x: 8, y: 16, r: 1.2 },
    { x: 20, y: 18, r: 0.8 },
    { x: 30, y: 14, r: 1.5 },
  ];

  return (
    <Box w="80px" h="24px" flexShrink={0} display="flex" alignItems="center">
      <Box w="36px" h="24px" position="relative">
        {dots.map((dot, i) => (
          <Box
            key={i}
            position="absolute"
            left={`${dot.x}px`}
            top={`${dot.y}px`}
            w={`${dot.r * 2}px`}
            h={`${dot.r * 2}px`}
            borderRadius="full"
            bg="rgba(255,255,255,0.15)"
          />
        ))}
      </Box>
    </Box>
  );
}

/**
 * 根据分类 ID 获取对应图标
 */
function CategoryIcon({ categoryId }: { categoryId: string }) {
  switch (categoryId) {
    case 'enclosures':
      return <EnclosureIcon />;
    case 'starMagnitude':
      return <StarMagnitudeIcon />;
    case 'background':
      return <BackgroundDotsIcon />;
    default:
      return null;
  }
}

/**
 * 图例分类折叠面板
 */
function LegendCategorySection({ category }: { category: LegendCategory }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Box>
      <Flex align="center" py={2}>
        <IconButton
          aria-label={isOpen ? `折叠${category.title}` : `展开${category.title}`}
          icon={isOpen ? <ChevronDownIcon /> : <ChevronRightIcon />}
          size="xs"
          variant="ghost"
          colorScheme="whiteAlpha"
          mr={1}
          onClick={() => setIsOpen(!isOpen)}
          _hover={{ color: 'brand.200' }}
        />
        <CategoryIcon categoryId={category.id} />
        <Heading size="sm" ml={3} fontSize="sm" fontWeight="semibold">
          {category.title}
        </Heading>
      </Flex>
      <Collapse in={isOpen}>
        <VStack align="stretch" pl={6} pt={2} pb={1} spacing={3}>
          {category.intro && (
            <Text fontSize="xs" color="gray.500" lineHeight="tall" fontStyle="italic">
              {category.intro}
            </Text>
          )}
          {category.items.map((item) => (
            <Box key={item.id}>
              <Text fontSize="sm" fontWeight="medium" color="gray.200">
                {item.title}
              </Text>
              <Text fontSize="xs" color="gray.400" mt={1} lineHeight="tall">
                {item.description}
              </Text>
            </Box>
          ))}
        </VStack>
      </Collapse>
    </Box>
  );
}

/**
 * 图例说明侧栏面板
 */
export function LegendPanel({ defaultCollapsed = false }: LegendPanelProps) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  return (
    <Box
      position="relative"
      bg="blackAlpha.400"
      borderRadius="lg"
      border="1px solid"
      borderColor="whiteAlpha.100"
      w={isCollapsed ? '40px' : '260px'}
      transition="width 0.3s ease"
      overflow="hidden"
      flexShrink={0}
    >
      {isCollapsed ? (
        <Button
          onClick={() => setIsCollapsed(false)}
          aria-label="展开图例说明"
          h="full"
          w="full"
          minH="120px"
          variant="ghost"
          colorScheme="whiteAlpha"
          sx={{ writingMode: 'vertical-rl' }}
          fontSize="sm"
          color="gray.300"
          letterSpacing="wider"
          _hover={{ color: 'brand.200' }}
          _focusVisible={{ outline: '2px solid', outlineColor: 'brand.300', outlineOffset: '2px' }}
        >
          图例说明
        </Button>
      ) : (
        <Box p={4} h="100%" display="flex" flexDirection="column">
          <Flex align="center" justify="space-between" mb={3} flexShrink={0}>
            <Heading size="sm" fontSize="md">
              图例说明
            </Heading>
            <IconButton
              aria-label="收起图例"
              icon={<ChevronRightIcon />}
              size="sm"
              variant="ghost"
              colorScheme="whiteAlpha"
              onClick={() => setIsCollapsed(true)}
            />
          </Flex>
          <Box overflowY="auto" flex="1" pr={1}>
            <VStack align="stretch" spacing={2}>
              {LEGEND_DATA.map((category) => (
                <LegendCategorySection key={category.id} category={category} />
              ))}
            </VStack>
          </Box>
        </Box>
      )}
    </Box>
  );
}
