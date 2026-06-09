import type { VbenFormSchema } from '#/adapter/form';

import { $t } from '#/locales';

export const rfqStatusMap: Record<number, string> = {
  0: '草稿',
  10: '待报价',
  15: '处理中',
  20: '已报价',
  30: '已接受',
  40: '已拒绝',
  50: '已取消',
};

export function useDetailFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'no',
      label: $t('trade.b2b.rfq.detail.no'),
      component: 'Input',
      componentProps: {
        disabled: true,
      },
    },
    {
      fieldName: 'statusName',
      label: $t('trade.b2b.rfq.detail.status'),
      component: 'Input',
      componentProps: {
        disabled: true,
      },
    },
    {
      fieldName: 'requirement',
      label: $t('trade.b2b.rfq.detail.requirement'),
      component: 'Input',
      componentProps: {
        type: 'textarea',
        rows: 3,
        disabled: true,
      },
    },
    {
      fieldName: 'supplierName',
      label: $t('trade.b2b.rfq.detail.supplierName'),
      component: 'Input',
      componentProps: {
        disabled: true,
      },
    },
    {
      fieldName: 'validUntil',
      label: $t('trade.b2b.rfq.detail.validUntil'),
      component: 'Input',
      componentProps: {
        disabled: true,
      },
    },
    {
      fieldName: 'submittedAt',
      label: $t('trade.b2b.rfq.detail.submittedAt'),
      component: 'Input',
      componentProps: {
        disabled: true,
      },
    },
    {
      fieldName: 'createdAt',
      label: $t('trade.b2b.rfq.detail.createdAt'),
      component: 'Input',
      componentProps: {
        disabled: true,
      },
    },
  ];
}
