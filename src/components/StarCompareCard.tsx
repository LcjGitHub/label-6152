import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Badge,
  Divider,
  SimpleGrid,
} from '@chakra-ui/react';
import type { Star } from '@/types/star';

interface StarCompareCardProps {
  star: Star | null;
  label: string;
}

export function StarCompareCard({ star, label }: StarCompareCardProps) {
  if (!star) {
    return (
      <Box
        p={6}
        borderRadius="lg"
        bg="whiteAlpha.50"
        border="1px dashed"
        borderColor="whiteAlpha.200"
        minH="400px"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <VStack spacing={2}>
          <Text fontSize="lg" color="gray.400" fontWeight="medium">
            {label}
          </Text>
          <Text fontSize="sm" color="gray.500">
            请从上方选择一个星官
          </Text>
        </VStack>
      </Box>
    );
  }

  return (
    <Box
      p={6}
      borderRadius="lg"
      bg="whiteAlpha.50"
      border="1px solid"
      borderColor="whiteAlpha.100"
      transition="all 0.15s"
      _hover={{
        bg: 'whiteAlpha.100',
        borderColor: 'brand.400',
      }}
    >
      <VStack align="stretch" spacing={4}>
        <Box>
          <Badge colorScheme="purple" mb={2}>
            {label}
          </Badge>
          <Heading size="lg" mb={1}>
            {star.name}
          </Heading>
          <Text fontSize="sm" color="gray.400">
            {star.enclosure}
          </Text>
        </Box>

        <Divider borderColor="whiteAlpha.100" />

        <SimpleGrid columns={2} spacing={4}>
          <Box>
            <Text fontSize="xs" color="gray.500" mb={1}>
              视星等
            </Text>
            <Text fontSize="lg" fontWeight="semibold" color="brand.200">
              {star.magnitude} 等
            </Text>
          </Box>
          <Box>
            <Text fontSize="xs" color="gray.500" mb={1}>
              所属垣
            </Text>
            <Text fontSize="lg" fontWeight="semibold">
              {star.enclosure}
            </Text>
          </Box>
        </SimpleGrid>

        <Divider borderColor="whiteAlpha.100" />

        <Box>
          <Text fontSize="xs" color="gray.500" mb={2}>
            简介
          </Text>
          <Text fontSize="sm" color="gray.300" lineHeight="tall">
            {star.summary}
          </Text>
        </Box>

        <Divider borderColor="whiteAlpha.100" />

        <Box>
          <Text fontSize="xs" color="gray.500" mb={2}>
            示意坐标
          </Text>
          <HStack spacing={6}>
            <Box>
              <Text fontSize="xs" color="gray.500">
                X
              </Text>
              <Text fontSize="md" fontFamily="mono">
                {star.x.toFixed(1)}%
              </Text>
            </Box>
            <Box>
              <Text fontSize="xs" color="gray.500">
                Y
              </Text>
              <Text fontSize="md" fontFamily="mono">
                {star.y.toFixed(1)}%
              </Text>
            </Box>
            <Box
              w="60px"
              h="60px"
              borderRadius="md"
              bg="blackAlpha.400"
              border="1px solid"
              borderColor="whiteAlpha.100"
              position="relative"
              overflow="hidden"
            >
              <Box
                position="absolute"
                w="8px"
                h="8px"
                borderRadius="full"
                bg="brand.300"
                boxShadow="0 0 8px 2px brand.400"
                left={`${star.x}%`}
                top={`${star.y}%`}
                transform="translate(-50%, -50%)"
              />
            </Box>
          </HStack>
        </Box>
      </VStack>
    </Box>
  );
}
