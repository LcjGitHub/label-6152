import { Box, Heading, Text, VStack, SimpleGrid, HStack, Stat, StatLabel, StatNumber, StatHelpText } from '@chakra-ui/react';
import { useStarStore } from '@/store/starStore';
import { calculateStatistics } from '@/utils/statistics';
import { useMemo } from 'react';

export function StatisticsPage() {
  const { stars, enclosures } = useStarStore();

  const stats = useMemo(() => {
    return calculateStatistics(stars, enclosures);
  }, [stars, enclosures]);

  const maxEnclosureCount = Math.max(...stats.enclosureStats.map((e) => e.count));
  const maxMagnitudeCount = Math.max(...stats.magnitudeStats.map((m) => m.count));

  return (
    <VStack align="stretch" spacing={8}>
      <Box>
        <Heading size="lg" mb={2}>
          星官统计
        </Heading>
        <Text color="gray.400" fontSize="sm">
          基于现有模拟数据的星官统计信息
        </Text>
      </Box>

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
        <Stat
          p={6}
          borderRadius="lg"
          bg="whiteAlpha.50"
          border="1px solid"
          borderColor="whiteAlpha.100"
        >
          <StatLabel color="gray.400">星官总数</StatLabel>
          <StatNumber color="brand.200" fontSize="3xl" fontFamily="heading">
            {stats.totalStars}
          </StatNumber>
          <StatHelpText color="gray.500">三垣总计</StatHelpText>
        </Stat>

        <Stat
          p={6}
          borderRadius="lg"
          bg="whiteAlpha.50"
          border="1px solid"
          borderColor="whiteAlpha.100"
        >
          <StatLabel color="gray.400">最亮星等</StatLabel>
          <StatNumber color="brand.200" fontSize="3xl" fontFamily="heading">
            {stats.minMagnitude.toFixed(1)}
          </StatNumber>
          <StatHelpText color="gray.500">视星等</StatHelpText>
        </Stat>

        <Stat
          p={6}
          borderRadius="lg"
          bg="whiteAlpha.50"
          border="1px solid"
          borderColor="whiteAlpha.100"
        >
          <StatLabel color="gray.400">平均星等</StatLabel>
          <StatNumber color="brand.200" fontSize="3xl" fontFamily="heading">
            {stats.avgMagnitude.toFixed(1)}
          </StatNumber>
          <StatHelpText color="gray.500">视星等</StatHelpText>
        </Stat>
      </SimpleGrid>

      <Box
        p={6}
        borderRadius="lg"
        bg="whiteAlpha.50"
        border="1px solid"
        borderColor="whiteAlpha.100"
      >
        <Heading size="md" mb={6} fontFamily="heading">
          三垣星官数量
        </Heading>
        <VStack align="stretch" spacing={4}>
          {stats.enclosureStats.map((enc) => {
            const heightPercent = maxEnclosureCount > 0 ? (enc.count / maxEnclosureCount) * 100 : 0;
            return (
              <Box key={enc.id}>
                <HStack justify="space-between" mb={2}>
                  <Text fontWeight="medium" color="gray.200">
                    {enc.name}
                  </Text>
                  <Text color="brand.300" fontWeight="bold">
                    {enc.count} 星官
                  </Text>
                </HStack>
                <Box
                  w="full"
                  h="32px"
                  borderRadius="md"
                  bg="whiteAlpha.100"
                  overflow="hidden"
                >
                  <Box
                    h="full"
                    borderRadius="md"
                    bgGradient="linear(to-r, brand.500, brand.300)"
                    transition="width 0.5s ease-out"
                    style={{ width: `${heightPercent}%` }}
                  />
                </Box>
              </Box>
            );
          })}
        </VStack>
      </Box>

      <Box
        p={6}
        borderRadius="lg"
        bg="whiteAlpha.50"
        border="1px solid"
        borderColor="whiteAlpha.100"
      >
        <Heading size="md" mb={6} fontFamily="heading">
          视星等分布
        </Heading>
        <SimpleGrid columns={{ base: 1, sm: 2, md: 5 }} spacing={4}>
          {stats.magnitudeStats.map((mag) => {
            const heightPercent = maxMagnitudeCount > 0 ? (mag.count / maxMagnitudeCount) * 100 : 0;
            return (
              <VStack key={mag.range} spacing={3} align="stretch">
                <Box
                  w="full"
                  h="120px"
                  borderRadius="md"
                  bg="whiteAlpha.100"
                  position="relative"
                  display="flex"
                  alignItems="flex-end"
                  overflow="hidden"
                >
                  <Box
                    w="full"
                    borderRadius="md"
                    bgGradient="linear(to-t, purple.500, purple.300)"
                    transition="height 0.5s ease-out"
                    style={{ height: `${heightPercent}%` }}
                  />
                  {mag.count > 0 && (
                    <Text
                      position="absolute"
                      top="8px"
                      left="50%"
                      transform="translateX(-50%)"
                      fontSize="sm"
                      fontWeight="bold"
                      color="white"
                    >
                      {mag.count}
                    </Text>
                  )}
                </Box>
                <Text textAlign="center" fontSize="sm" color="gray.400">
                  {mag.range}
                </Text>
              </VStack>
            );
          })}
        </SimpleGrid>
      </Box>
    </VStack>
  );
}
