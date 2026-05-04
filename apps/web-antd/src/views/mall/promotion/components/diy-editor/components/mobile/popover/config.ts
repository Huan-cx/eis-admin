import type { DiyComponent } from '../../../util';

import { $t } from '#/locales';

/** 弹窗广告属性 */
export interface PopoverProperty {
  list: PopoverItemProperty[]; // 弹窗列表
}

/** 弹窗广告项目属性 */
export interface PopoverItemProperty {
  imgUrl: string; // 图片地址
  url: string; // 跳转连接
  showType: 'always' | 'once'; // 显示类型：仅显示一次、每次启动都会显示
}

/** 定义组件 */
export const component = {
  id: 'Popover',
  name: $t('promotion.popover.title'),
  icon: 'carbon:popup',
  position: 'fixed',
  property: {
    list: [{ showType: 'once' }],
  },
} as DiyComponent<PopoverProperty>;
