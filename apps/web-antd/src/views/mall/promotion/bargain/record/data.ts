import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { DICT_TYPE } from '@vben/constants';
import { getDictOptions } from '@vben/hooks';

import { getRangePickerDefaultProps } from '#/utils';
import { $t } from '#/locales';

/** 列表的搜索表单 */
export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'status',
      label: $t('promotion.bargain.record.form.status'),
      component: 'Select',
      componentProps: {
        placeholder: $t('promotion.bargain.record.placeholder.status'),
        allowClear: true,
        options: getDictOptions(
          DICT_TYPE.PROMOTION_BARGAIN_RECORD_STATUS,
          'number',
        ),
      },
    },
    {
      fieldName: 'createTime',
      label: $t('promotion.bargain.record.form.createTime'),
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
      field: 'id',
      title: $t('promotion.bargain.record.grid.id'),
      minWidth: 50,
    },
    {
      field: 'avatar',
      title: $t('promotion.bargain.record.grid.avatar'),
      minWidth: 120,
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
      title: $t('promotion.bargain.record.grid.nickname'),
      minWidth: 100,
    },
    {
      field: 'createTime',
      title: $t('promotion.bargain.record.grid.createTime'),
      width: 180,
      formatter: 'formatDateTime',
    },
    {
      field: 'activity.name',
      title: $t('promotion.bargain.record.grid.activityName'),
      minWidth: 150,
    },
    {
      field: 'activity.bargainMinPrice',
      title: $t('promotion.bargain.record.grid.bargainMinPrice'),
      minWidth: 100,
      formatter: 'formatAmount2',
    },
    {
      field: 'bargainPrice',
      title: $t('promotion.bargain.record.grid.bargainPrice'),
      minWidth: 100,
      formatter: 'formatAmount2',
    },
    {
      field: 'activity.helpMaxCount',
      title: $t('promotion.bargain.record.grid.helpMaxCount'),
      minWidth: 100,
    },
    {
      field: 'helpCount',
      title: $t('promotion.bargain.record.grid.helpCount'),
      minWidth: 100,
    },
    {
      field: 'status',
      title: $t('promotion.bargain.record.form.status'),
      minWidth: 100,
      cellRender: {
        name: 'CellDict',
        props: { type: DICT_TYPE.PROMOTION_BARGAIN_RECORD_STATUS },
      },
    },
    {
      field: 'endTime',
      title: $t('promotion.bargain.record.grid.endTime'),
      minWidth: 180,
      formatter: 'formatDateTime',
    },
    {
      field: 'orderId',
      title: $t('promotion.bargain.record.grid.orderId'),
      minWidth: 100,
    },
    {
      title: $t('promotion.bargain.record.grid.actions'),
      width: 100,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}

/** 助力列表表格列配置 */
export function useHelpGridColumns(): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'userId',
      title: $t('promotion.bargain.record.helpGrid.userId'),
      minWidth: 80,
    },
    {
      field: 'avatar',
      title: $t('promotion.bargain.record.helpGrid.avatar'),
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
      title: $t('promotion.bargain.record.helpGrid.nickname'),
      minWidth: 100,
    },
    {
      field: 'reducePrice',
      title: $t('promotion.bargain.record.helpGrid.reducePrice'),
      minWidth: 100,
      formatter: 'formatAmount2',
    },
    {
      field: 'createTime',
      title: $t('promotion.bargain.record.helpGrid.createTime'),
      width: 180,
      formatter: 'formatDateTime',
    },
  ];
}
