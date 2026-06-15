import { createSearchParams, useNavigate } from 'react-router-dom';
import { Box, Heading, Text, VStack, SimpleGrid, Badge, HStack } from '@chakra-ui/react';
import { useLunarMansionStore } from '@/store/lunarMansionStore';
import type { MansionGroup } from '@/types/lunarMansion';

const directionColors: Record<string, string> = {
  '东方苍龙': 'green',
  '北方玄武': 'cyan',
  '西方白虎': 'orange',
  '南方朱雀': 'red',
};

const directionSymbols: Record<string, string> = {
  '东方苍龙': '🐉',
  '北方玄武': '🐢',
  '西方白虎': '🐅',
  '南方朱雀': '🐦',
};

export function FourSymbolsPage() {
  const navigate = useNavigate();
  const { groups } = useLunarMansionStore();

  const handleCardClick = (group: MansionGroup) => {
    navigate({
      pathname: '/二十八宿',
      search: createSearchParams({ direction: group.direction }).toString(),
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent, group: MansionGroup) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCardClick(group);
    }
  };

  return (
    <VStack align="stretch" spacing={8}>
      <Box>
        <Heading size="lg" mb={2}>
          四象概览
        </Heading>
        <Text color="gray.400" fontSize="sm">
          四象是中国古代将二十八宿按东南西北四个方位划分的四大星区，分别以青龙、玄武、白虎、朱雀命名。点击卡片查看对应星宿列表。
        </Text>
      </Box>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
        {groups.map((group) => {
          const count = group.mansions.length;
          const color = directionColors[group.direction];
          const symbol = directionSymbols[group.direction];
          const ariaLabel = `${group.direction}，${group.description}，共${count}宿，点击查看详情`;
          return (
            <Box
              key={group.direction}
              as="article"
              role="button"
              tabIndex={0}
              p={6}
              borderRadius="lg"
              bg="whiteAlpha.50"
              border="1px solid"
              borderColor="whiteAlpha.100"
              cursor="pointer"
              transition="all 0.2s"
              aria-label={ariaLabel}
              _hover={{
                bg: 'whiteAlpha.100',
                borderColor: `${color}.400`,
                transform: 'translateY(-2px)',
                boxShadow: `0 4px 20px rgba(0, 0, 0, 0.2)`,
              }}
              _focusVisible={{
                outline: '2px solid',
                outlineColor: `${color}.400`,
                outlineOffset: '2px',
                bg: 'whiteAlpha.100',
              }}
              onClick={() => handleCardClick(group)}
              onKeyDown={(e: React.KeyboardEvent) => handleKeyDown(e, group)}
            >
              <VStack align="stretch" spacing={4}>
                <HStack justify="space-between">
                  <HStack>
                    <Text fontSize="3xl">{symbol}</Text>
                    <Heading size="md" fontFamily="heading" letterSpacing="wide">
                      {group.direction}
                    </Heading>
                  </HStack>
                  <Badge colorScheme={color} fontSize="sm" px={2} py={1}>
                    {count} 宿
                  </Badge>
                </HStack>
                <Text color="gray.400" lineHeight="tall">
                  {group.description}
                </Text>
                <Text fontSize="sm" color={`${color}.300`} fontWeight="medium">
                  查看详情 →
                </Text>
              </VStack>
            </Box>
          );
        })}
      </SimpleGrid>
    </VStack>
  );
}
