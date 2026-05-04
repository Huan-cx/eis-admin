import type { VbenFormSchema } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';

import {
  discountFormat,
  remainedCountFormat,
  usePriceFormat,
  validityTypeFormat,
} from '../formatter';
import { $t } from '#/locales';

/** 搜索表单的 schema */
export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'name',
      label: $t('promotion.coupon.name'),
      componentProps: {
        placeholder: $t('promotion.coupon.placeholder.name'),
        allowClear: true,
      },
    },
  ];
}

/** 表格列配置 */
export function useGridColumns(): VxeGridProps['columns'] {
  return [
    {
      title: $t('promotion.coupon.name'),
      field: 'name',
      minWidth: 120,
    },
    {
      title: $t('promotion.coupon.sendForm.grid.discount'),
      field: 'discount',
      minWidth: 120,
      formatter: ({ row }) => discountFormat(row),
    },
    {
      title: $t('promotion.coupon.minPrice'),
      field: 'usePrice',
      minWidth: 100,
      formatter: ({ row }) => usePriceFormat(row),
    },
    {
      title: $t('promotion.coupon.sendForm.grid.validity'),
      field: 'validityType',
      minWidth: 140,
      formatter: ({ row }) => validityTypeFormat(row),
    },
    {
      title: $t('promotion.coupon.sendForm.grid.remainedCount'),
      minWidth: 100,
      formatter: ({ row }) => remainedCountFormat(row),
    },
    {
      title: $t('promotion.coupon.sendForm.grid.actions'),
      width: 100,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}
