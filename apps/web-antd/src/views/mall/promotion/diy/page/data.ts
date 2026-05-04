import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

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
      label: $t('promotion.diy.page.form.name'),
      component: 'Input',
      componentProps: {
        placeholder: $t('promotion.diy.page.placeholder.name'),
      },
      rules: 'required',
    },
    {
      fieldName: 'remark',
      label: $t('promotion.diy.page.form.remark'),
      component: 'Textarea',
      componentProps: {
        placeholder: $t('promotion.diy.page.placeholder.remark'),
        rows: 4,
      },
    },
    {
      fieldName: 'previewPicUrls',
      component: 'ImageUpload',
      label: $t('promotion.diy.page.form.previewPicUrls'),
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
      label: $t('promotion.diy.page.form.name'),
      component: 'Input',
      componentProps: {
        placeholder: $t('promotion.diy.page.placeholder.name'),
        clearable: true,
      },
    },
    {
      fieldName: 'createTime',
      label: $t('promotion.diy.page.form.createTime'),
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
      title: $t('promotion.diy.page.grid.id'),
      minWidth: 80,
    },
    {
      field: 'previewPicUrls',
      title: $t('promotion.diy.page.form.previewPicUrls'),
      minWidth: 120,
      cellRender: {
        name: 'CellImages',
      },
    },
    {
      field: 'name',
      title: $t('promotion.diy.page.form.name'),
      minWidth: 150,
    },
    {
      field: 'remark',
      title: $t('promotion.diy.page.form.remark'),
      minWidth: 200,
    },
    {
      field: 'createTime',
      title: $t('promotion.diy.page.form.createTime'),
      minWidth: 180,
      formatter: 'formatDateTime',
    },
    {
      title: $t('promotion.diy.page.grid.actions'),
      width: 200,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}
