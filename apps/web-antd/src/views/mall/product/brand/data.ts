// D:\Workspace\Ruoyi\yudao-ui-admin-vben\apps\web-antd\src\views\mall\product\brand\data.ts
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
      label: $t('mall-product.brand.name'),
      component: 'Input',
      componentProps: {
        placeholder: $t('mall-product.brand.placeholder.name'),
      },
      rules: 'required',
    },
    {
      fieldName: 'picUrl',
      label: $t('mall-product.brand.picUrl'),
      component: 'ImageUpload',
      componentProps: {
        placeholder: $t('mall-product.brand.placeholder.picUrl'),
      },
      rules: 'required',
    },
    {
      fieldName: 'sort',
      label: $t('mall-product.brand.sort'),
      component: 'InputNumber',
      componentProps: {
        min: 0,
        placeholder: $t('mall-product.brand.placeholder.sort'),
      },
      rules: 'required',
    },
    {
      fieldName: 'status',
      label: $t('mall-product.brand.status'),
      component: 'RadioGroup',
      componentProps: {
        options: getDictOptions(DICT_TYPE.COMMON_STATUS, 'number'),
        buttonStyle: 'solid',
        optionType: 'button',
      },
      rules: z.number().default(CommonStatusEnum.ENABLE),
    },
    {
      fieldName: 'description',
      label: $t('mall-product.brand.description'),
      component: 'Textarea',
      componentProps: {
        placeholder: $t('mall-product.brand.placeholder.description'),
      },
    },
    // ========== SEO 相关字段 =========
    {
      fieldName: 'metaTitle',
      label: $t('mall-product.brand.metaTitle'),
      component: 'Input',
      componentProps: {
        placeholder: $t('mall-product.brand.placeholder.metaTitle'),
        maxlength: 200,
      },
    },
    {
      fieldName: 'metaDescription',
      label: $t('mall-product.brand.metaDescription'),
      component: 'Textarea',
      componentProps: {
        placeholder: $t('mall-product.brand.placeholder.metaDescription'),
        autoSize: { minRows: 2, maxRows: 3 },
        showCount: true,
        maxlength: 500,
      },
    },
    {
      fieldName: 'slug',
      label: $t('mall-product.brand.slug'),
      component: 'Input',
      componentProps: {
        placeholder: $t('mall-product.brand.placeholder.slug'),
        maxlength: 100,
      },
    },
  ];
}

/** 列表的搜索表单 */
export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'name',
      label: $t('mall-product.brand.name'),
      component: 'Input',
      componentProps: {
        placeholder: $t('mall-product.brand.placeholder.name'),
        allowClear: true,
      },
    },
    {
      fieldName: 'status',
      label: $t('mall-product.brand.status'),
      component: 'Select',
      componentProps: {
        options: getDictOptions(DICT_TYPE.COMMON_STATUS, 'number'),
        placeholder: $t('mall-product.brand.placeholder.status'),
        allowClear: true,
      },
    },
    {
      fieldName: 'createTime',
      label: $t('common.createTime'),
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
      field: 'name',
      title: $t('mall-product.brand.name'),
      minWidth: 180,
    },
    {
      field: 'picUrl',
      title: $t('mall-product.brand.picUrl'),
      minWidth: 120,
      cellRender: {
        name: 'CellImage',
      },
    },
    {
      field: 'sort',
      title: $t('mall-product.brand.sort'),
      minWidth: 100,
    },
    {
      field: 'status',
      title: $t('mall-product.brand.status'),
      minWidth: 100,
      cellRender: {
        name: 'CellDict',
        props: { type: DICT_TYPE.COMMON_STATUS },
      },
    },
    {
      field: 'createTime',
      title: $t('common.createTime'),
      minWidth: 180,
      formatter: 'formatDateTime',
    },
    {
      title: $t('common.actions'),
      width: 180,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}
