import { useMemo } from 'react';
import {
  Box,
  Button,
  Heading,
  Text,
  VStack,
  Badge,
  HStack,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from '@chakra-ui/react';
import { useRef, useState } from 'react';
import { useHistoryStore } from '@/store/historyStore';
import { useStarStore } from '@/store/starStore';
import { StarDetailDrawer } from '@/components/StarDetailDrawer';
import { FavoriteButton } from '@/components/FavoriteButton';
import type { HistoryItem } from '@/store/historyStore';

function formatTime(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return '刚刚';
  if (diffMins < 60) return `${diffMins} 分钟前`;
  if (diffHours < 24) return `${diffHours} 小时前`;
  if (diffDays < 7) return `${diffDays} 天前`;

  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${month}-${day} ${hours}:${minutes}`;
}

export function HistoryPage() {
  const { historyItems, clearHistory } = useHistoryStore();
  const { selectedStar, drawerOpen, openDrawer, closeDrawer } = useStarStore();
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const cancelRef = useRef<HTMLButtonElement>(null);

  const sortedItems = useMemo(() => {
    return [...historyItems].sort((a, b) => b.visitedAt - a.visitedAt);
  }, [historyItems]);

  const handleKeyDown = (e: React.KeyboardEvent, item: HistoryItem) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openDrawer(item.star);
    }
  };

  const handleClearAll = () => {
    setIsAlertOpen(true);
  };

  const confirmClear = () => {
    clearHistory();
    setIsAlertOpen(false);
  };

  return (
    <VStack align="stretch" spacing={6}>
      <Box>
        <HStack justify="space-between" align="flex-start">
          <Box>
            <Heading size="lg">浏览历史</Heading>
            <Text color="gray.400" fontSize="sm" mt={2}>
              最近浏览过的星官，按时间倒序排列。记录保存在本地。
            </Text>
          </Box>
          {historyItems.length > 0 && (
            <Button
              size="sm"
              variant="outline"
              colorScheme="red"
              onClick={handleClearAll}
              aria-label="清空浏览历史"
            >
              清空记录
            </Button>
          )}
        </HStack>
      </Box>

      {sortedItems.length === 0 ? (
        <Box py={12} textAlign="center">
          <Text color="gray.500" fontSize="lg">
            暂无浏览记录
          </Text>
          <Text color="gray.600" fontSize="sm" mt={2}>
            去星官列表或收藏页点击星官卡片查看详情吧
          </Text>
        </Box>
      ) : (
        <VStack align="stretch" spacing={3}>
          {sortedItems.map((item) => {
            const ariaLabel = `${item.star.name}，${item.star.summary}，${item.star.enclosure}，视星等${item.star.magnitude}，${formatTime(item.visitedAt)}浏览，按回车键查看详情`;
            return (
              <Box
                key={item.star.id}
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
                onClick={() => openDrawer(item.star)}
                onKeyDown={(e: React.KeyboardEvent) => handleKeyDown(e, item)}
              >
                <HStack justify="space-between" mb={1}>
                  <HStack gap={2}>
                    <Text fontWeight="semibold">{item.star.name}</Text>
                    <Badge fontSize="xs" colorScheme="purple">
                      {item.star.enclosure}
                    </Badge>
                  </HStack>
                  <HStack gap={1}>
                    <Badge fontSize="xs" colorScheme="blue">
                      {item.star.magnitude} 等
                    </Badge>
                    <FavoriteButton itemId={item.star.id} itemName={item.star.name} size="sm" />
                  </HStack>
                </HStack>
                <Text fontSize="sm" color="gray.400" noOfLines={2} mb={2}>
                  {item.star.summary}
                </Text>
                <Text fontSize="xs" color="gray.600">
                  {formatTime(item.visitedAt)}
                </Text>
              </Box>
            );
          })}
        </VStack>
      )}

      <StarDetailDrawer star={selectedStar} isOpen={drawerOpen} onClose={closeDrawer} />

      <AlertDialog isOpen={isAlertOpen} leastDestructiveRef={cancelRef} onClose={() => setIsAlertOpen(false)}>
        <AlertDialogOverlay>
          <AlertDialogContent bg="gray.900">
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              清空浏览历史
            </AlertDialogHeader>
            <AlertDialogBody>
              确定要清空所有浏览记录吗？此操作无法撤销。
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsAlertOpen(false)}>
                取消
              </Button>
              <Button colorScheme="red" onClick={confirmClear} ml={3}>
                清空
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </VStack>
  );
}
