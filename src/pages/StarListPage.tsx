import { useMemo, useState } from 'react';
import {
  Box,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  SimpleGrid,
  Text,
  VStack,
  Badge,
  HStack,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { useStarStore } from '@/store/starStore';
import { createStarFuse, searchStars } from '@/utils/starUtils';
import { StarDetailDrawer } from '@/components/StarDetailDrawer';
import type { Star } from '@/types/star';

/**
 * 星官列表与搜索页
 */
export function StarListPage() {
  const { stars, enclosures, selectedStar, drawerOpen, openDrawer, closeDrawer } = useStarStore();
  const [query, setQuery] = useState('');

  const fuse = useMemo(() => createStarFuse(stars), [stars]);
  const filteredStars = useMemo(() => searchStars(stars, fuse, query), [stars, fuse, query]);

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
        <Heading size="lg" mb={2}>
          星官名录
        </Heading>
        <Text color="gray.400" fontSize="sm">
          收录三垣星官，支持名称、垣域与简介模糊搜索。点击条目查看详情。
        </Text>
      </Box>

      <InputGroup maxW="400px">
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
                      <Badge fontSize="xs" colorScheme="blue">
                        {star.magnitude} 等
                      </Badge>
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
