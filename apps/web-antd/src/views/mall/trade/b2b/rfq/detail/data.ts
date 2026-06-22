import type { VbenFormSchema } from '#/adapter/form';

import { $t } from '#/locales';

export function getRfqStatusMap(): Record<number, string> {
  return {
    0: $t('trade.b2b.rfqStatus.pending'),
    10: $t('trade.b2b.rfqStatus.submitted'),
    15: $t('trade.b2b.rfqStatus.processing'),
    20: $t('trade.b2b.rfqStatus.processing'),
    30: $t('trade.b2b.rfqStatus.completed'),
    40: $t('trade.b2b.rfqStatus.cancelled'),
    50: $t('trade.b2b.rfqStatus.cancelled'),
  };
}

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
