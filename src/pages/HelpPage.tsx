import { useState } from 'react';
import {
  Box,
  Flex,
  Heading,
  Text,
  VStack,
  Collapse,
  IconButton,
  HStack,
  UnorderedList,
  ListItem,
} from '@chakra-ui/react';
import { ChevronDownIcon, ChevronRightIcon, InfoIcon } from '@chakra-ui/icons';
import { HELP_SECTIONS, type HelpSection, type HelpItem } from '@/constants/helpContent';

function HelpItemBlock({ item }: { item: HelpItem }) {
  return (
    <Box
      p={4}
      borderRadius="md"
      bg="whiteAlpha.50"
      border="1px solid"
      borderColor="whiteAlpha.100"
    >
      <HStack align="flex-start" spacing={3}>
        <InfoIcon color="brand.300" mt={1} flexShrink={0} />
        <VStack align="stretch" spacing={2}>
          <Text fontWeight="semibold" color="gray.100">
            {item.title}
          </Text>
          <Text fontSize="sm" color="gray.400" lineHeight="tall">
            {item.content}
          </Text>
          {item.tips && item.tips.length > 0 && (
            <Box
              mt={2}
              p={3}
              borderRadius="md"
              bg="brand.900"
              borderLeft="3px solid"
              borderColor="brand.400"
            >
              <Text fontSize="xs" fontWeight="medium" color="brand.200" mb={2}>
                💡 小贴士
              </Text>
              <UnorderedList spacing={1} pl={4}>
                {item.tips.map((tip, index) => (
                  <ListItem key={index} fontSize="xs" color="gray.300" lineHeight="tall">
                    {tip}
                  </ListItem>
                ))}
              </UnorderedList>
            </Box>
          )}
        </VStack>
      </HStack>
    </Box>
  );
}

function HelpSectionCard({ section }: { section: HelpSection }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Box
      borderRadius="lg"
      bg="whiteAlpha.50"
      border="1px solid"
      borderColor="whiteAlpha.100"
      overflow="hidden"
      transition="all 0.2s"
      _hover={{
        borderColor: 'whiteAlpha.200',
      }}
    >
      <Flex
        align="center"
        px={5}
        py={4}
        cursor="pointer"
        onClick={() => setIsOpen(!isOpen)}
        _hover={{ bg: 'whiteAlpha.50' }}
        transition="background 0.2s"
      >
        <IconButton
          aria-label={isOpen ? `折叠${section.title}` : `展开${section.title}`}
          icon={isOpen ? <ChevronDownIcon /> : <ChevronRightIcon />}
          size="sm"
          variant="ghost"
          colorScheme="whiteAlpha"
          mr={3}
          _hover={{ color: 'brand.200' }}
        />
        <VStack align="stretch" spacing={1} flex="1">
          <Heading
            size="md"
            fontFamily="heading"
            letterSpacing="wide"
            color={isOpen ? 'brand.200' : 'gray.200'}
          >
            {section.title}
          </Heading>
          <Text fontSize="sm" color="gray.500">
            {section.description}
          </Text>
        </VStack>
      </Flex>
      <Collapse in={isOpen}>
        <VStack align="stretch" spacing={3} px={5} pb={5} pt={1}>
          {section.items.map((item) => (
            <HelpItemBlock key={item.id} item={item} />
          ))}
        </VStack>
      </Collapse>
    </Box>
  );
}

export function HelpPage() {
  return (
    <VStack align="stretch" spacing={6}>
      <Box>
        <Heading size="lg" fontFamily="heading" letterSpacing="wider">
          使用帮助
        </Heading>
        <Text color="gray.400" fontSize="sm" mt={2}>
          了解各页面功能与基本操作，快速上手探索中国传统星官
        </Text>
      </Box>

      <VStack align="stretch" spacing={4}>
        {HELP_SECTIONS.map((section) => (
          <HelpSectionCard key={section.id} section={section} />
        ))}
      </VStack>
    </VStack>
  );
}
