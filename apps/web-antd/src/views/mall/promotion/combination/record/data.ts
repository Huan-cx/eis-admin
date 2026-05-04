import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { DICT_TYPE } from '@vben/constants';
import { getDictOptions } from '@vben/hooks';
import { $t } from '#/locales';

/** 列表的搜索表单 */
export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'status',
      label: $t('promotion.combination.record.form.status'),
      component: 'Select',
      componentProps: {
        placeholder: $t('promotion.combination.record.placeholder.status'),
        allowClear: true,
        options: getDictOptions(DICT_TYPE.COMMON_STATUS, 'number'),
      },
    },
    {
      fieldName: 'createTime',
      label: $t('promotion.combination.record.form.createTime'),
      component: 'RangePicker',
      componentProps: {
        placeholder: [
          $t('promotion.combination.record.placeholder.startTime'),
          $t('promotion.combination.record.placeholder.endTime'),
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
      title: $t('promotion.combination.record.grid.id'),
      minWidth: 80,
    },
    {
      field: 'avatar',
      title: $t('promotion.combination.record.grid.avatar'),
      minWidth: 80,
      cellRender: {
        name: 'CellImage',
        props: {
          height: 40,
          width: 40,
          shape: 'circle',
        },
      },
    },
    {
      field: 'nickname',
      title: $t('promotion.combination.record.grid.nickname'),
      minWidth: 100,
    },
    {
      field: 'headId',
      title: $t('promotion.combination.record.grid.headId'),
      minWidth: 100,
    },
    {
      field: 'picUrl',
      title: $t('promotion.combination.record.grid.picUrl'),
      minWidth: 80,
      cellRender: {
        name: 'CellImage',
      },
    },
    {
      field: 'spuName',
      title: $t('promotion.combination.record.grid.spuName'),
      minWidth: 120,
    },
    {
      field: 'activityName',
      title: $t('promotion.combination.record.grid.activityName'),
      minWidth: 140,
    },
    {
      field: 'userSize',
      title: $t('promotion.combination.record.grid.userSize'),
      minWidth: 80,
    },
    {
      field: 'userCount',
      title: $t('promotion.combination.record.grid.userCount'),
      minWidth: 80,
    },
    {
      field: 'createTime',
      title: $t('promotion.combination.record.grid.createTime'),
      minWidth: 180,
      formatter: 'formatDateTime',
    },
    {
      field: 'endTime',
      title: $t('promotion.combination.record.grid.endTime'),
      minWidth: 180,
      formatter: 'formatDateTime',
    },
    {
      field: 'status',
      title: $t('promotion.combination.record.form.status'),
      minWidth: 100,
      cellRender: {
        name: 'CellDict',
        props: { type: DICT_TYPE.COMMON_STATUS },
      },
    },
    {
      title: $t('promotion.combination.record.grid.actions'),
      width: 100,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}

/** 用户列表表格列配置 */
export function useUserGridColumns(): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'id',
      title: $t('promotion.combination.record.userGrid.id'),
      minWidth: 80,
    },
    {
      field: 'avatar',
      title: $t('promotion.combination.record.userGrid.avatar'),
      minWidth: 80,
      cellRender: {
        name: 'CellImage',
        props: {
          height: 40,
          width: 40,
          shape: 'circle',
        },
      },
    },
    {
      field: 'nickname',
      title: $t('promotion.combination.record.userGrid.nickname'),
      minWidth: 100,
    },
    {
      field: 'headId',
      title: $t('promotion.combination.record.userGrid.headId'),
      minWidth: 100,
      formatter: ({ cellValue }) => {
        return cellValue === 0
          ? $t('promotion.combination.record.userGrid.head')
          : $t('promotion.combination.record.userGrid.member');
      },
    },
    {
      field: 'createTime',
      title: $t('promotion.combination.record.userGrid.createTime'),
      minWidth: 180,
      formatter: 'formatDateTime',
    },
    {
      field: 'endTime',
      title: $t('promotion.combination.record.userGrid.endTime'),
      minWidth: 180,
      formatter: 'formatDateTime',
    },
    {
      field: 'status',
      title: $t('promotion.combination.record.form.status'),
      minWidth: 100,
      cellRender: {
        name: 'CellDict',
        props: { type: DICT_TYPE.COMMON_STATUS },
      },
    },
  ];
}
