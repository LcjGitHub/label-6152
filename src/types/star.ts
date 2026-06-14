/**
 * 三垣信息
 */
export interface Enclosure {
  id: string;
  name: string;
  description: string;
}

/**
 * 星官数据
 */
export interface Star {
  id: string;
  name: string;
  enclosure: string;
  enclosureId: string;
  /** 画布横向百分比坐标 0–100 */
  x: number;
  /** 画布纵向百分比坐标 0–100 */
  y: number;
  magnitude: number;
  summary: string;
}

/**
 * Mock 数据根结构
 */
export interface StarCatalogData {
  enclosures: Enclosure[];
  stars: Star[];
}

/**
 * Canvas 上可点击的星点区域
 */
export interface StarHitArea {
  star: Star;
  cx: number;
  cy: number;
  radius: number;
}

/**
 * Popover 锚点位置
 */
export interface PopoverAnchor {
  x: number;
  y: number;
}
