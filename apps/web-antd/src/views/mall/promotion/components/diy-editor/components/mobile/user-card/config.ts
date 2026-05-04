import type { ComponentStyle, DiyComponent } from '../../../util';

import { $t } from '#/locales';

/** 用户卡片属性 */
export interface UserCardProperty {
  style: ComponentStyle; // 组件样式
}

/** 定义组件 */
export const component = {
  id: 'UserCard',
  name: $t('promotion.userCard.title'),
  icon: 'mdi:user-card-details',
  property: {
    style: {
      bgType: 'color',
      bgColor: '',
      marginBottom: 8,
    } as ComponentStyle,
  },
} as DiyComponent<UserCardProperty>;
