import { describe, it, expect, beforeEach } from 'vitest';
import {
  createStarFuse,
  searchStars,
  sortStars,
  type SortBy,
} from './starUtils';
import type { Star } from '@/types/star';

const mockStars: Star[] = [
  {
    id: 'star-1',
    name: '紫微左垣',
    enclosure: '紫微垣',
    enclosureId: 'ziwei',
    x: 50,
    y: 30,
    magnitude: 2.5,
    summary: '紫微左垣是紫微垣的左墙，由八颗星组成。',
  },
  {
    id: 'star-2',
    name: '紫微右垣',
    enclosure: '紫微垣',
    enclosureId: 'ziwei',
    x: 60,
    y: 35,
    magnitude: 3.0,
    summary: '紫微右垣是紫微垣的右墙，由七颗星组成。',
  },
  {
    id: 'star-3',
    name: '太微左垣',
    enclosure: '太微垣',
    enclosureId: 'taiwei',
    x: 40,
    y: 50,
    magnitude: 1.8,
    summary: '太微左垣是太微垣的左墙，共五星。',
  },
  {
    id: 'star-4',
    name: '太微右垣',
    enclosure: '太微垣',
    enclosureId: 'taiwei',
    x: 55,
    y: 55,
    magnitude: 4.2,
    summary: '太微右垣是太微垣的右墙，共五星。',
  },
  {
    id: 'star-5',
    name: '天市左垣',
    enclosure: '天市垣',
    enclosureId: 'tianshi',
    x: 30,
    y: 70,
    magnitude: 0.9,
    summary: '天市左垣是天市垣的左墙，共十一星。',
  },
  {
    id: 'star-6',
    name: '天市右垣',
    enclosure: '天市垣',
    enclosureId: 'tianshi',
    x: 65,
    y: 75,
    magnitude: 5.1,
    summary: '天市右垣是天市垣的右墙，共十一星。',
  },
];

describe('starUtils - searchStars', () => {
  let fuse: ReturnType<typeof createStarFuse>;

  beforeEach(() => {
    fuse = createStarFuse(mockStars);
  });

  it('空关键词应返回全部星官', () => {
    const result = searchStars(mockStars, fuse, '');
    expect(result).toHaveLength(mockStars.length);
    expect(result).toEqual(mockStars);
  });

  it('空白字符串关键词应返回全部星官', () => {
    const result = searchStars(mockStars, fuse, '   ');
    expect(result).toHaveLength(mockStars.length);
    expect(result).toEqual(mockStars);
  });

  it('模糊匹配星官名称 - 精确匹配紫微左垣', () => {
    const result = searchStars(mockStars, fuse, '紫微左垣');
    expect(result.length).toBeGreaterThan(0);
    expect(result[0].name).toBe('紫微左垣');
  });

  it('模糊匹配星官名称 - 部分匹配紫微', () => {
    const result = searchStars(mockStars, fuse, '紫微');
    expect(result.length).toBeGreaterThanOrEqual(2);
    const names = result.map((s) => s.name);
    expect(names).toContain('紫微左垣');
    expect(names).toContain('紫微右垣');
  });

  it('模糊匹配星官名称 - 部分匹配左垣', () => {
    const result = searchStars(mockStars, fuse, '左垣');
    expect(result.length).toBeGreaterThanOrEqual(3);
    const names = result.map((s) => s.name);
    expect(names).toContain('紫微左垣');
    expect(names).toContain('太微左垣');
    expect(names).toContain('天市左垣');
  });

  it('模糊匹配星官名称 - 匹配三垣名称', () => {
    const result = searchStars(mockStars, fuse, '天市');
    expect(result.length).toBeGreaterThanOrEqual(2);
    const names = result.map((s) => s.name);
    expect(names).toContain('天市左垣');
    expect(names).toContain('天市右垣');
  });

  it('无匹配关键词应返回空数组', () => {
    const result = searchStars(mockStars, fuse, '不存在的星官xyz');
    expect(result).toEqual([]);
  });
});

describe('starUtils - sortStars', () => {
  it('default 排序保持原顺序', () => {
    const result = sortStars(mockStars, 'default');
    expect(result).toHaveLength(mockStars.length);
    expect(result.map((s) => s.id)).toEqual(mockStars.map((s) => s.id));
  });

  it('magnitude-asc 视星等由亮到暗排序', () => {
    const result = sortStars(mockStars, 'magnitude-asc');
    expect(result).toHaveLength(mockStars.length);
    for (let i = 0; i < result.length - 1; i++) {
      expect(result[i].magnitude).toBeLessThanOrEqual(result[i + 1].magnitude);
    }
    expect(result[0].name).toBe('天市左垣');
    expect(result[result.length - 1].name).toBe('天市右垣');
  });

  it('magnitude-desc 视星等由暗到亮排序', () => {
    const result = sortStars(mockStars, 'magnitude-desc');
    expect(result).toHaveLength(mockStars.length);
    for (let i = 0; i < result.length - 1; i++) {
      expect(result[i].magnitude).toBeGreaterThanOrEqual(result[i + 1].magnitude);
    }
    expect(result[0].name).toBe('天市右垣');
    expect(result[result.length - 1].name).toBe('天市左垣');
  });

  it('排序不修改原数组', () => {
    const originalIds = mockStars.map((s) => s.id);
    sortStars(mockStars, 'magnitude-asc');
    expect(mockStars.map((s) => s.id)).toEqual(originalIds);
  });

  it('空数组排序返回空数组', () => {
    const resultAsc = sortStars([], 'magnitude-asc');
    const resultDesc = sortStars([], 'magnitude-desc');
    const resultDefault = sortStars([], 'default');
    expect(resultAsc).toEqual([]);
    expect(resultDesc).toEqual([]);
    expect(resultDefault).toEqual([]);
  });

  it('单元素数组排序保持不变', () => {
    const singleStar = [mockStars[0]];
    const resultAsc = sortStars(singleStar, 'magnitude-asc');
    const resultDesc = sortStars(singleStar, 'magnitude-desc');
    expect(resultAsc).toHaveLength(1);
    expect(resultDesc).toHaveLength(1);
    expect(resultAsc[0].id).toBe(mockStars[0].id);
    expect(resultDesc[0].id).toBe(mockStars[0].id);
  });
});

describe('starUtils - 搜索与排序组合', () => {
  let fuse: ReturnType<typeof createStarFuse>;

  beforeEach(() => {
    fuse = createStarFuse(mockStars);
  });

  it('搜索紫微后按视星等由亮到暗排序', () => {
    const searched = searchStars(mockStars, fuse, '紫微');
    const sorted = sortStars(searched, 'magnitude-asc');
    expect(sorted.length).toBeGreaterThanOrEqual(2);
    for (let i = 0; i < sorted.length - 1; i++) {
      expect(sorted[i].magnitude).toBeLessThanOrEqual(sorted[i + 1].magnitude);
    }
    expect(sorted[0].name).toContain('紫微');
  });

  it('搜索左垣后按视星等由暗到亮排序', () => {
    const searched = searchStars(mockStars, fuse, '左垣');
    const sorted = sortStars(searched, 'magnitude-desc');
    expect(sorted.length).toBeGreaterThanOrEqual(3);
    for (let i = 0; i < sorted.length - 1; i++) {
      expect(sorted[i].magnitude).toBeGreaterThanOrEqual(sorted[i + 1].magnitude);
    }
  });
});

describe('starUtils - createStarFuse', () => {
  it('能正确创建 Fuse 实例', () => {
    const fuse = createStarFuse(mockStars);
    expect(fuse).toBeDefined();
    expect(typeof fuse.search).toBe('function');
  });

  it('空数组也能创建 Fuse 实例', () => {
    const fuse = createStarFuse([]);
    expect(fuse).toBeDefined();
    const result = fuse.search('test');
    expect(result).toEqual([]);
  });
});

describe('starUtils - SortBy 类型', () => {
  it('支持所有排序方式', () => {
    const sortBys: SortBy[] = ['default', 'magnitude-asc', 'magnitude-desc'];
    sortBys.forEach((sortBy) => {
      const result = sortStars(mockStars, sortBy);
      expect(result).toHaveLength(mockStars.length);
    });
  });
});
