import type { VbenFormSchema } from '#/adapter/form';
import type { VxeGridPropTypes } from '#/adapter/vxe-table';

import { getSimpleSupplierList } from '#/api/mall/product/supplier';
import { $t } from '#/locales';

export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'status',
      label: $t('trade.b2b.quotation.form.status'),
      component: 'Select',
      componentProps: {
        options: [
          { label: $t('trade.b2b.quotation.status.draft'), value: 0 },
          { label: $t('trade.b2b.quotation.status.pendingReview'), value: 5 },
          { label: $t('trade.b2b.quotation.status.approved'), value: 10 },
          { label: $t('trade.b2b.quotation.status.rejected'), value: 20 },
          { label: $t('trade.b2b.quotation.status.expired'), value: 40 },
        ],
        placeholder: $t('trade.b2b.quotation.form.statusPlaceholder'),
        allowClear: true,
      },
    },
    {
      fieldName: 'supplierId',
      label: $t('trade.b2b.quotation.form.supplierId'),
      component: 'ApiSelect',
      componentProps: {
        api: getSimpleSupplierList,
        labelField: 'name',
        valueField: 'id',
        placeholder: $t('trade.b2b.quotation.form.supplierPlaceholder'),
        allowClear: true,
      },
    },
  ];
}

export function useGridColumns(): VxeGridPropTypes.Columns {
  return [
    {
      type: 'expand',
      width: 80,
      slots: { content: 'expand_content' },
      fixed: 'left',
    },
    {
      field: 'no',
      title: $t('trade.b2b.quotation.grid.no'),
      fixed: 'left',
      minWidth: 180,
    },
    {
      field: 'rfqNo',
      title: $t('trade.b2b.quotation.grid.rfqNo'),
      minWidth: 180,
    },
    {
      field: 'supplierName',
      title: $t('trade.b2b.quotation.grid.supplierName'),
      minWidth: 120,
    },
    {
      field: 'statusName',
      title: $t('trade.b2b.quotation.grid.status'),
      minWidth: 100,
    },
    {
      field: 'totalPrice',
      title: $t('trade.b2b.quotation.grid.totalPrice'),
      slots: { default: 'totalPrice' },
      minWidth: 120,
    },
    {
      field: 'currency',
      title: $t('trade.b2b.quotation.grid.currency'),
      minWidth: 80,
    },
    {
      field: 'createdAt',
      title: $t('trade.b2b.quotation.grid.createdAt'),
      formatter: 'formatDateTime',
      minWidth: 160,
    },
    {
      field: 'actions',
      title: $t('common.actions'),
      width: 280,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}
