import { extendTheme, type ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

/**
 * 深色星图主题
 */
export const theme = extendTheme({
  config,
  colors: {
    brand: {
      50: '#e8eaf6',
      100: '#c5cae9',
      200: '#9fa8da',
      300: '#7986cb',
      400: '#5c6bc0',
      500: '#3f51b5',
      600: '#3949ab',
      700: '#303f9f',
      800: '#283593',
      900: '#1a237e',
    },
    star: {
      bg: '#0a0e1a',
      canvas: '#0d1220',
      dot: '#e8eaf6',
      dotHover: '#fff59d',
      glow: 'rgba(255, 245, 157, 0.6)',
      enclosure: 'rgba(63, 81, 181, 0.15)',
      enclosureBorder: 'rgba(121, 134, 203, 0.4)',
    },
  },
  styles: {
    global: {
      body: {
        bg: 'star.bg',
        color: 'gray.100',
      },
    },
  },
  fonts: {
    heading: '"Noto Serif SC", "Source Han Serif SC", serif',
    body: '"Noto Sans SC", "Source Han Sans SC", sans-serif',
  },
});
