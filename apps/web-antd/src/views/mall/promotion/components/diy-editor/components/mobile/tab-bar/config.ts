import type { DiyComponent } from '../../../util';

import { $t } from '#/locales';

/** 底部导航菜单属性 */
export interface TabBarProperty {
  items: TabBarItemProperty[]; // 选项列表
  theme: string; // 主题
  style: TabBarStyle; // 样式
}

/** 选项属性 */
export interface TabBarItemProperty {
  text: string; // 标签文字
  url: string; // 链接
  iconUrl: string; // 默认图标链接
  activeIconUrl: string; // 选中的图标链接
}

/** 样式 */
export interface TabBarStyle {
  bgType: 'color' | 'img'; // 背景类型
  bgColor: string; // 背景颜色
  bgImg: string; // 图片链接
  color: string; // 默认颜色
  activeColor: string; // 选中的颜色
}

/** 定义组件 */
export const component = {
  id: 'TabBar',
  name: $t('promotion.tabBar.title'),
  icon: 'fluent:table-bottom-row-16-filled',
  property: {
    theme: 'red',
    style: {
      bgType: 'color',
      bgColor: '#fff',
      color: '#282828',
      activeColor: '#fc4141',
    },
    items: [
      {
        text: $t('promotion.tabBar.item.home'),
        url: '/pages/index/index',
        iconUrl: 'http://mall.yudao.iocoder.cn/static/images/1-001.png',
        activeIconUrl: 'http://mall.yudao.iocoder.cn/static/images/1-002.png',
      },
      {
        text: $t('promotion.tabBar.item.category'),
        url: '/pages/index/category?id=3',
        iconUrl: 'http://mall.yudao.iocoder.cn/static/images/2-001.png',
        activeIconUrl: 'http://mall.yudao.iocoder.cn/static/images/2-002.png',
      },
      {
        text: $t('promotion.tabBar.item.cart'),
        url: '/pages/index/cart',
        iconUrl: 'http://mall.yudao.iocoder.cn/static/images/3-001.png',
        activeIconUrl: 'http://mall.yudao.iocoder.cn/static/images/3-002.png',
      },
      {
        text: $t('promotion.tabBar.item.profile'),
        url: '/pages/index/user',
        iconUrl: 'http://mall.yudao.iocoder.cn/static/images/4-001.png',
        activeIconUrl: 'http://mall.yudao.iocoder.cn/static/images/4-002.png',
      },
    ],
  },
} as DiyComponent<TabBarProperty>;

export const THEME_LIST = [
  {
    id: 'red',
    name: $t('promotion.tabBar.theme.red'),
    icon: 'icon-park-twotone:theme',
    color: '#d10019',
  },
  {
    id: 'orange',
    name: $t('promotion.tabBar.theme.orange'),
    icon: 'icon-park-twotone:theme',
    color: '#f37b1d',
  },
  {
    id: 'gold',
    name: $t('promotion.tabBar.theme.gold'),
    icon: 'icon-park-twotone:theme',
    color: '#fbbd08',
  },
  {
    id: 'green',
    name: $t('promotion.tabBar.theme.green'),
    icon: 'icon-park-twotone:theme',
    color: '#8dc63f',
  },
  {
    id: 'cyan',
    name: $t('promotion.tabBar.theme.cyan'),
    icon: 'icon-park-twotone:theme',
    color: '#1cbbb4',
  },
  {
    id: 'blue',
    name: $t('promotion.tabBar.theme.blue'),
    icon: 'icon-park-twotone:theme',
    color: '#0081ff',
  },
  {
    id: 'purple',
    name: $t('promotion.tabBar.theme.purple'),
    icon: 'icon-park-twotone:theme',
    color: '#6739b6',
  },
  {
    id: 'brightRed',
    name: $t('promotion.tabBar.theme.brightRed'),
    icon: 'icon-park-twotone:theme',
    color: '#e54d42',
  },
  {
    id: 'forestGreen',
    name: $t('promotion.tabBar.theme.forestGreen'),
    icon: 'icon-park-twotone:theme',
    color: '#39b54a',
  },
  {
    id: 'mauve',
    name: $t('promotion.tabBar.theme.mauve'),
    icon: 'icon-park-twotone:theme',
    color: '#9c26b0',
  },
  {
    id: 'pink',
    name: $t('promotion.tabBar.theme.pink'),
    icon: 'icon-park-twotone:theme',
    color: '#e03997',
  },
  {
    id: 'brown',
    name: $t('promotion.tabBar.theme.brown'),
    icon: 'icon-park-twotone:theme',
    color: '#a5673f',
  },
  {
    id: 'grey',
    name: $t('promotion.tabBar.theme.grey'),
    icon: 'icon-park-twotone:theme',
    color: '#8799a3',
  },
  {
    id: 'gray',
    name: $t('promotion.tabBar.theme.gray'),
    icon: 'icon-park-twotone:theme',
    color: '#aaaaaa',
  },
  {
    id: 'black',
    name: $t('promotion.tabBar.theme.black'),
    icon: 'icon-park-twotone:theme',
    color: '#333333',
  },
];
