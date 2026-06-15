import { useNavigate } from 'react-router-dom';
import { Box, Heading, Text, VStack, SimpleGrid, Badge, HStack } from '@chakra-ui/react';
import { useStarStore } from '@/store/starStore';
import type { Enclosure } from '@/types/star';

/**
 * 三垣概览页面
 */
export function OverviewPage() {
  const navigate = useNavigate();
  const { enclosures, getStarCountByEnclosure, setFilterEnclosureId } = useStarStore();

  const handleCardClick = (enclosure: Enclosure) => {
    setFilterEnclosureId(enclosure.id);
    navigate('/');
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
          return (
            <Box
              key={enc.id}
              p={6}
              borderRadius="lg"
              bg="whiteAlpha.50"
              border="1px solid"
              borderColor="whiteAlpha.100"
              cursor="pointer"
              transition="all 0.2s"
              _hover={{
                bg: 'whiteAlpha.100',
                borderColor: 'brand.400',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 20px rgba(63, 81, 181, 0.2)',
              }}
              onClick={() => handleCardClick(enc)}
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
    </VStack>
  );
}
