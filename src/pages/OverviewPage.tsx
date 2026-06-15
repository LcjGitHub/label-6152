import { createSearchParams, useNavigate } from 'react-router-dom';
import { Box, Heading, Text, VStack, SimpleGrid, Badge, HStack, Tag, TagLabel } from '@chakra-ui/react';
import { useStarStore } from '@/store/starStore';
import { useHistoryStore } from '@/store/historyStore';
import type { Enclosure } from '@/types/star';

/**
 * 三垣概览页面
 */
export function OverviewPage() {
  const navigate = useNavigate();
  const { enclosures, getStarCountByEnclosure } = useStarStore();
  const { getRecentHistory } = useHistoryStore();
  const recentItems = getRecentHistory(5);

  const handleCardClick = (enclosure: Enclosure) => {
    navigate({
      pathname: '/',
      search: createSearchParams({ enclosure: enclosure.id }).toString(),
    });
  };

  const handleRecentClick = (starId: string) => {
    navigate({
      pathname: '/',
      search: createSearchParams({ star: starId }).toString(),
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent, enclosure: Enclosure) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCardClick(enclosure);
    }
  };

  return (
    <VStack align="stretch" spacing={8}>
      <Box>
        <Heading size="lg" mb={2}>
          三垣概览
        </Heading>
        <Text color="gray.400" fontSize="sm">
          三垣是中国古代星空划分的三个重要天区，点击卡片查看对应星官列表。
        </Text>
      </Box>

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
        {enclosures.map((enc) => {
          const count = getStarCountByEnclosure(enc.id);
          const ariaLabel = `${enc.name}，${enc.description}，共${count}个星官，点击查看详情`;
          return (
            <Box
              key={enc.id}
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
                borderColor: 'brand.400',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 20px rgba(63, 81, 181, 0.2)',
              }}
              _focusVisible={{
                outline: '2px solid',
                outlineColor: 'brand.400',
                outlineOffset: '2px',
                bg: 'whiteAlpha.100',
              }}
              onClick={() => handleCardClick(enc)}
              onKeyDown={(e: React.KeyboardEvent) => handleKeyDown(e, enc)}
            >
              <VStack align="stretch" spacing={4}>
                <HStack justify="space-between">
                  <Heading size="md" fontFamily="heading" letterSpacing="wide">
                    {enc.name}
                  </Heading>
                  <Badge colorScheme="purple" fontSize="sm" px={2} py={1}>
                    {count} 星官
                  </Badge>
                </HStack>
                <Text color="gray.400" lineHeight="tall">
                  {enc.description}
                </Text>
                <Text fontSize="sm" color="brand.300" fontWeight="medium">
                  查看详情 →
                </Text>
              </VStack>
            </Box>
          );
        })}
      </SimpleGrid>

      <Box
        p={6}
        borderRadius="lg"
        bg="whiteAlpha.50"
        border="1px solid"
        borderColor="whiteAlpha.100"
      >
        <HStack mb={4} justify="space-between">
          <VStack align="stretch" spacing={1}>
            <Heading size="md" fontFamily="heading" letterSpacing="wide">
              最近浏览
            </Heading>
            <Text color="gray.400" fontSize="sm">
              点击星官名称快速跳转并查看详情
            </Text>
          </VStack>
          {recentItems.length > 0 && (
            <Badge colorScheme="blue" fontSize="xs" px={2} py={1}>
              {recentItems.length} / 5
            </Badge>
          )}
        </HStack>

        {recentItems.length === 0 ? (
          <Text color="gray.500" fontSize="sm" py={4} textAlign="center">
            暂无浏览记录，去星官列表页查看详情吧
          </Text>
        ) : (
          <HStack wrap="wrap" spacing={3}>
            {recentItems.map((item) => {
              const clickLabel = `点击查看${item.star.name}详情`;
              return (
                <Tag
                  key={item.star.id}
                  size="lg"
                  borderRadius="full"
                  variant="solid"
                  colorScheme="purple"
                  cursor="pointer"
                  transition="all 0.15s"
                  _hover={{
                    bg: 'purple.500',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 2px 8px rgba(63, 81, 181, 0.3)',
                  }}
                  onClick={() => handleRecentClick(item.star.id)}
                  tabIndex={0}
                  role="button"
                  aria-label={clickLabel}
                  onKeyDown={(e: React.KeyboardEvent) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleRecentClick(item.star.id);
                    }
                  }}
                >
                  <TagLabel px={1}>{item.star.name}</TagLabel>
                </Tag>
              );
            })}
          </HStack>
        )}
      </Box>
    </VStack>
  );
}
