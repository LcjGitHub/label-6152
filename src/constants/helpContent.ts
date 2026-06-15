export interface HelpSection {
  id: string;
  title: string;
  icon?: string;
  description: string;
  items: HelpItem[];
}

export interface HelpItem {
  id: string;
  title: string;
  content: string;
  tips?: string[];
}

export const HELP_SECTIONS: HelpSection[] = [
  {
    id: 'overview',
    title: '概览',
    description: '快速了解三垣整体结构，从这里开始探索星空',
    items: [
      {
        id: 'overview-intro',
        title: '页面功能',
        content:
          '概览页面展示中国古代星空划分的三个重要天区：紫微垣、太微垣和天市垣，合称「三垣」。每张卡片展示该垣的名称、星官数量和简要说明。',
      },
      {
        id: 'overview-usage',
        title: '基本操作',
        content: '点击任意垣域卡片，可跳转至星官列表页面并自动筛选出该垣下的所有星官。',
        tips: [
          '紫微垣位于北天中央，是天帝的居所',
          '太微垣位于紫微垣东北，象征天庭政府',
          '天市垣位于紫微垣东南，是天上的集贸市场',
        ],
      },
    ],
  },
  {
    id: 'star-list',
    title: '星官列表',
    description: '浏览和搜索所有星官，查看详细信息',
    items: [
      {
        id: 'star-list-intro',
        title: '页面功能',
        content:
          '星官列表页面收录了三垣所有星官，支持按垣域分组浏览、模糊搜索和多种排序方式。点击星官卡片可查看详情。',
      },
      {
        id: 'star-list-search',
        title: '搜索功能',
        content:
          '在搜索框中输入关键词，可以搜索星官名称、所属垣域和简介描述。搜索支持模糊匹配，输入不完整的名称也能找到相关结果。',
        tips: ['搜索结果会实时更新', '清空搜索框可恢复完整列表'],
      },
      {
        id: 'star-list-sort',
        title: '排序方式',
        content:
          '通过排序下拉菜单，可以选择不同的排序方式：默认排序、按名称排序、按星等排序（从亮到暗）。',
      },
      {
        id: 'star-list-detail',
        title: '查看详情',
        content:
          '点击任意星官卡片，会从右侧滑出详情面板，展示星官的详细介绍、星等、所属垣域等信息。',
        tips: [
          '按 Enter 键也可以打开选中的星官详情',
          '详情面板右上角有收藏按钮，可快速收藏',
        ],
      },
      {
        id: 'star-list-filter',
        title: '垣域筛选',
        content:
          '从概览页面点击卡片进入时，会自动按对应垣域筛选星官。页面顶部会显示当前筛选标签，点击标签右侧的关闭按钮可清除筛选。',
      },
    ],
  },
  {
    id: 'star-map',
    title: '简化星图',
    description: '以可视化方式浏览星官的位置分布',
    items: [
      {
        id: 'star-map-intro',
        title: '页面功能',
        content:
          '简化星图以可视化方式展示星官在夜空中的分布。星点大小对应视星等，越亮的星越大。垣域用半透明色块标识范围。',
      },
      {
        id: 'star-map-interaction',
        title: '交互操作',
        content:
          '将鼠标悬停在星点上，会显示该星官的名称和星等。点击星点可打开详情面板查看更多信息。',
        tips: [
          '星图左侧有图例说明，可展开/收起',
          '图例中包含垣域标识、星等大小对照等说明',
        ],
      },
      {
        id: 'star-map-legend',
        title: '图例面板',
        content:
          '星图左侧的图例面板解释了图中各种符号的含义，包括垣域范围、星等大小对照、背景散点等。点击面板标题可展开或折叠图例。',
      },
    ],
  },
  {
    id: 'lunar-mansion',
    title: '二十八宿',
    description: '了解二十八星宿体系及其与星官的对应关系',
    items: [
      {
        id: 'lunar-mansion-intro',
        title: '页面功能',
        content:
          '二十八宿是中国古代将黄道附近的星空划分为二十八个星区的体系，用于观测日月五星的运行和季节的变化。',
      },
      {
        id: 'lunar-mansion-structure',
        title: '四象与二十八宿',
        content:
          '二十八宿按东、北、西、南四个方位分为四组，每组七宿，分别与四种神兽（四象）对应：东方苍龙、北方玄武、西方白虎、南方朱雀。',
      },
      {
        id: 'lunar-mansion-detail',
        title: '查看详情',
        content:
          '点击任意星宿卡片，可查看该宿的详细信息，包括名称、对应星官、方位等。',
      },
    ],
  },
  {
    id: 'four-symbols',
    title: '四象',
    description: '了解四象（四大神兽）与星空的对应关系',
    items: [
      {
        id: 'four-symbols-intro',
        title: '页面功能',
        content:
          '四象是中国古代天文学中的四个方位神，分别为东方青龙、西方白虎、南方朱雀、北方玄武，各统领七个星宿。',
      },
      {
        id: 'four-symbols-meaning',
        title: '文化含义',
        content:
          '四象不仅是天文学概念，也深深融入了中国传统文化，在风水、占卜、军事等领域都有广泛应用。',
      },
    ],
  },
  {
    id: 'statistics',
    title: '统计',
    description: '查看星官数据的统计信息',
    items: [
      {
        id: 'statistics-intro',
        title: '页面功能',
        content:
          '统计页面展示了星官数据的多维度统计，包括星官总数、最亮星等、平均星等，以及按垣域和星等分布的可视化图表。',
      },
      {
        id: 'statistics-charts',
        title: '图表说明',
        content:
          '三垣星官数量柱状图对比各垣的星官数量；视星等分布图展示不同亮度区间的星官数量分布。',
      },
    ],
  },
  {
    id: 'compare',
    title: '对照',
    description: '对比不同星官的信息',
    items: [
      {
        id: 'compare-intro',
        title: '页面功能',
        content: '对照页面支持将多个星官放在一起对比，方便查看它们的异同。',
      },
      {
        id: 'compare-usage',
        title: '使用方式',
        content:
          '在对照页面中，可以添加或移除要对比的星官，以卡片形式并排展示各星官的关键信息。',
      },
    ],
  },
  {
    id: 'dictionary',
    title: '词典',
    description: '查询天文术语和名词解释',
    items: [
      {
        id: 'dictionary-intro',
        title: '页面功能',
        content:
          '词典页面收录了中国古代天文学中的常用术语和名词解释，是学习天文知识的好帮手。',
      },
      {
        id: 'dictionary-search',
        title: '搜索查询',
        content: '可通过搜索框快速查找感兴趣的术语，支持按名称和内容模糊搜索。',
      },
    ],
  },
  {
    id: 'favorite',
    title: '收藏',
    description: '管理你的星官收藏',
    items: [
      {
        id: 'favorite-intro',
        title: '页面功能',
        content:
          '收藏页面展示你已收藏的所有星官，方便快速访问感兴趣的内容。收藏数据保存在本地浏览器中。',
      },
      {
        id: 'favorite-add',
        title: '添加收藏',
        content:
          '在星官列表或详情面板中，点击星形图标即可将星官加入收藏。再次点击可取消收藏。',
        tips: ['收藏的星官会保存在本地，刷新页面不会丢失', '收藏按钮在卡片右上角，实心星形表示已收藏'],
      },
      {
        id: 'favorite-manage',
        title: '管理收藏',
        content:
          '在收藏页面中，可以直接查看和管理所有已收藏的星官，点击卡片查看详情，点击星形图标取消收藏。',
      },
    ],
  },
  {
    id: 'history',
    title: '历史',
    description: '查看你浏览过的星官记录',
    items: [
      {
        id: 'history-intro',
        title: '页面功能',
        content:
          '历史页面记录你浏览过的星官，方便你回溯之前查看过的内容。浏览历史保存在本地。',
      },
      {
        id: 'history-usage',
        title: '使用方式',
        content:
          '当你在星官列表或星图中打开任意星官的详情面板时，该星官会自动加入浏览历史。',
      },
    ],
  },
];
