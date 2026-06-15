import { Box, Flex, Heading, Link as ChakraLink, Spacer, Text } from '@chakra-ui/react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';

interface NavItem {
  path: string;
  label: string;
  clearSearch?: boolean;
}

interface AppLayoutProps {
  children: React.ReactNode;
}

/**
 * 应用全局布局，含顶部导航
 */
export function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems: NavItem[] = [
    { path: '/概览', label: '概览' },
    { path: '/', label: '星官列表', clearSearch: true },
    { path: '/map', label: '简化星图' },
  ];

  const handleNavClick = (item: NavItem, e: React.MouseEvent) => {
    if (item.clearSearch) {
      e.preventDefault();
      navigate({ pathname: item.path, search: '' });
    }
  };

  return (
    <Flex direction="column" minH="100vh">
      <Box
        as="header"
        px={6}
        py={4}
        borderBottom="1px solid"
        borderColor="whiteAlpha.200"
        bg="blackAlpha.400"
      >
        <Flex align="center" maxW="1200px" mx="auto">
          <Heading size="md" fontFamily="heading" letterSpacing="wider">
            中国传统星官
          </Heading>
          <Spacer />
          <Flex gap={6}>
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <ChakraLink
                  key={item.path}
                  as={RouterLink}
                  to={item.path}
                  fontWeight={isActive ? 'bold' : 'normal'}
                  color={isActive ? 'brand.200' : 'gray.400'}
                  _hover={{ color: 'brand.100', textDecoration: 'none' }}
                  onClick={(e) => handleNavClick(item, e)}
                >
                  {item.label}
                </ChakraLink>
              );
            })}
          </Flex>
        </Flex>
      </Box>

      <Box as="main" flex="1" maxW="1200px" w="full" mx="auto" px={6} py={6}>
        {children}
      </Box>

      <Box as="footer" py={4} textAlign="center" borderTop="1px solid" borderColor="whiteAlpha.100">
        <Text fontSize="sm" color="gray.500">
          三垣二十八宿 · 示意星图（Mock 数据）
        </Text>
      </Box>
    </Flex>
  );
}
