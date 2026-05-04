import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { getPropertySimpleList } from '#/api/mall/product/property';
import { $t } from '#/locales';
import { getRangePickerDefaultProps } from '#/utils';

// ============================== 属性 ==============================

/** 属性新增/修改的表单 */
export function usePropertyFormSchema(): VbenFormSchema[] {
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
      label: $t('mall-product.property.name'),
      component: 'Input',
      componentProps: {
        placeholder: $t('mall-product.property.placeholder.name'),
      },
      rules: 'required',
    },
    {
      fieldName: 'remark',
      label: $t('mall-product.property.remark'),
      component: 'Textarea',
      componentProps: {
        placeholder: $t('mall-product.property.placeholder.remark'),
      },
    },
  ];
}

/** 属性列表的搜索表单 */
export function usePropertyGridFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'name',
      label: $t('mall-product.property.name'),
      component: 'Input',
      componentProps: {
        placeholder: $t('mall-product.property.placeholder.name'),
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

/** 属性列表的字段 */
export function usePropertyGridColumns(): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'id',
      title: $t('mall-product.property.id'),
      minWidth: 100,
    },
    {
      field: 'name',
      title: $t('mall-product.property.name'),
      minWidth: 200,
    },
    {
      field: 'remark',
      title: $t('mall-product.property.remark'),
      minWidth: 180,
    },
    {
      field: 'createTime',
      title: $t('common.createTime'),
      minWidth: 180,
      formatter: 'formatDateTime',
    },
    {
      title: $t('common.actions'),
      minWidth: 120,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}

// ============================== 属性值 ==============================

/** 属性值新增/修改的表单 */
export function useValueFormSchema(): VbenFormSchema[] {
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
      fieldName: 'propertyId',
      label: $t('mall-product.property.property'),
      component: 'ApiSelect',
      componentProps: (values) => {
        return {
          api: getPropertySimpleList,
          placeholder: $t('mall-product.property.placeholder.property'),
          labelField: 'name',
          valueField: 'id',
          disabled: !!values.id,
        };
      },
      rules: 'required',
      dependencies: {
        triggerFields: [''],
      },
    },
    {
      fieldName: 'name',
      label: $t('mall-product.property.valueName'),
      component: 'Input',
      componentProps: {
        placeholder: $t('mall-product.property.placeholder.valueName'),
      },
      rules: 'required',
    },
    {
      fieldName: 'remark',
      label: $t('mall-product.property.remark'),
      component: 'Textarea',
      componentProps: {
        placeholder: $t('mall-product.property.placeholder.remark'),
      },
    },
  ];
}

/** 属性值列表搜索表单 */
export function useValueGridFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'propertyId',
      label: $t('mall-product.property.propertyItem'),
      component: 'ApiSelect',
      componentProps: {
        api: getPropertySimpleList,
        placeholder: $t('mall-product.property.placeholder.propertyItem'),
        labelField: 'name',
        valueField: 'id',
        disabled: true,
        allowClear: false,
      },
    },
    {
      fieldName: 'name',
      label: $t('mall-product.property.valueName'),
      component: 'Input',
      componentProps: {
        placeholder: $t('mall-product.property.placeholder.valueName'),
        allowClear: true,
      },
    },
  ];
}

/** 属性值表格列 */
export function useValueGridColumns(): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'id',
      title: $t('mall-product.property.valueId'),
      minWidth: 100,
    },
    {
      field: 'name',
      title: $t('mall-product.property.valueName'),
      minWidth: 180,
    },
    {
      field: 'remark',
      title: $t('mall-product.property.remark'),
      minWidth: 180,
    },
    {
      title: $t('common.createTime'),
      field: 'createTime',
      minWidth: 180,
      formatter: 'formatDateTime',
    },
    {
      title: $t('common.actions'),
      minWidth: 120,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}
