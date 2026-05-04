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
      label: $t('promotion.discountActivity.name'),
      component: 'Input',
      componentProps: {
        placeholder: $t('promotion.discountActivity.placeholder.name'),
      },
      rules: 'required',
    },
    {
      fieldName: 'status',
      label: $t('promotion.discountActivity.status'),
      component: 'Select',
      componentProps: {
        placeholder: $t('promotion.discountActivity.placeholder.status'),
        options: getDictOptions(DICT_TYPE.COMMON_STATUS, 'number'),
      },
      rules: 'required',
    },
    {
      fieldName: 'startTime',
      label: $t('promotion.discountActivity.form.startTime'),
      component: 'DatePicker',
      componentProps: {
        placeholder: $t('promotion.discountActivity.placeholder.startTime'),
        showTime: false,
        valueFormat: 'x',
        format: 'YYYY-MM-DD',
      },
      rules: 'required',
    },
    {
      fieldName: 'endTime',
      label: $t('promotion.discountActivity.form.endTime'),
      component: 'DatePicker',
      componentProps: {
        placeholder: $t('promotion.discountActivity.placeholder.endTime'),
        showTime: false,
        valueFormat: 'x',
        format: 'YYYY-MM-DD',
      },
      rules: 'required',
    },
    {
      fieldName: 'remark',
      label: $t('promotion.discountActivity.form.remark'),
      component: 'Textarea',
      componentProps: {
        placeholder: $t('promotion.discountActivity.placeholder.remark'),
        rows: 4,
      },
      formItemClass: 'col-span-2',
    },
    {
      fieldName: 'spuIds',
      label: $t('promotion.discountActivity.form.spuIds'),
      component: 'Input',
      formItemClass: 'col-span-2',
    },
  ];
}

/** 列表的搜索表单 */
export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'name',
      label: $t('promotion.discountActivity.name'),
      component: 'Input',
      componentProps: {
        placeholder: $t('promotion.discountActivity.placeholder.name'),
        allowClear: true,
      },
    },
    {
      fieldName: 'status',
      label: $t('promotion.discountActivity.status'),
      component: 'Select',
      componentProps: {
        placeholder: $t('promotion.discountActivity.placeholder.status'),
        allowClear: true,
        options: getDictOptions(DICT_TYPE.COMMON_STATUS, 'number'),
      },
    },
    {
      fieldName: 'activeTime',
      label: $t('promotion.discountActivity.form.activeTime'),
      component: 'RangePicker',
      componentProps: {
        placeholder: [
          $t('promotion.discountActivity.placeholder.startTime'),
          $t('promotion.discountActivity.placeholder.endTime'),
        ],
        allowClear: true,
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
      },
    },
  ];
}

/** 列表的字段 */
export function useGridColumns(): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'id',
      title: $t('promotion.discountActivity.grid.id'),
      minWidth: 80,
    },
    {
      field: 'name',
      title: $t('promotion.discountActivity.name'),
      minWidth: 140,
    },
    {
      field: 'activityTime',
      title: $t('promotion.discountActivity.form.activeTime'),
      minWidth: 210,
      formatter: ({ row }) => {
        if (!row.startTime || !row.endTime) return '';
        return `${formatDate(row.startTime, 'YYYY-MM-DD')} ~ ${formatDate(row.endTime, 'YYYY-MM-DD')}`;
      },
    },
    {
      field: 'status',
      title: $t('promotion.discountActivity.status'),
      minWidth: 100,
      cellRender: {
        name: 'CellDict',
        props: { type: DICT_TYPE.COMMON_STATUS },
      },
    },
    {
      field: 'remark',
      title: $t('promotion.discountActivity.form.remark'),
      minWidth: 200,
    },
    {
      field: 'createTime',
      title: $t('promotion.discountActivity.grid.createTime'),
      minWidth: 180,
      formatter: 'formatDateTime',
    },
    {
      title: $t('promotion.discountActivity.grid.actions'),
      width: 150,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}
