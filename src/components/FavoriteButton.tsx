import { IconButton, Tooltip } from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';
import { useFavoriteStore } from '@/store/favoriteStore';

interface FavoriteButtonProps {
  starId: string;
  starName: string;
  size?: string;
  variant?: string;
}

/**
 * 收藏按钮组件
 * 点击可切换收藏状态，支持在列表卡片和详情抽屉中复用
 */
export function FavoriteButton({ starId, starName, size = 'md', variant = 'ghost' }: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavoriteStore();
  const favorited = isFavorite(starId);
  const label = favorited ? `取消收藏${starName}` : `收藏${starName}`;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(starId);
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
