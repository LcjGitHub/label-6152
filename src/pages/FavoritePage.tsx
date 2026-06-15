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
import { useLunarMansionStore } from '@/store/lunarMansionStore';
import { useFavoriteStore } from '@/store/favoriteStore';
import { StarDetailDrawer } from '@/components/StarDetailDrawer';
import { MansionDetailDrawer } from '@/components/MansionDetailDrawer';
import { FavoriteButton } from '@/components/FavoriteButton';
import type { Star } from '@/types/star';
import type { LunarMansion } from '@/types/lunarMansion';

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

/**
 * 收藏页面
 * 展示用户已收藏的星官和星宿列表，支持取消收藏
 */
export function FavoritePage() {
  const { stars, enclosures, selectedStar, drawerOpen: starDrawerOpen, openDrawer: openStarDrawer, closeDrawer: closeStarDrawer } = useStarStore();
  const { groups, mansions, selectedMansion, drawerOpen: mansionDrawerOpen, openDrawer: openMansionDrawer, closeDrawer: closeMansionDrawer } = useLunarMansionStore();
  const { starOfficerFavorites, lunarMansionFavorites } = useFavoriteStore();

  const favoriteStars = useMemo(() => {
    return stars.filter((star) => starOfficerFavorites.includes(star.id));
  }, [stars, starOfficerFavorites]);

  const favoriteMansions = useMemo(() => {
    return mansions.filter((m) => lunarMansionFavorites.includes(m.id));
  }, [mansions, lunarMansionFavorites]);

  const groupedStars = useMemo(() => {
    const map = new Map<string, Star[]>();
    enclosures.forEach((enc) => map.set(enc.name, []));
    favoriteStars.forEach((star) => {
      const list = map.get(star.enclosure);
      if (list) list.push(star);
    });
    return map;
  }, [favoriteStars, enclosures]);

  const groupedMansions = useMemo(() => {
    const map = new Map<string, LunarMansion[]>();
    groups.forEach((g) => map.set(g.direction, []));
    favoriteMansions.forEach((m) => {
      const list = map.get(m.direction);
      if (list) list.push(m);
    });
    return map;
  }, [favoriteMansions, groups]);

  const handleStarKeyDown = (e: React.KeyboardEvent, star: Star) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openStarDrawer(star);
    }
  };

  const handleMansionKeyDown = (e: React.KeyboardEvent, mansion: LunarMansion) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openMansionDrawer(mansion);
    }
  };

  const hasAnyFavorite = favoriteStars.length > 0 || favoriteMansions.length > 0;

  return (
    <VStack align="stretch" spacing={6}>
      <Box>
        <Heading size="lg">我的收藏</Heading>
        <Text color="gray.400" fontSize="sm" mt={2}>
          收藏的星官与星宿将保存在本地，刷新页面后仍然保留。
        </Text>
      </Box>

      {!hasAnyFavorite ? (
        <Box py={12} textAlign="center">
          <Text color="gray.500" fontSize="lg">
            还没有收藏任何内容
          </Text>
          <Text color="gray.600" fontSize="sm" mt={2}>
            去星官列表或二十八宿列表点击卡片右上角星形按钮收藏喜欢的条目吧
          </Text>
        </Box>
      ) : (
        <VStack align="stretch" spacing={8}>
          {favoriteStars.length > 0 && (
            <Box>
              <HStack mb={4}>
                <Heading size="md" color="gray.200">星官收藏</Heading>
                <Badge colorScheme="yellow">{favoriteStars.length}</Badge>
              </HStack>
              <VStack align="stretch" spacing={5}>
                {enclosures.map((enc) => {
                  const encStars = groupedStars.get(enc.name) ?? [];
                  if (encStars.length === 0) return null;

                  return (
                    <Box key={enc.id}>
                      <HStack mb={3}>
                        <Heading size="sm" color="gray.300">{enc.name}</Heading>
                        <Badge colorScheme="purple" variant="subtle">{encStars.length}</Badge>
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
                              onClick={() => openStarDrawer(star)}
                              onKeyDown={(e: React.KeyboardEvent) => handleStarKeyDown(e, star)}
                            >
                              <HStack justify="space-between" mb={1}>
                                <HStack gap={2}>
                                  <Text fontWeight="semibold">{star.name}</Text>
                                </HStack>
                                <HStack gap={1}>
                                  <Badge fontSize="xs" colorScheme="blue">
                                    {star.magnitude} 等
                                  </Badge>
                                  <FavoriteButton itemId={star.id} itemName={star.name} size="sm" />
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
                })}
              </VStack>
            </Box>
          )}

          {favoriteMansions.length > 0 && (
            <Box>
              <HStack mb={4}>
                <Heading size="md" color="gray.200">星宿收藏</Heading>
                <Badge colorScheme="yellow">{favoriteMansions.length}</Badge>
              </HStack>
              <VStack align="stretch" spacing={5}>
                {groups.map((group) => {
                  const groupMansions = groupedMansions.get(group.direction) ?? [];
                  if (groupMansions.length === 0) return null;

                  return (
                    <Box key={group.direction}>
                      <HStack mb={3}>
                        <Text fontSize="lg" mr={1}>{directionSymbols[group.direction]}</Text>
                        <Heading size="sm" color="gray.300">{group.direction}</Heading>
                        <Badge colorScheme={directionColors[group.direction]} variant="subtle">
                          {groupMansions.length} 宿
                        </Badge>
                      </HStack>
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
                              onClick={() => openMansionDrawer(mansion)}
                              onKeyDown={(e: React.KeyboardEvent) => handleMansionKeyDown(e, mansion)}
                            >
                              <HStack justify="space-between" mb={1}>
                                <HStack>
                                  <Text fontWeight="semibold">{mansion.name}</Text>
                                  <Badge fontSize="xs" colorScheme={directionColors[mansion.direction]}>
                                    第{mansion.order}宿
                                  </Badge>
                                </HStack>
                                <HStack gap={1}>
                                  <Badge fontSize="xs" colorScheme="purple" variant="outline">
                                    {mansion.symbol}
                                  </Badge>
                                  <FavoriteButton
                                    itemId={mansion.id}
                                    itemName={mansion.name}
                                    type="lunarMansion"
                                    size="sm"
                                  />
                                </HStack>
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
                })}
              </VStack>
            </Box>
          )}
        </VStack>
      )}

      <StarDetailDrawer star={selectedStar} isOpen={starDrawerOpen} onClose={closeStarDrawer} />
      <MansionDetailDrawer mansion={selectedMansion} isOpen={mansionDrawerOpen} onClose={closeMansionDrawer} />
    </VStack>
  );
}
