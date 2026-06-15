import { Box, Flex, Heading, Link as ChakraLink, Spacer, Text } from '@chakra-ui/react';
import { Link as RouterLink, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { deleteSearchParam } from '@/utils/urlUtils';

interface NavItem {
  path: string;
  label: string;
  clearParams?: string[];
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
  const [searchParams] = useSearchParams();

  const navItems: NavItem[] = [
    { path: '/概览', label: '概览' },
    { path: '/', label: '星官列表', clearParams: ['enclosure'] },
    { path: '/二十八宿', label: '二十八宿' },
    { path: '/map', label: '简化星图' },
    { path: '/对照', label: '对照' },
    { path: '/统计', label: '统计' },
    { path: '/词典', label: '词典' },
    { path: '/收藏', label: '我的收藏' },
    { path: '/历史', label: '历史' },
  ];

  const handleNavClick = (item: NavItem, e: React.MouseEvent) => {
    if (item.clearParams && item.clearParams.length > 0) {
      e.preventDefault();
      let nextParams = new URLSearchParams(searchParams);
      item.clearParams.forEach((param) => {
        nextParams = deleteSearchParam(nextParams, param);
      });
      navigate({ pathname: item.path, search: nextParams.toString() });
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
