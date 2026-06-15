import { useMemo, useState } from 'react';
import {
  Box,
  Flex,
  Heading,
  Text,
  VStack,
  Select,
  SimpleGrid,
  IconButton,
  Tooltip,
} from '@chakra-ui/react';
import { RepeatIcon } from '@chakra-ui/icons';
import { useStarStore } from '@/store/starStore';
import { StarCompareCard } from '@/components/StarCompareCard';
import type { Star } from '@/types/star';

export function ComparePage() {
  const { stars, enclosures } = useStarStore();
  const [leftStarId, setLeftStarId] = useState<string>('');
  const [rightStarId, setRightStarId] = useState<string>('');

  const groupedStars = useMemo(() => {
    const map = new Map<string, Star[]>();
    enclosures.forEach((enc) => map.set(enc.id, []));
    stars.forEach((star) => {
      const list = map.get(star.enclosureId);
      if (list) list.push(star);
    });
    return map;
  }, [stars, enclosures]);

  const leftStar = useMemo(
    () => stars.find((s) => s.id === leftStarId) || null,
    [stars, leftStarId],
  );
  const rightStar = useMemo(
    () => stars.find((s) => s.id === rightStarId) || null,
    [stars, rightStarId],
  );

  const handleSwap = () => {
    const temp = leftStarId;
    setLeftStarId(rightStarId);
    setRightStarId(temp);
  };

  return (
    <VStack align="stretch" spacing={6}>
      <Box>
        <Heading size="lg" mb={2}>
          星官对照
        </Heading>
        <Text color="gray.400" fontSize="sm">
          选择两个星官进行横向比较，查看名称、所属垣、视星等、简介与示意坐标等信息。
        </Text>
      </Box>

      <Flex gap={4} align="center" wrap="wrap">
        <Box flex="1" minW="200px">
          <Text fontSize="sm" color="gray.400" mb={2}>
            左侧星官
          </Text>
          <Select
            value={leftStarId}
            onChange={(e) => setLeftStarId(e.target.value)}
            placeholder="选择一个星官…"
            bg="whiteAlpha.100"
            border="none"
            _focus={{ bg: 'whiteAlpha.200', boxShadow: 'none' }}
          >
            {enclosures.map((enc) => {
              const encStars = groupedStars.get(enc.id) ?? [];
              return (
                <optgroup key={enc.id} label={enc.name}>
                  {encStars.map((star) => (
                    <option key={star.id} value={star.id}>
                      {star.name}
                    </option>
                  ))}
                </optgroup>
              );
            })}
          </Select>
        </Box>

        <Tooltip label="交换左右" placement="top">
          <IconButton
            aria-label="交换左右"
            icon={<RepeatIcon />}
            variant="outline"
            borderColor="whiteAlpha.200"
            color="gray.400"
            _hover={{ bg: 'whiteAlpha.100', color: 'brand.200' }}
            onClick={handleSwap}
            mt={6}
          />
        </Tooltip>

        <Box flex="1" minW="200px">
          <Text fontSize="sm" color="gray.400" mb={2}>
            右侧星官
          </Text>
          <Select
            value={rightStarId}
            onChange={(e) => setRightStarId(e.target.value)}
            placeholder="选择一个星官…"
            bg="whiteAlpha.100"
            border="none"
            _focus={{ bg: 'whiteAlpha.200', boxShadow: 'none' }}
          >
            {enclosures.map((enc) => {
              const encStars = groupedStars.get(enc.id) ?? [];
              return (
                <optgroup key={enc.id} label={enc.name}>
                  {encStars.map((star) => (
                    <option key={star.id} value={star.id}>
                      {star.name}
                    </option>
                  ))}
                </optgroup>
              );
            })}
          </Select>
        </Box>
      </Flex>

      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
        <StarCompareCard star={leftStar} label="左侧" />
        <StarCompareCard star={rightStar} label="右侧" />
      </SimpleGrid>
    </VStack>
  );
}
