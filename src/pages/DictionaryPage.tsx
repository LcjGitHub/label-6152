import { useCallback, useMemo, useState } from 'react';
import {
  Badge,
  Box,
  Flex,
  Heading,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  SimpleGrid,
  Tag,
  TagCloseButton,
  TagLabel,
  Text,
  VStack,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import termsData from '@/mock/astronomyTerms.json';
import { AstronomyTermDrawer } from '@/components/AstronomyTermDrawer';
import type { AstronomyTerm, TermCategory } from '@/types/astronomyTerm';
import { CATEGORIES } from '@/types/astronomyTerm';

export function DictionaryPage() {
  const terms: AstronomyTerm[] = useMemo(() => termsData as AstronomyTerm[], []);
  const [query, setQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<TermCategory | null>(null);
  const [selectedTerm, setSelectedTerm] = useState<AstronomyTerm | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const filteredTerms = useMemo(() => {
    let result = terms;
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      result = result.filter(
        (term) =>
          term.name.toLowerCase().includes(q) ||
          term.summary.toLowerCase().includes(q) ||
          term.detail.toLowerCase().includes(q),
      );
    }
    if (filterCategory) {
      result = result.filter((term) => term.category === filterCategory);
    }
    return result;
  }, [terms, query, filterCategory]);

  const grouped = useMemo(() => {
    const map = new Map<TermCategory, AstronomyTerm[]>();
    CATEGORIES.forEach((cat) => map.set(cat.name, []));
    filteredTerms.forEach((term) => {
      const list = map.get(term.category);
      if (list) list.push(term);
    });
    return map;
  }, [filteredTerms]);

  const handleQueryChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  }, []);

  const clearCategoryFilter = useCallback(() => {
    setFilterCategory(null);
  }, []);

  const handleCategoryTagClick = useCallback(
    (catName: TermCategory) => {
      setFilterCategory((prev) => (prev === catName ? null : catName));
    },
    [],
  );

  const openDrawer = useCallback((term: AstronomyTerm) => {
    setSelectedTerm(term);
    setDrawerOpen(true);
  }, []);

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false);
  }, []);

  const totalCount = terms.length;

  return (
    <VStack align="stretch" spacing={6}>
      <Box>
        <Heading size="lg" mb={2}>
          天文术语词典
        </Heading>
        <Text color="gray.400" fontSize="sm">
          收录天文专业术语共 {totalCount} 条，涵盖三垣、二十八宿、星官体系、天文坐标、古代历法、星占术语六大类。点击条目查看详情。
        </Text>
      </Box>

      <Flex gap={3} wrap="wrap">
        <InputGroup maxW="400px" minW="200px" flex={{ base: '1 1 100%', md: '1 1 auto' }}>
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.500" />
          </InputLeftElement>
          <Input
            placeholder="搜索术语名称、释义或说明…"
            value={query}
            onChange={handleQueryChange}
            bg="whiteAlpha.100"
            border="none"
            _focus={{ bg: 'whiteAlpha.200', boxShadow: 'none' }}
          />
        </InputGroup>
        <HStack flex="1" flexWrap="wrap" spacing={2}>
          {filterCategory && (
            <Tag colorScheme="purple" size="md">
              <TagLabel>{filterCategory}</TagLabel>
              <TagCloseButton onClick={clearCategoryFilter} />
            </Tag>
          )}
          {CATEGORIES.map((cat) => {
            const count = grouped.get(cat.name)?.length ?? 0;
            if (count === 0 && !filterCategory) return null;
            const isActive = filterCategory === cat.name;
            return (
              <Tag
                key={cat.name}
                colorScheme={isActive ? cat.colorScheme : 'gray'}
                size="md"
                cursor="pointer"
                variant={isActive ? 'solid' : 'subtle'}
                onClick={() => handleCategoryTagClick(cat.name)}
              >
                {cat.name}
                <TagLabel ml={1} opacity={0.7}>
                  {count}
                </TagLabel>
              </Tag>
            );
          })}
        </HStack>
      </Flex>

      {filteredTerms.length === 0 ? (
        <Text color="gray.500" py={8} textAlign="center">
          未找到匹配的术语
        </Text>
      ) : (
        CATEGORIES.map((cat) => {
          const catTerms = grouped.get(cat.name) ?? [];
          if (catTerms.length === 0) return null;

          return (
            <Box key={cat.name}>
              <HStack mb={3}>
                <Heading size="md">{cat.name}</Heading>
                <Badge colorScheme={cat.colorScheme}>{catTerms.length}</Badge>
              </HStack>
              <Text fontSize="sm" color="gray.500" mb={4}>
                {cat.description}
              </Text>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={3}>
                {catTerms.map((term) => (
                  <Box
                    key={term.id}
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
                    onClick={() => openDrawer(term)}
                  >
                    <HStack justify="space-between" mb={2}>
                      <Text fontWeight="semibold">{term.name}</Text>
                      <Badge fontSize="xs" colorScheme={cat.colorScheme}>
                        {term.category}
                      </Badge>
                    </HStack>
                    <Text fontSize="sm" color="gray.400" noOfLines={3}>
                      {term.summary}
                    </Text>
                  </Box>
                ))}
              </SimpleGrid>
            </Box>
          );
        })
      )}

      <AstronomyTermDrawer term={selectedTerm} isOpen={drawerOpen} onClose={closeDrawer} />
    </VStack>
  );
}
