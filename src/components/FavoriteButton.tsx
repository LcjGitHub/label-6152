import { IconButton, Tooltip } from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';
import { useFavoriteStore } from '@/store/favoriteStore';
import type { FavoriteType } from '@/store/favoriteStore';

interface FavoriteButtonProps {
  itemId: string;
  itemName: string;
  type?: FavoriteType;
  size?: string;
  variant?: string;
}

/**
 * 收藏按钮组件
 * 点击可切换收藏状态，支持在列表卡片和详情抽屉中复用
 * 支持星官(starOfficer)与星宿(lunarMansion)两种收藏类型
 */
export function FavoriteButton({
  itemId,
  itemName,
  type = 'starOfficer',
  size = 'md',
  variant = 'ghost',
}: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavoriteStore();
  const favorited = isFavorite(itemId, type);
  const labelPrefix = type === 'starOfficer' ? '星官' : '星宿';
  const label = favorited ? `取消收藏${labelPrefix}${itemName}` : `收藏${labelPrefix}${itemName}`;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(itemId, type);
  };

  return (
    <Tooltip label={label} placement="top">
      <IconButton
        aria-label={label}
        icon={<StarIcon />}
        size={size}
        variant={variant}
        color={favorited ? 'yellow.400' : 'gray.400'}
        onClick={handleClick}
        _hover={{
          color: 'yellow.300',
          bg: 'whiteAlpha.100',
        }}
      />
    </Tooltip>
  );
}
