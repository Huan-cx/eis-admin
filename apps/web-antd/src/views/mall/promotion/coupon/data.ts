import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { DICT_TYPE } from '@vben/constants';

import { getRangePickerDefaultProps } from '#/utils';
import { $t } from '#/locales';

import { discountFormat } from './formatter';

/** 列表的搜索表单 */
export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'nickname',
      label: $t('promotion.coupon.form.nickname'),
      component: 'Input',
      componentProps: {
        placeholder: $t('promotion.coupon.placeholder.nickname'),
        allowClear: true,
      },
    },
    {
      fieldName: 'createTime',
      label: $t('promotion.coupon.form.createTime'),
      component: 'RangePicker',
      componentProps: {
        ...getRangePickerDefaultProps(),
        allowClear: true,
      },
    },
  ];
}

/** 列表的字段 */
export function useGridColumns(): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'nickname',
      title: $t('promotion.coupon.form.nickname'),
      minWidth: 100,
    },
    {
      field: 'name',
      title: $t('promotion.coupon.name'),
      minWidth: 140,
    },
    {
      field: 'productScope',
      title: $t('promotion.coupon.grid.productScope'),
      minWidth: 110,
      cellRender: {
        name: 'CellDict',
        props: { type: DICT_TYPE.PROMOTION_PRODUCT_SCOPE },
      },
    },
    {
      field: 'discountType',
      title: $t('promotion.coupon.grid.discount'),
      minWidth: 110,
      cellRender: {
        name: 'CellDict',
        props: { type: DICT_TYPE.PROMOTION_DISCOUNT_TYPE },
      },
    },
    {
      field: 'discountPrice',
      title: $t('promotion.coupon.grid.discountLevel'),
      minWidth: 110,
      formatter: ({ row }) => {
        return discountFormat(row);
      },
    },
    {
      field: 'takeType',
      title: $t('promotion.coupon.takeType'),
      minWidth: 110,
      cellRender: {
        name: 'CellDict',
        props: { type: DICT_TYPE.PROMOTION_COUPON_TAKE_TYPE },
      },
    },
    {
      field: 'status',
      title: $t('promotion.coupon.status'),
      minWidth: 110,
      cellRender: {
        name: 'CellDict',
        props: { type: DICT_TYPE.PROMOTION_COUPON_STATUS },
      },
    },
    {
      field: 'createTime',
      title: $t('promotion.coupon.form.createTime'),
      minWidth: 180,
      formatter: 'formatDateTime',
    },
    {
      field: 'useTime',
      title: $t('promotion.coupon.grid.useTime'),
      minWidth: 180,
      formatter: 'formatDateTime',
    },
    {
      field: 'actions',
      title: $t('promotion.coupon.grid.actions'),
      width: 100,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}
