import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { DICT_TYPE } from '@vben/constants';
import { getDictOptions } from '@vben/hooks';
import { fenToYuan } from '@vben/utils';
import { $t } from '#/locales';

/** 列表的搜索表单 */
export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'status',
      label: $t('promotion.point.activity.status'),
      component: 'Select',
      componentProps: {
        options: getDictOptions(DICT_TYPE.COMMON_STATUS, 'number'),
        placeholder: $t('promotion.point.activity.placeholder.status'),
        allowClear: true,
      },
    },
  ];
}

/** 列表的表格列 */
export function useGridColumns(): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'id',
      title: $t('promotion.point.activity.grid.id'),
      minWidth: 80,
    },
    {
      field: 'picUrl',
      title: $t('promotion.point.activity.grid.picUrl'),
      minWidth: 80,
      cellRender: {
        name: 'CellImage',
        props: {
          height: 40,
        },
      },
    },
    {
      field: 'spuName',
      title: $t('promotion.point.activity.grid.spuName'),
      minWidth: 300,
    },
    {
      field: 'marketPrice',
      title: $t('promotion.point.activity.grid.marketPrice'),
      minWidth: 100,
      formatter: ({ row }) => `￥${fenToYuan(row.marketPrice)}`,
    },
    {
      field: 'status',
      title: $t('promotion.point.activity.status'),
      minWidth: 100,
      cellRender: {
        name: 'CellDict',
        props: { type: DICT_TYPE.COMMON_STATUS },
      },
    },
    {
      field: 'stock',
      title: $t('promotion.point.activity.grid.stock'),
      minWidth: 80,
    },
    {
      field: 'totalStock',
      title: $t('promotion.point.activity.grid.totalStock'),
      minWidth: 80,
    },
    {
      field: 'redeemedQuantity',
      title: $t('promotion.point.activity.grid.redeemedQuantity'),
      minWidth: 100,
      formatter: ({ row }) => {
        return (row.totalStock || 0) - (row.stock || 0);
      },
    },
    {
      field: 'createTime',
      title: $t('promotion.point.activity.grid.createTime'),
      minWidth: 180,
      formatter: 'formatDateTime',
    },
    {
      title: $t('promotion.point.activity.grid.actions'),
      width: 150,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}

/** 新增/修改的表单 */
export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'id',
      dependencies: {
        triggerFields: [''],
        show: () => false,
      },
    },
    {
      fieldName: 'sort',
      label: $t('promotion.point.activity.form.sort'),
      component: 'InputNumber',
      componentProps: {
        min: 0,
        placeholder: $t('promotion.point.activity.placeholder.sort'),
        class: '!w-full',
      },
      defaultValue: 0,
      rules: 'required',
    },
    {
      fieldName: 'remark',
      label: $t('promotion.point.activity.form.remark'),
      component: 'Textarea',
      componentProps: {
        placeholder: $t('promotion.point.activity.placeholder.remark'),
        rows: 4,
      },
      formItemClass: 'col-span-2',
    },
    {
      fieldName: 'spuId',
      label: $t('promotion.point.activity.form.spuId'),
      component: 'Input',
      rules: 'required',
      formItemClass: 'col-span-2',
    },
  ];
}
