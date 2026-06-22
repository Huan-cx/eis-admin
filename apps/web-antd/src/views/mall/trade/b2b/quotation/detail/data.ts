import type { VbenFormSchema } from '#/adapter/form';

import { $t } from '#/locales';

export function getQuotationStatusMap(): Record<number, string> {
  return {
    0: $t('trade.b2b.quotation.status.draft'),
    5: $t('trade.b2b.quotation.status.pendingReview'),
    10: $t('trade.b2b.quotation.status.approved'),
    20: $t('trade.b2b.quotation.status.rejected'),
    30: $t('trade.b2b.quotation.status.accepted'),
    40: $t('trade.b2b.quotation.status.expired'),
  };
}

export function useDetailFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'no',
      label: $t('trade.b2b.quotation.detail.no'),
      component: 'Input',
      componentProps: {
        disabled: true,
      },
    },
    {
      fieldName: 'rfqNo',
      label: $t('trade.b2b.quotation.detail.rfqNo'),
      component: 'Input',
      componentProps: {
        disabled: true,
      },
    },
    {
      fieldName: 'supplierName',
      label: $t('trade.b2b.quotation.detail.supplierName'),
      component: 'Input',
      componentProps: {
        disabled: true,
      },
    },
    {
      fieldName: 'statusName',
      label: $t('trade.b2b.quotation.detail.status'),
      component: 'Input',
      componentProps: {
        disabled: true,
      },
    },
    {
      fieldName: 'totalPrice',
      label: $t('trade.b2b.quotation.detail.totalPrice'),
      component: 'Input',
      componentProps: {
        disabled: true,
      },
    },
    {
      fieldName: 'currency',
      label: $t('trade.b2b.quotation.detail.currency'),
      component: 'Input',
      componentProps: {
        disabled: true,
      },
    },
    {
      fieldName: 'incoterms',
      label: $t('trade.b2b.quotation.detail.incoterms'),
      component: 'Input',
      componentProps: {
        disabled: true,
      },
    },
    {
      fieldName: 'deliveryType',
      label: $t('trade.b2b.quotation.detail.deliveryType'),
      component: 'Input',
      componentProps: {
        disabled: true,
      },
    },
    {
      fieldName: 'validUntil',
      label: $t('trade.b2b.quotation.detail.validUntil'),
      component: 'Input',
      componentProps: {
        disabled: true,
      },
    },
    {
      fieldName: 'remark',
      label: $t('trade.b2b.quotation.detail.remark'),
      component: 'Input',
      componentProps: {
        type: 'textarea',
        rows: 3,
        disabled: true,
      },
    },
    {
      fieldName: 'acceptedAt',
      label: $t('trade.b2b.quotation.detail.acceptedAt'),
      component: 'Input',
      componentProps: {
        disabled: true,
      },
    },
    {
      fieldName: 'createdAt',
      label: $t('trade.b2b.quotation.detail.createdAt'),
      component: 'Input',
      componentProps: {
        disabled: true,
      },
    },
  ];
}
