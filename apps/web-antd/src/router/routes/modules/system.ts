import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    path: '/system/notify-message',
    component: () => import('#/views/system/notify/my/index.vue'),
    name: 'MyNotifyMessage',
    meta: {
      title: $t('page.system.notify.message'),
      icon: 'ant-design:message-filled',
      hideInMenu: true,
    },
  },
];

export default routes;
