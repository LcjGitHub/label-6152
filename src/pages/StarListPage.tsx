import { useCallback, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Box,
  Flex,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  SimpleGrid,
  Text,
  VStack,
  Badge,
  HStack,
  Tag,
  TagLabel,
  TagCloseButton,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { useStarStore } from '@/store/starStore';
import { createStarFuse, searchStars, sortStars, SORT_OPTIONS, type SortBy, filterStarsByMagnitude, MAGNITUDE_FILTER_OPTIONS, type MagnitudeFilter } from '@/utils/starUtils';
import { getSearchParam, setSearchParam, deleteSearchParam } from '@/utils/urlUtils';
import { StarDetailDrawer } from '@/components/StarDetailDrawer';
import { FavoriteButton } from '@/components/FavoriteButton';
import type { Star } from '@/types/star';

/**
 * 星官列表与搜索页
 */
export function StarListPage() {
  const { stars, enclosures, selectedStar, drawerOpen, openDrawer, closeDrawer } = useStarStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const query = getSearchParam(searchParams, 'q');
  const [sortBy, setSortBy] = useState<SortBy>('default');
  const [magnitudeFilter, setMagnitudeFilter] = useState<MagnitudeFilter>('all');

  const filterEnclosureId = getSearchParam(searchParams, 'enclosure', '') || null;

  const setQuery = useCallback(
    (value: string) => {
      const nextParams = setSearchParam(searchParams, 'q', value);
      setSearchParams(nextParams, { replace: true });
    },
    [searchParams, setSearchParams],
  );

  const fuse = useMemo(() => createStarFuse(stars), [stars]);
  const searchedStars = useMemo(() => searchStars(stars, fuse, query), [stars, fuse, query]);
  const magnitudeFilteredStars = useMemo(
    () => filterStarsByMagnitude(searchedStars, magnitudeFilter),
    [searchedStars, magnitudeFilter],
  );
  const sortedStars = useMemo(() => sortStars(magnitudeFilteredStars, sortBy), [magnitudeFilteredStars, sortBy]);

  const filteredStars = useMemo(() => {
    if (!filterEnclosureId) return sortedStars;
    return sortedStars.filter((star) => star.enclosureId === filterEnclosureId);
  }, [sortedStars, filterEnclosureId]);

  const currentEnclosure = useMemo(() => {
    if (!filterEnclosureId) return null;
    return enclosures.find((enc) => enc.id === filterEnclosureId) ?? null;
  }, [enclosures, filterEnclosureId]);

  const clearFilter = () => {
    const nextParams = deleteSearchParam(searchParams, 'enclosure');
    setSearchParams(nextParams, { replace: true });
  };

  const grouped = useMemo(() => {
    const map = new Map<string, Star[]>();
    enclosures.forEach((enc) => map.set(enc.name, []));
    filteredStars.forEach((star) => {
      const list = map.get(star.enclosure);
      if (list) list.push(star);
    });
    return map;
  }, [filteredStars, enclosures]);

  return (
    <VStack align="stretch" spacing={6}>
      <Box>
        <HStack mb={2} spacing={3}>
          <Heading size="lg">星官名录</Heading>
          {currentEnclosure && (
            <Tag colorScheme="purple" size="md">
              <TagLabel>{currentEnclosure.name}</TagLabel>
              <TagCloseButton onClick={clearFilter} />
            </Tag>
          )}
        </HStack>
        <Text color="gray.400" fontSize="sm">
          收录三垣星官，支持名称、垣域与简介模糊搜索。点击条目查看详情。
        </Text>
      </Box>

      <Flex gap={3} wrap="wrap">
        <InputGroup maxW="400px" minW="200px" flex={{ base: '1 1 100%', md: '1 1 auto' }}>
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.500" />
          </InputLeftElement>
          <Input
            placeholder="搜索星官名称、垣域或简介…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            bg="whiteAlpha.100"
            border="none"
            _focus={{ bg: 'whiteAlpha.200', boxShadow: 'none' }}
          />
        </InputGroup>
        <Select
          aria-label="视星等区间"
          value={magnitudeFilter}
          onChange={(e) => setMagnitudeFilter(e.target.value as MagnitudeFilter)}
          maxW="220px"
          flex={{ base: '1 1 100%', md: '0 0 auto' }}
          bg="whiteAlpha.100"
          border="none"
          _focus={{ bg: 'whiteAlpha.200', boxShadow: 'none' }}
        >
          {MAGNITUDE_FILTER_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
        <Select
          aria-label="排序方式"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortBy)}
          maxW="220px"
          flex={{ base: '1 1 100%', md: '0 0 auto' }}
          bg="whiteAlpha.100"
          border="none"
          _focus={{ bg: 'whiteAlpha.200', boxShadow: 'none' }}
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </Flex>

      {filteredStars.length === 0 ? (
        <Text color="gray.500" py={8} textAlign="center">
          未找到匹配的星官
        </Text>
      ) : (
        enclosures.map((enc) => {
          const encStars = grouped.get(enc.name) ?? [];
          if (encStars.length === 0) return null;

          return (
            <Box key={enc.id}>
              <HStack mb={3}>
                <Heading size="md">{enc.name}</Heading>
                <Badge colorScheme="purple">{encStars.length}</Badge>
              </HStack>
              <Text fontSize="sm" color="gray.500" mb={4}>
                {enc.description}
              </Text>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={3}>
                {encStars.map((star) => (
                  <Box
                    key={star.id}
                    p={4}
                    borderRadius="md"
                    bg="whiteAlpha.50"
                    border="1px solid"
                    borderColor="whiteAlpha.100"
                    cursor="pointer"
                    transition="all 0.15s"
                    _hover={{
                      bg: 'whiteAlpha.100',
                      borderColor: 'brand.400',
                      transform: 'translateY(-1px)',
                    }}
                    onClick={() => openDrawer(star)}
                  >
                    <HStack justify="space-between" mb={1}>
                      <Text fontWeight="semibold">{star.name}</Text>
                      <HStack gap={1}>
                        <Badge fontSize="xs" colorScheme="blue">
                          {star.magnitude} 等
                        </Badge>
                        <FavoriteButton starId={star.id} starName={star.name} size="sm" />
                      </HStack>
                    </HStack>
                    <Text fontSize="sm" color="gray.400" noOfLines={2}>
                      {star.summary}
                    </Text>
                  </Box>
                ))}
              </SimpleGrid>
            </Box>
          );
        })
      )}

      <StarDetailDrawer star={selectedStar} isOpen={drawerOpen} onClose={closeDrawer} />
    </VStack>
  );
}
