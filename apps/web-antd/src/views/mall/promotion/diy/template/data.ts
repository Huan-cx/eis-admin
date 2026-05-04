import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { DICT_TYPE } from '@vben/constants';

import { getRangePickerDefaultProps } from '#/utils';
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
      label: $t('promotion.diy.template.form.name'),
      component: 'Input',
      componentProps: {
        placeholder: $t('promotion.diy.template.placeholder.name'),
      },
      rules: 'required',
    },
    {
      fieldName: 'remark',
      label: $t('promotion.diy.template.form.remark'),
      component: 'Textarea',
      componentProps: {
        placeholder: $t('promotion.diy.template.placeholder.remark'),
        rows: 4,
      },
    },
    {
      fieldName: 'previewPicUrls',
      component: 'ImageUpload',
      label: $t('promotion.diy.template.form.previewPicUrls'),
      componentProps: {
        maxNumber: 10,
        multiple: true,
      },
    },
  ];
}

/** 列表的搜索表单 */
export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'name',
      label: $t('promotion.diy.template.form.name'),
      component: 'Input',
      componentProps: {
        placeholder: $t('promotion.diy.template.placeholder.name'),
        clearable: true,
      },
    },
    {
      fieldName: 'createTime',
      label: $t('promotion.diy.template.form.createTime'),
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
      title: $t('promotion.diy.template.grid.id'),
      minWidth: 80,
    },
    {
      field: 'previewPicUrls',
      title: $t('promotion.diy.template.form.previewPicUrls'),
      minWidth: 120,
      cellRender: {
        name: 'CellImages',
      },
    },
    {
      field: 'name',
      title: $t('promotion.diy.template.form.name'),
      minWidth: 150,
    },
    {
      field: 'used',
      title: $t('promotion.diy.template.grid.used'),
      minWidth: 100,
      cellRender: {
        name: 'CellDict',
        props: { type: DICT_TYPE.INFRA_BOOLEAN_STRING },
      },
    },
    {
      field: 'remark',
      title: $t('promotion.diy.template.form.remark'),
      minWidth: 200,
    },
    {
      field: 'createTime',
      title: $t('promotion.diy.template.form.createTime'),
      minWidth: 180,
      formatter: 'formatDateTime',
    },
    {
      title: $t('promotion.diy.template.grid.actions'),
      width: 250,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}
