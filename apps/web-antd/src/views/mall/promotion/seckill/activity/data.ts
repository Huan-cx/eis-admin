import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { DICT_TYPE } from '@vben/constants';
import { getDictOptions } from '@vben/hooks';

import { z } from '#/adapter/form';
import { getSimpleSeckillConfigList } from '#/api/mall/promotion/seckill/seckillConfig';
import { $t } from '#/locales';

/** 列表的搜索表单 */
export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'name',
      label: $t('promotion.seckill.activity.name'),
      component: 'Input',
      componentProps: {
        placeholder: $t('promotion.seckill.activity.placeholder.name'),
        allowClear: true,
      },
    },
    {
      fieldName: 'status',
      label: $t('promotion.seckill.activity.status'),
      component: 'Select',
      componentProps: {
        placeholder: $t('promotion.seckill.activity.placeholder.status'),
        allowClear: true,
        options: getDictOptions(DICT_TYPE.COMMON_STATUS, 'number'),
      },
    },
  ];
}

/** 新增/编辑的表单 */
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
      fieldName: 'name',
      label: $t('promotion.seckill.activity.form.name'),
      component: 'Input',
      componentProps: {
        placeholder: $t('promotion.seckill.activity.placeholder.name'),
      },
      rules: 'required',
      formItemClass: 'col-span-2',
    },
    {
      fieldName: 'startTime',
      label: $t('promotion.seckill.activity.form.startTime'),
      component: 'DatePicker',
      componentProps: {
        placeholder: $t('promotion.seckill.activity.placeholder.startTime'),
        showTime: true,
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'x',
        class: 'w-full',
      },
      rules: 'required',
    },
    {
      fieldName: 'endTime',
      label: $t('promotion.seckill.activity.form.endTime'),
      component: 'DatePicker',
      componentProps: {
        placeholder: $t('promotion.seckill.activity.placeholder.endTime'),
        showTime: true,
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'x',
        class: 'w-full',
      },
      rules: 'required',
    },
    {
      fieldName: 'configIds',
      label: $t('promotion.seckill.activity.form.configIds'),
      component: 'ApiSelect',
      componentProps: {
        placeholder: $t('promotion.seckill.activity.placeholder.configIds'),
        mode: 'multiple',
        api: getSimpleSeckillConfigList,
        labelField: 'name',
        valueField: 'id',
        class: 'w-full',
      },
      rules: 'required',
      formItemClass: 'col-span-2',
    },
    {
      fieldName: 'totalLimitCount',
      label: $t('promotion.seckill.activity.form.totalLimitCount'),
      component: 'InputNumber',
      componentProps: {
        placeholder: $t('promotion.seckill.activity.placeholder.totalLimitCount'),
        min: 0,
        class: 'w-full',
      },
      rules: z.number().min(0).default(0),
    },
    {
      fieldName: 'singleLimitCount',
      label: $t('promotion.seckill.activity.form.singleLimitCount'),
      component: 'InputNumber',
      componentProps: {
        placeholder: $t('promotion.seckill.activity.placeholder.singleLimitCount'),
        min: 0,
        class: 'w-full',
      },
      rules: z.number().min(0).default(0),
    },
    {
      fieldName: 'sort',
      label: $t('promotion.seckill.activity.form.sort'),
      component: 'InputNumber',
      componentProps: {
        placeholder: $t('promotion.seckill.activity.placeholder.sort'),
        min: 0,
        class: 'w-full',
      },
      rules: z.number().min(0).default(0),
    },
    {
      fieldName: 'remark',
      label: $t('promotion.seckill.activity.form.remark'),
      component: 'Textarea',
      componentProps: {
        placeholder: $t('promotion.seckill.activity.placeholder.remark'),
        rows: 4,
      },
      formItemClass: 'col-span-2',
    },
    {
      fieldName: 'spuId',
      label: $t('promotion.seckill.activity.form.spuId'),
      component: 'Input',
      formItemClass: 'col-span-2',
    },
  ];
}

/** 列表的字段 */
export function useGridColumns(): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'id',
      title: $t('promotion.seckill.activity.grid.id'),
      minWidth: 80,
    },
    {
      field: 'name',
      title: $t('promotion.seckill.activity.form.name'),
      minWidth: 140,
    },
    {
      field: 'configIds',
      title: $t('promotion.seckill.activity.grid.configIds'),
      minWidth: 220,
      slots: { default: 'configIds' },
    },
    {
      field: 'startTime',
      title: $t('promotion.seckill.activity.grid.activityTime'),
      minWidth: 210,
      slots: { default: 'timeRange' },
    },
    {
      field: 'picUrl',
      title: $t('promotion.seckill.activity.grid.picUrl'),
      minWidth: 80,
      cellRender: {
        name: 'CellImage',
      },
    },
    {
      field: 'spuName',
      title: $t('promotion.seckill.activity.grid.spuName'),
      minWidth: 300,
    },
    {
      field: 'marketPrice',
      title: $t('promotion.seckill.activity.grid.marketPrice'),
      minWidth: 100,
      formatter: ({ row }) => `${$t('promotion.seckill.activity.grid.currency')}${(row.marketPrice / 100).toFixed(2)}`,
    },
    {
      field: 'seckillPrice',
      title: $t('promotion.seckill.activity.grid.seckillPrice'),
      minWidth: 100,
      formatter: ({ row }) => {
        if (!(row.products || row.products.length === 0)) {
          return `${$t('promotion.seckill.activity.grid.currency')}0.00`;
        }
        const seckillPrice = Math.min(
          ...row.products.map((item: any) => item.seckillPrice),
        );
        return `${$t('promotion.seckill.activity.grid.currency')}${(seckillPrice / 100).toFixed(2)}`;
      },
    },
    {
      field: 'status',
      title: $t('promotion.seckill.activity.form.status'),
      align: 'center',
      minWidth: 100,
      cellRender: {
        name: 'CellDict',
        props: { type: DICT_TYPE.COMMON_STATUS },
      },
    },
    {
      field: 'stock',
      title: $t('promotion.seckill.activity.grid.stock'),
      align: 'center',
      minWidth: 80,
    },
    {
      field: 'totalStock',
      title: $t('promotion.seckill.activity.grid.totalStock'),
      align: 'center',
      minWidth: 80,
    },
    {
      field: 'createTime',
      title: $t('promotion.seckill.activity.grid.createTime'),
      align: 'center',
      minWidth: 180,
      formatter: 'formatDateTime',
    },
    {
      title: $t('promotion.seckill.activity.grid.actions'),
      align: 'center',
      width: 150,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}
