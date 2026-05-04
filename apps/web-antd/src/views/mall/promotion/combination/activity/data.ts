import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { DICT_TYPE } from '@vben/constants';
import { getDictOptions } from '@vben/hooks';
import { formatDate } from '@vben/utils';
import { $t } from '#/locales';

/** 表单配置 */
export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'id',
      component: 'Input',
      dependencies: {
        triggerFields: [''],
        show: () => false,
      },
    },
    {
      fieldName: 'name',
      label: $t('promotion.combination.activity.form.name'),
      component: 'Input',
      componentProps: {
        placeholder: $t('promotion.combination.activity.placeholder.name'),
      },
      rules: 'required',
      formItemClass: 'col-span-2',
    },
    {
      fieldName: 'startTime',
      label: $t('promotion.combination.activity.form.startTime'),
      component: 'DatePicker',
      componentProps: {
        placeholder: $t('promotion.combination.activity.placeholder.startTime'),
        showTime: true,
        valueFormat: 'x',
        format: 'YYYY-MM-DD HH:mm:ss',
      },
      rules: 'required',
    },
    {
      fieldName: 'endTime',
      label: $t('promotion.combination.activity.form.endTime'),
      component: 'DatePicker',
      componentProps: {
        placeholder: $t('promotion.combination.activity.placeholder.endTime'),
        showTime: true,
        valueFormat: 'x',
        format: 'YYYY-MM-DD HH:mm:ss',
      },
      rules: 'required',
    },
    {
      fieldName: 'userSize',
      label: $t('promotion.combination.activity.form.userSize'),
      component: 'InputNumber',
      componentProps: {
        placeholder: $t('promotion.combination.activity.placeholder.userSize'),
        min: 2,
      },
      rules: 'required',
    },
    {
      fieldName: 'limitDuration',
      label: $t('promotion.combination.activity.form.limitDuration'),
      component: 'InputNumber',
      componentProps: {
        placeholder: $t('promotion.combination.activity.placeholder.limitDuration'),
        min: 0,
      },
      rules: 'required',
    },
    {
      fieldName: 'totalLimitCount',
      label: $t('promotion.combination.activity.form.totalLimitCount'),
      component: 'InputNumber',
      componentProps: {
        placeholder: $t('promotion.combination.activity.placeholder.totalLimitCount'),
        min: 0,
      },
    },
    {
      fieldName: 'singleLimitCount',
      label: $t('promotion.combination.activity.form.singleLimitCount'),
      component: 'InputNumber',
      componentProps: {
        placeholder: $t('promotion.combination.activity.placeholder.singleLimitCount'),
        min: 0,
      },
    },
    {
      fieldName: 'virtualGroup',
      label: $t('promotion.combination.activity.form.virtualGroup'),
      component: 'RadioGroup',
      componentProps: {
        options: getDictOptions(DICT_TYPE.INFRA_BOOLEAN_STRING, 'boolean'),
      },
    },
    {
      fieldName: 'spuId',
      label: $t('promotion.combination.activity.form.spuId'),
      component: 'Input',
      rules: 'required',
      formItemClass: 'col-span-2',
    },
  ];
}

/** 列表的搜索表单 */
export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'name',
      label: $t('promotion.combination.activity.name'),
      component: 'Input',
      componentProps: {
        placeholder: $t('promotion.combination.activity.placeholder.name'),
        allowClear: true,
      },
    },
    {
      fieldName: 'status',
      label: $t('promotion.combination.activity.status'),
      component: 'Select',
      componentProps: {
        placeholder: $t('promotion.combination.activity.placeholder.status'),
        allowClear: true,
        options: getDictOptions(DICT_TYPE.COMMON_STATUS, 'number'),
      },
    },
  ];
}

/** 列表的字段 */
export function useGridColumns(): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'id',
      title: $t('promotion.combination.activity.grid.id'),
      minWidth: 80,
    },
    {
      field: 'name',
      title: $t('promotion.combination.activity.name'),
      minWidth: 140,
    },
    {
      field: 'activityTime',
      title: $t('promotion.combination.activity.grid.activityTime'),
      minWidth: 210,
      formatter: ({ row }) => {
        if (!row.startTime || !row.endTime) return '';
        return `${formatDate(row.startTime, 'YYYY-MM-DD')} ~ ${formatDate(row.endTime, 'YYYY-MM-DD')}`;
      },
    },
    {
      field: 'picUrl',
      title: $t('promotion.combination.activity.grid.picUrl'),
      minWidth: 80,
      cellRender: {
        name: 'CellImage',
        props: {
          height: 40,
          width: 40,
        },
      },
    },
    {
      field: 'spuName',
      title: $t('promotion.combination.activity.grid.spuName'),
      minWidth: 300,
    },
    {
      field: 'marketPrice',
      title: $t('promotion.combination.activity.grid.marketPrice'),
      minWidth: 100,
      formatter: ({ cellValue }) => {
        return `¥${(cellValue / 100).toFixed(2)}`;
      },
    },
    {
      field: 'combinationPrice',
      title: $t('promotion.combination.activity.grid.combinationPrice'),
      minWidth: 100,
      formatter: ({ row }) => {
        if (!row.products || row.products.length === 0) return '';
        const combinationPrice = Math.min(
          ...row.products.map((item: any) => item.combinationPrice),
        );
        return `¥${(combinationPrice / 100).toFixed(2)}`;
      },
    },
    {
      field: 'groupCount',
      title: $t('promotion.combination.activity.grid.groupCount'),
      minWidth: 100,
    },
    {
      field: 'groupSuccessCount',
      title: $t('promotion.combination.activity.grid.groupSuccessCount'),
      minWidth: 100,
    },
    {
      field: 'recordCount',
      title: $t('promotion.combination.activity.grid.recordCount'),
      minWidth: 100,
    },
    {
      field: 'status',
      title: $t('promotion.combination.activity.status'),
      minWidth: 100,
      cellRender: {
        name: 'CellDict',
        props: { type: DICT_TYPE.COMMON_STATUS },
      },
    },
    {
      field: 'createTime',
      title: $t('promotion.combination.activity.grid.createTime'),
      minWidth: 180,
      formatter: 'formatDateTime',
    },
    {
      title: $t('promotion.combination.activity.grid.actions'),
      width: 200,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}
