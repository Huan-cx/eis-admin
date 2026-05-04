import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { DICT_TYPE } from '@vben/constants';
import { getDictOptions } from '@vben/hooks';
import { formatDate } from '@vben/utils';

import { $t } from '#/locales';

/** 新增/修改的表单 */
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
      label: $t('promotion.bargain.activity.form.name'),
      component: 'Input',
      componentProps: {
        placeholder: $t('promotion.bargain.activity.placeholder.name'),
      },
      rules: 'required',
      formItemClass: 'col-span-2',
    },
    {
      fieldName: 'startTime',
      label: $t('promotion.bargain.activity.form.startTime'),
      component: 'DatePicker',
      componentProps: {
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
        showTime: true,
        placeholder: $t('promotion.bargain.activity.placeholder.startTime'),
      },
      rules: 'required',
    },
    {
      fieldName: 'endTime',
      label: $t('promotion.bargain.activity.form.endTime'),
      component: 'DatePicker',
      componentProps: {
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
        showTime: true,
        placeholder: $t('promotion.bargain.activity.placeholder.endTime'),
      },
      rules: 'required',
    },
    {
      fieldName: 'helpMaxCount',
      label: $t('promotion.bargain.activity.form.helpMaxCount'),
      component: 'InputNumber',
      componentProps: {
        min: 1,
        placeholder: $t('promotion.bargain.activity.placeholder.helpMaxCount'),
      },
      rules: 'required',
    },
    {
      fieldName: 'bargainCount',
      label: $t('promotion.bargain.activity.form.bargainCount'),
      component: 'InputNumber',
      componentProps: {
        min: 1,
        placeholder: $t('promotion.bargain.activity.placeholder.bargainCount'),
      },
      rules: 'required',
    },
    {
      fieldName: 'totalLimitCount',
      label: $t('promotion.bargain.activity.form.totalLimitCount'),
      component: 'InputNumber',
      componentProps: {
        min: 1,
        placeholder: $t(
          'promotion.bargain.activity.placeholder.totalLimitCount',
        ),
      },
      rules: 'required',
    },
    {
      fieldName: 'randomMinPrice',
      label: $t('promotion.bargain.activity.form.randomMinPrice'),
      component: 'InputNumber',
      componentProps: {
        min: 0,
        precision: 2,
        step: 0.01,
        placeholder: $t(
          'promotion.bargain.activity.placeholder.randomMinPrice',
        ),
      },
    },
    {
      fieldName: 'randomMaxPrice',
      label: $t('promotion.bargain.activity.form.randomMaxPrice'),
      component: 'InputNumber',
      componentProps: {
        min: 0,
        precision: 2,
        step: 0.01,
        placeholder: $t(
          'promotion.bargain.activity.placeholder.randomMaxPrice',
        ),
      },
    },
    {
      fieldName: 'spuId',
      label: $t('promotion.bargain.activity.form.spuId'),
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
      label: $t('promotion.bargain.activity.name'),
      component: 'Input',
      componentProps: {
        placeholder: $t('promotion.bargain.activity.placeholder.name'),
        allowClear: true,
      },
    },
    {
      fieldName: 'status',
      label: $t('promotion.bargain.activity.status'),
      component: 'Select',
      componentProps: {
        placeholder: $t('promotion.bargain.activity.placeholder.status'),
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
      title: $t('promotion.bargain.activity.grid.id'),
      minWidth: 80,
    },
    {
      field: 'name',
      title: $t('promotion.bargain.activity.grid.name'),
      minWidth: 140,
    },
    {
      field: 'activityTime',
      title: $t('promotion.bargain.activity.grid.activityTime'),
      minWidth: 210,
      formatter: ({ row }) => {
        if (!row.startTime || !row.endTime) return '';
        return `${formatDate(row.startTime, 'YYYY-MM-DD')} ~ ${formatDate(row.endTime, 'YYYY-MM-DD')}`;
      },
    },
    {
      field: 'picUrl',
      title: $t('promotion.bargain.activity.grid.picUrl'),
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
      title: $t('promotion.bargain.activity.grid.spuName'),
      minWidth: 300,
    },
    {
      field: 'bargainFirstPrice',
      title: $t('promotion.bargain.activity.grid.bargainFirstPrice'),
      minWidth: 100,
      formatter: 'formatAmount2',
    },
    {
      field: 'bargainMinPrice',
      title: $t('promotion.bargain.activity.grid.bargainMinPrice'),
      minWidth: 100,
      formatter: 'formatAmount2',
    },
    {
      field: 'recordUserCount',
      title: $t('promotion.bargain.activity.grid.recordUserCount'),
      minWidth: 100,
    },
    {
      field: 'recordSuccessUserCount',
      title: $t('promotion.bargain.activity.grid.recordSuccessUserCount'),
      minWidth: 110,
    },
    {
      field: 'helpUserCount',
      title: $t('promotion.bargain.activity.grid.helpUserCount'),
      minWidth: 100,
    },
    {
      field: 'status',
      title: $t('promotion.bargain.activity.grid.status'),
      minWidth: 100,
      cellRender: {
        name: 'CellDict',
        props: { type: DICT_TYPE.COMMON_STATUS },
      },
    },
    {
      field: 'stock',
      title: $t('promotion.bargain.activity.grid.stock'),
      minWidth: 80,
    },
    {
      field: 'totalStock',
      title: $t('promotion.bargain.activity.grid.totalStock'),
      minWidth: 80,
    },
    {
      field: 'createTime',
      title: $t('promotion.bargain.activity.grid.createTime'),
      width: 180,
      formatter: 'formatDateTime',
    },
    {
      title: $t('promotion.bargain.activity.grid.action'),
      width: 150,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}
