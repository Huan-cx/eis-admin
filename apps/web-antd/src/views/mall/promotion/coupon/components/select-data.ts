import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { DICT_TYPE } from '@vben/constants';
import { getDictOptions } from '@vben/hooks';

import { $t } from '#/locales';

import {
  discountFormat,
  remainedCountFormat,
  takeLimitCountFormat,
  validityTypeFormat,
} from '../formatter';

/** 优惠券选择的搜索表单 */
export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'name',
      label: $t('promotion.coupon.name'),
      component: 'Input',
      componentProps: {
        placeholder: $t('promotion.coupon.placeholder.name'),
        allowClear: true,
      },
    },
    {
      fieldName: 'discountType',
      label: $t('promotion.coupon.selectForm.discountType'),
      component: 'Select',
      componentProps: {
        options: getDictOptions(DICT_TYPE.PROMOTION_DISCOUNT_TYPE, 'number'),
        placeholder: $t('promotion.coupon.selectForm.placeholder.discountType'),
        allowClear: true,
      },
    },
  ];
}

/** 优惠券选择的表格列 */
export function useGridColumns(): VxeTableGridOptions['columns'] {
  return [
    { type: 'checkbox', width: 55 },
    {
      field: 'name',
      title: $t('promotion.coupon.name'),
      minWidth: 140,
    },
    {
      field: 'productScope',
      title: $t('promotion.coupon.selectForm.grid.productScope'),
      minWidth: 80,
      cellRender: {
        name: 'CellDict',
        props: { type: DICT_TYPE.PROMOTION_PRODUCT_SCOPE },
      },
    },
    {
      field: 'discountType',
      title: $t('promotion.coupon.selectForm.discountType'),
      minWidth: 100,
      cellRender: {
        name: 'CellDict',
        props: { type: DICT_TYPE.PROMOTION_DISCOUNT_TYPE },
      },
    },
    {
      field: 'discountPrice',
      title: $t('promotion.coupon.grid.discountLevel'),
      minWidth: 100,
      formatter: ({ row }) => discountFormat(row),
    },
    {
      field: 'takeType',
      title: $t('promotion.coupon.takeType'),
      minWidth: 100,
      cellRender: {
        name: 'CellDict',
        props: { type: DICT_TYPE.PROMOTION_COUPON_TAKE_TYPE },
      },
    },
    {
      field: 'validityType',
      title: $t('promotion.coupon.selectForm.grid.useTime'),
      minWidth: 185,
      align: 'center',
      formatter: ({ row }) => validityTypeFormat(row),
    },
    {
      field: 'totalCount',
      title: $t('promotion.coupon.selectForm.grid.totalCount'),
      minWidth: 100,
      align: 'center',
    },
    {
      field: 'remainedCount',
      title: $t('promotion.coupon.sendForm.grid.remainedCount'),
      minWidth: 100,
      align: 'center',
      formatter: ({ row }) => remainedCountFormat(row),
    },
    {
      field: 'takeLimitCount',
      title: $t('promotion.coupon.selectForm.grid.takeLimit'),
      minWidth: 100,
      align: 'center',
      formatter: ({ row }) => takeLimitCountFormat(row),
    },
    {
      field: 'status',
      title: $t('promotion.coupon.status'),
      minWidth: 80,
      align: 'center',
      cellRender: {
        name: 'CellDict',
        props: { type: DICT_TYPE.COMMON_STATUS },
      },
    },
  ];
}
