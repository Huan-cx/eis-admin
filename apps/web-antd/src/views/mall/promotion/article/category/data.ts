import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { CommonStatusEnum, DICT_TYPE } from '@vben/constants';
import { getDictOptions } from '@vben/hooks';

import { z } from '#/adapter/form';
import { $t } from '#/locales';
import { getRangePickerDefaultProps } from '#/utils';

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
      fieldName: 'name',
      label: $t('promotion.article.category.form.name'),
      component: 'Input',
      componentProps: {
        placeholder: $t('promotion.article.category.placeholder.name'),
      },
      rules: 'required',
    },
    {
      fieldName: 'picUrl',
      label: $t('promotion.article.category.form.picUrl'),
      component: 'ImageUpload',
      componentProps: {
        placeholder: $t('promotion.article.category.placeholder.picUrl'),
      },
    },
    {
      fieldName: 'sort',
      label: $t('promotion.article.category.form.sort'),
      component: 'InputNumber',
      componentProps: {
        min: 0,
        placeholder: $t('promotion.article.category.placeholder.sort'),
      },
      rules: 'required',
    },
    {
      fieldName: 'status',
      label: $t('promotion.article.category.form.status'),
      component: 'RadioGroup',
      componentProps: {
        options: getDictOptions(DICT_TYPE.COMMON_STATUS, 'number'),
        buttonStyle: 'solid',
        optionType: 'button',
      },
      rules: z.number().default(CommonStatusEnum.ENABLE),
    },
  ];
}

/** 列表的搜索表单 */
export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'name',
      label: $t('promotion.article.category.form.name'),
      component: 'Input',
      componentProps: {
        placeholder: $t('promotion.article.category.placeholder.name'),
        allowClear: true,
      },
    },
    {
      fieldName: 'status',
      label: $t('promotion.article.category.form.status'),
      component: 'Select',
      componentProps: {
        placeholder: $t('promotion.article.category.placeholder.status'),
        allowClear: true,
        options: getDictOptions(DICT_TYPE.COMMON_STATUS, 'number'),
      },
    },
    {
      fieldName: 'createTime',
      label: $t('promotion.article.category.form.createTime'),
      component: 'RangePicker',
      componentProps: {
        ...getRangePickerDefaultProps(),
        allowClear: true,
      },
    },
  ];
}

/** 表格列配置 */
export function useGridColumns(): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'id',
      title: $t('promotion.article.category.grid.id'),
      minWidth: 100,
    },
    {
      field: 'name',
      title: $t('promotion.article.category.form.name'),
      minWidth: 240,
      align: 'left',
      fixed: 'left',
    },
    {
      field: 'picUrl',
      title: $t('promotion.article.category.form.picUrl'),
      minWidth: 80,
      cellRender: {
        name: 'CellImage',
      },
    },
    {
      field: 'status',
      title: $t('promotion.article.category.form.status'),
      minWidth: 150,
      cellRender: {
        name: 'CellDict',
        props: { type: DICT_TYPE.COMMON_STATUS },
      },
    },
    {
      field: 'sort',
      title: $t('promotion.article.category.form.sort'),
      minWidth: 150,
    },
    {
      field: 'createTime',
      title: $t('promotion.article.category.form.createTime'),
      minWidth: 180,
      formatter: 'formatDateTime',
    },
    {
      title: $t('promotion.article.category.grid.actions'),
      minWidth: 220,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}
