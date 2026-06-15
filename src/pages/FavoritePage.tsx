import { useMemo } from 'react';
import {
  Box,
  Heading,
  SimpleGrid,
  Text,
  VStack,
  Badge,
  HStack,
} from '@chakra-ui/react';
import { useStarStore } from '@/store/starStore';
import { useFavoriteStore } from '@/store/favoriteStore';
import { StarDetailDrawer } from '@/components/StarDetailDrawer';
import { FavoriteButton } from '@/components/FavoriteButton';
import type { Star } from '@/types/star';

/**
 * 收藏页面
 * 展示用户已收藏的星官列表，支持取消收藏
 */
export function FavoritePage() {
  const { stars, enclosures, selectedStar, drawerOpen, openDrawer, closeDrawer } = useStarStore();
  const { favoriteIds } = useFavoriteStore();

  const favoriteStars = useMemo(() => {
    return stars.filter((star) => favoriteIds.includes(star.id));
  }, [stars, favoriteIds]);

  const grouped = useMemo(() => {
    const map = new Map<string, Star[]>();
    enclosures.forEach((enc) => map.set(enc.name, []));
    favoriteStars.forEach((star) => {
      const list = map.get(star.enclosure);
      if (list) list.push(star);
    });
    return map;
  }, [favoriteStars, enclosures]);

  const handleKeyDown = (e: React.KeyboardEvent, star: Star) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openDrawer(star);
    }
  };

  return (
    <VStack align="stretch" spacing={6}>
      <Box>
        <Heading size="lg">我的收藏</Heading>
        <Text color="gray.400" fontSize="sm" mt={2}>
          收藏的星官将保存在本地，刷新页面后仍然保留。
        </Text>
      </Box>

      {favoriteStars.length === 0 ? (
        <Box py={12} textAlign="center">
          <Text color="gray.500" fontSize="lg">
            还没有收藏任何星官
          </Text>
          <Text color="gray.600" fontSize="sm" mt={2}>
            去星官列表点击卡片右上角星形按钮收藏喜欢的星官吧
          </Text>
        </Box>
      ) : (
        enclosures.map((enc) => {
          const encStars = grouped.get(enc.name) ?? [];
          if (encStars.length === 0) return null;

          return (
            <Box key={enc.id}>
              <HStack mb={3}>
                <Heading size="md">{enc.name}</Heading>
                <Badge colorScheme="yellow">{encStars.length}</Badge>
              </HStack>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={3}>
                {encStars.map((star) => {
                  const ariaLabel = `${star.name}，${star.summary}，${star.enclosure}，视星等${star.magnitude}，按回车键查看详情`;
                  return (
                    <Box
                      key={star.id}
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
                        borderColor: 'brand.400',
                        transform: 'translateY(-1px)',
                      }}
                      _focusVisible={{
                        outline: '2px solid',
                        outlineColor: 'brand.400',
                        outlineOffset: '2px',
                        bg: 'whiteAlpha.100',
                      }}
                      onClick={() => openDrawer(star)}
                      onKeyDown={(e: React.KeyboardEvent) => handleKeyDown(e, star)}
                    >
                      <HStack justify="space-between" mb={1}>
                        <HStack gap={2}>
                          <Text fontWeight="semibold">{star.name}</Text>
                        </HStack>
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
                  );
                })}
              </SimpleGrid>
            </Box>
          );
        })
      )}

      <StarDetailDrawer star={selectedStar} isOpen={drawerOpen} onClose={closeDrawer} />
    </VStack>
  );
}
