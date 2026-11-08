import type { VxeTableGridOptions } from '@vben/plugins/vxe-table';

import type { VbenFormSchema } from '#/adapter/form';

import { CommonStatusEnum } from '@vben/constants';

import { z } from '#/adapter/form';
import { THEME_CUSTOMIZATION_TYPE } from '#/api/mall/promotion/theme';
import { getRangePickerDefaultProps } from '#/utils';

/** type 下拉选项（硬编码，因为没有对应字典；Banner 独立由 PromotionBanner 管理） */
const TYPE_OPTIONS = [
  {
    label: '商品轮播 product_carousel',
    value: THEME_CUSTOMIZATION_TYPE.PRODUCT_CAROUSEL,
  },
  {
    label: '分类轮播 category_carousel',
    value: THEME_CUSTOMIZATION_TYPE.CATEGORY_CAROUSEL,
  },
  {
    label: '静态内容 static_content (预留)',
    value: THEME_CUSTOMIZATION_TYPE.STATIC_CONTENT,
  },
];

/** 新增/修改的表单 schema */
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
      fieldName: 'pageCode',
      label: '页面编码',
      component: 'Input',
      defaultValue: 'home',
      componentProps: {
        placeholder: '默认 home',
      },
      rules: 'required',
    },
    {
      fieldName: 'themeCode',
      label: '主题编码',
      component: 'Input',
      defaultValue: 'default',
      componentProps: {
        placeholder: '默认 default',
      },
      rules: 'required',
    },
    {
      fieldName: 'type',
      label: '区块类型',
      component: 'Select',
      componentProps: {
        options: TYPE_OPTIONS,
        placeholder: '请选择区块类型',
      },
      rules: 'required',
      /** 创建后锁定类型，不允许修改 */
      dependencies: {
        triggerFields: ['id'],
        disabled: (values: Record<string, unknown>) => !!values.id,
      },
    },
    {
      fieldName: 'name',
      label: '区块名称',
      component: 'Input',
      componentProps: {
        placeholder: '运营可见的区块名称',
      },
      rules: 'required',
    },
    {
      fieldName: 'sort',
      label: '排序',
      component: 'InputNumber',
      componentProps: {
        min: 0,
        placeholder: '数值越小越靠前',
      },
      rules: 'required',
    },
    {
      fieldName: 'status',
      label: '状态',
      component: 'RadioGroup',
      componentProps: {
        options: [
          { label: '开启', value: CommonStatusEnum.ENABLE },
          { label: '关闭', value: CommonStatusEnum.DISABLE },
        ],
        buttonStyle: 'solid',
        optionType: 'button',
      },
      rules: z.number().default(CommonStatusEnum.ENABLE),
    },
    // 注意：config 字段已移除 VbenForm Textarea，改在 form.vue 里按 type 动态渲染可视化配置区。
    // 后端 Service 层 ThemeConfigSchema 会做强校验，不需要运营手写 JSON。
    {
      fieldName: 'remark',
      label: '备注',
      component: 'Textarea',
      componentProps: {
        rows: 3,
        placeholder: '内部备注',
      },
      formItemClass: 'col-span-2',
    },
  ];
}

/** 列表搜索表单 */
export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'pageCode',
      label: '页面',
      component: 'Input',
      componentProps: { placeholder: 'home' },
    },
    {
      fieldName: 'themeCode',
      label: '主题',
      component: 'Input',
      componentProps: { placeholder: 'default' },
    },
    {
      fieldName: 'type',
      label: '类型',
      component: 'Select',
      componentProps: {
        placeholder: '全部类型',
        clearable: true,
        options: TYPE_OPTIONS,
      },
    },
    {
      fieldName: 'name',
      label: '名称',
      component: 'Input',
      componentProps: { placeholder: '区块名称' },
    },
    {
      fieldName: 'status',
      label: '状态',
      component: 'Select',
      componentProps: {
        placeholder: '全部',
        clearable: true,
        options: [
          { label: '开启', value: CommonStatusEnum.ENABLE },
          { label: '关闭', value: CommonStatusEnum.DISABLE },
        ],
      },
    },
    {
      fieldName: 'createTime',
      label: '创建时间',
      component: 'RangePicker',
      componentProps: {
        ...getRangePickerDefaultProps(),
        allowClear: true,
      },
    },
  ];
}

/** 表格列 */
export function useGridColumns(): VxeTableGridOptions['columns'] {
  return [
    {
      title: 'ID',
      field: 'id',
      width: 80,
    },
    {
      title: '页面',
      field: 'pageCode',
      width: 90,
    },
    {
      title: '主题',
      field: 'themeCode',
      width: 90,
    },
    {
      title: '类型',
      field: 'type',
      minWidth: 160,
      cellRender: {
        name: 'CellText',
        props: {
          highlight: true,
        },
      },
    },
    {
      title: '区块名称',
      field: 'name',
      minWidth: 140,
    },
    {
      title: '排序',
      field: 'sort',
      width: 80,
      sortable: true,
    },
    {
      title: '状态',
      field: 'status',
      width: 80,
      cellRender: {
        name: 'CellTag',
        props: {
          type: 'success',
        },
      },
    },
    {
      title: '备注',
      field: 'remark',
      minWidth: 120,
      slots: { default: 'remark' },
    },
    {
      title: '创建时间',
      field: 'createTime',
      width: 180,
      formatter: 'formatDateTime',
    },
    {
      title: '操作',
      width: 180,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}
