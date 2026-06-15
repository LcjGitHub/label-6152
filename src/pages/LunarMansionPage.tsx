import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Box,
  Heading,
  Text,
  VStack,
  Badge,
  HStack,
  SimpleGrid,
  Input,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { useLunarMansionStore } from '@/store/lunarMansionStore';
import { MansionDetailDrawer } from '@/components/MansionDetailDrawer';
import type { LunarMansion } from '@/types/lunarMansion';
import { createMansionFuse, searchMansions } from '@/utils/mansionUtils';
import { getSearchParam, setSearchParam } from '@/utils/urlUtils';

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

export function LunarMansionPage() {
  const { groups, mansions, selectedMansion, drawerOpen, openDrawer, closeDrawer } = useLunarMansionStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const query = getSearchParam(searchParams, 'q');

  const setQuery = useCallback(
    (value: string) => {
      const nextParams = setSearchParam(searchParams, 'q', value);
      setSearchParams(nextParams, { replace: true });
    },
    [searchParams, setSearchParams],
  );

  const fuse = useMemo(() => createMansionFuse(mansions), [mansions]);
  const filteredMansions = useMemo(() => searchMansions(mansions, fuse, query), [mansions, fuse, query]);

  const grouped = useMemo(() => {
    const map = new Map<string, LunarMansion[]>();
    groups.forEach((g) => map.set(g.direction, []));
    filteredMansions.forEach((m) => {
      const list = map.get(m.direction);
      if (list) list.push(m);
    });
    return map;
  }, [filteredMansions, groups]);

  const handleKeyDown = (e: React.KeyboardEvent, mansion: LunarMansion) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openDrawer(mansion);
    }
  };

  return (
    <VStack align="stretch" spacing={6}>
      <Box>
        <Heading size="lg" mb={2}>
          二十八宿名录
        </Heading>
        <Text color="gray.400" fontSize="sm">
          中国古代将黄道附近划分为二十八宿，分属东方苍龙、北方玄武、西方白虎、南方朱雀四象。点击条目查看详情。
        </Text>
      </Box>

      <InputGroup maxW="400px">
        <InputLeftElement pointerEvents="none">
          <SearchIcon color="gray.500" />
        </InputLeftElement>
        <Input
          placeholder="搜索星宿名称、方位或简介…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          bg="whiteAlpha.100"
          border="none"
          _focus={{ bg: 'whiteAlpha.200', boxShadow: 'none' }}
        />
      </InputGroup>

      {filteredMansions.length === 0 ? (
        <Text color="gray.500" py={8} textAlign="center">
          未找到匹配的星宿
        </Text>
      ) : (
        groups.map((group) => {
          const groupMansions = grouped.get(group.direction) ?? [];
          if (groupMansions.length === 0) return null;

          return (
            <Box key={group.direction}>
              <HStack mb={3}>
                <Text fontSize="2xl" mr={2}>{directionSymbols[group.direction]}</Text>
                <Heading size="md">{group.direction}</Heading>
                <Badge colorScheme={directionColors[group.direction]}>{groupMansions.length} 宿</Badge>
              </HStack>
              <Text fontSize="sm" color="gray.500" mb={4}>
                {group.description}
              </Text>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={3}>
                {groupMansions.map((mansion) => {
                  const ariaLabel = `${mansion.name}，${mansion.direction}，${mansion.summary}，按回车键查看详情`;
                  return (
                    <Box
                      key={mansion.id}
                      as="article"
                      role="button"
                      tabIndex={0}
                      p={4}
                      borderRadius="md"
                      bg="whiteAlpha.50"
                      border="1px solid"
                      borderColor="whiteAlpha.100"
                      cursor="pointer"
                      transition="all 0.15s"
                      aria-label={ariaLabel}
                      _hover={{
                        bg: 'whiteAlpha.100',
                        borderColor: `${directionColors[mansion.direction]}.400`,
                        transform: 'translateY(-1px)',
                      }}
                      _focusVisible={{
                        outline: '2px solid',
                        outlineColor: `${directionColors[mansion.direction]}.400`,
                        outlineOffset: '2px',
                        bg: 'whiteAlpha.100',
                      }}
                      onClick={() => openDrawer(mansion)}
                      onKeyDown={(e: React.KeyboardEvent) => handleKeyDown(e, mansion)}
                    >
                      <HStack justify="space-between" mb={1}>
                        <HStack>
                          <Text fontWeight="semibold">{mansion.name}</Text>
                          <Badge fontSize="xs" colorScheme={directionColors[mansion.direction]}>
                            第{mansion.order}宿
                          </Badge>
                        </HStack>
                        <Badge fontSize="xs" colorScheme="purple" variant="outline">
                          {mansion.symbol}
                        </Badge>
                      </HStack>
                      <Text fontSize="xs" color="gray.500" mb={2}>
                        {mansion.pinyin}
                      </Text>
                      <Text fontSize="sm" color="gray.400" noOfLines={2}>
                        {mansion.summary}
                      </Text>
                    </Box>
                  );
                })}
              </SimpleGrid>
            </Box>
          );
        })
      )}

      <MansionDetailDrawer mansion={selectedMansion} isOpen={drawerOpen} onClose={closeDrawer} />
    </VStack>
  );
}
