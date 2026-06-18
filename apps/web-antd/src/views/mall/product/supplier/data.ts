// D:\Workspace\Ruoyi\b2b_mall_star\yudao-ui-admin-vben\apps\web-antd\src\views\mall\product\supplier\data.ts
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
      label: '供应商名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入供应商名称',
      },
      rules: 'required',
    },
    {
      fieldName: 'category',
      label: '供应商类别',
      component: 'Select',
      componentProps: {
        options: [
          { label: '建筑材料', value: 'CONSTRUCTION_MATERIAL' },
          { label: '家电', value: 'ELECTRICAL' },
          { label: '家具', value: 'FURNITURE' },
          { label: '沙发', value: 'SOFA' },
          { label: '家居', value: 'HOUSEHOLD' },
        ],
        placeholder: '请选择供应商类别',
        allowClear: true,
      },
    },
    {
      fieldName: 'contactPerson',
      label: '联系人',
      component: 'Input',
      componentProps: {
        placeholder: '请输入联系人',
      },
    },
    {
      fieldName: 'contactPosition',
      label: '联系人职位',
      component: 'Input',
      componentProps: {
        placeholder: '请输入联系人职位',
      },
    },
    {
      fieldName: 'contactPhone',
      label: '联系电话',
      component: 'Input',
      componentProps: {
        placeholder: '请输入联系电话',
      },
    },
    {
      fieldName: 'contactEmail',
      label: '联系邮箱',
      component: 'Input',
      componentProps: {
        placeholder: '请输入联系邮箱',
      },
    },
    {
      fieldName: 'companyEmail',
      label: '公司邮箱',
      component: 'Input',
      componentProps: {
        placeholder: '请输入公司邮箱',
      },
    },
    {
      fieldName: 'address',
      label: '供应商地址',
      component: 'Input',
      componentProps: {
        placeholder: '请输入供应商地址',
      },
    },
    {
      fieldName: 'postalCode',
      label: '邮政编码',
      component: 'Input',
      componentProps: {
        placeholder: '请输入邮政编码',
      },
    },
    {
      fieldName: 'country',
      label: '国家',
      component: 'Input',
      componentProps: {
        placeholder: '请输入国家',
      },
    },
    {
      fieldName: 'province',
      label: '省份',
      component: 'Input',
      componentProps: {
        placeholder: '请输入省份',
      },
    },
    {
      fieldName: 'portOfLoading',
      label: '发货港口',
      component: 'Input',
      componentProps: {
        placeholder: '请输入发货港口',
      },
    },
    {
      fieldName: 'sort',
      label: '排序',
      component: 'InputNumber',
      componentProps: {
        min: 0,
        placeholder: '请输入排序',
      },
      rules: 'required',
    },
    {
      fieldName: 'status',
      label: '状态',
      component: 'RadioGroup',
      componentProps: {
        options: getDictOptions(DICT_TYPE.COMMON_STATUS, 'number'),
        buttonStyle: 'solid',
        optionType: 'button',
      },
      rules: z.number().default(CommonStatusEnum.ENABLE),
    },
    {
      fieldName: 'remark',
      label: '备注',
      component: 'Textarea',
      componentProps: {
        placeholder: '请输入备注',
      },
    },
  ];
}

/** 列表的搜索表单 */
export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'name',
      label: '供应商名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入供应商名称',
        allowClear: true,
      },
    },
    {
      fieldName: 'status',
      label: '状态',
      component: 'Select',
      componentProps: {
        options: getDictOptions(DICT_TYPE.COMMON_STATUS, 'number'),
        placeholder: '请选择状态',
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
      field: 'cufCode',
      title: '供应商编号',
      minWidth: 150,
    },
    {
      field: 'name',
      title: '供应商名称',
      minWidth: 180,
    },
    {
      field: 'category',
      title: '供应商类别',
      minWidth: 120,
    },
    {
      field: 'contactPerson',
      title: '联系人',
      minWidth: 100,
    },
    {
      field: 'contactPhone',
      title: '联系电话',
      minWidth: 130,
    },
    {
      field: 'country',
      title: '国家',
      minWidth: 100,
    },
    {
      field: 'province',
      title: '省份',
      minWidth: 100,
    },
    {
      field: 'sort',
      title: '排序',
      minWidth: 80,
    },
    {
      field: 'status',
      title: '状态',
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
