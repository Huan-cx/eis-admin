import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import {
  DICT_TYPE,
  PromotionConditionTypeEnum,
  PromotionProductScopeEnum,
} from '@vben/constants';
import { getDictOptions } from '@vben/hooks';
import { $t } from '@vben/locales';

import { z } from '#/adapter/form';
import { getRangePickerDefaultProps } from '#/utils';

/** 列表的搜索表单 */
export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'name',
      label: $t('promotion.rewardActivity.name'),
      component: 'Input',
      componentProps: {
        placeholder: $t('promotion.rewardActivity.placeholder.name'),
        allowClear: true,
      },
    },
    {
      fieldName: 'status',
      label: $t('promotion.rewardActivity.status'),
      component: 'Select',
      componentProps: {
        options: getDictOptions(DICT_TYPE.COMMON_STATUS, 'number'),
        placeholder: $t('promotion.rewardActivity.placeholder.status'),
        allowClear: true,
      },
    },
    {
      fieldName: 'createTime',
      label: $t('promotion.rewardActivity.form.startAndEndTime'),
      component: 'RangePicker',
      componentProps: {
        ...getRangePickerDefaultProps(),
        allowClear: true,
      },
    },
  ];
}

/** 列表的表格列 */
export function useGridColumns(): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'name',
      title: $t('promotion.rewardActivity.name'),
      minWidth: 200,
    },
    {
      field: 'productScope',
      title: $t('promotion.rewardActivity.grid.productScope'),
      minWidth: 120,
      cellRender: {
        name: 'CellDict',
        props: { type: DICT_TYPE.PROMOTION_PRODUCT_SCOPE },
      },
    },
    {
      field: 'startTime',
      title: $t('promotion.rewardActivity.grid.startTime'),
      minWidth: 180,
      formatter: 'formatDateTime',
    },
    {
      field: 'endTime',
      title: $t('promotion.rewardActivity.grid.endTime'),
      minWidth: 180,
      formatter: 'formatDateTime',
    },
    {
      field: 'status',
      title: $t('promotion.rewardActivity.status'),
      minWidth: 100,
      cellRender: {
        name: 'CellDict',
        props: { type: DICT_TYPE.COMMON_STATUS },
      },
    },
    {
      field: 'createTime',
      title: $t('promotion.rewardActivity.grid.createTime'),
      minWidth: 180,
      formatter: 'formatDateTime',
    },
    {
      title: $t('promotion.rewardActivity.grid.actions'),
      width: 200,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}

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
      label: $t('promotion.rewardActivity.name'),
      component: 'Input',
      rules: 'required',
      componentProps: {
        placeholder: $t('promotion.rewardActivity.placeholder.name'),
        allowClear: true,
      },
    },
    {
      fieldName: 'remark',
      label: $t('promotion.rewardActivity.form.remark'),
      component: 'Textarea',
      componentProps: {
        placeholder: $t('promotion.rewardActivity.placeholder.remark'),
        rows: 4,
        allowClear: true,
      },
    },
    {
      fieldName: 'startAndEndTime',
      label: $t('promotion.rewardActivity.form.startAndEndTime'),
      component: 'RangePicker',
      rules: 'required',
      componentProps: {
        showTime: true,
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'x',
        placeholder: [
          $t('utils.rangePicker.beginTime'),
          $t('utils.rangePicker.endTime'),
        ],
      },
    },
    {
      fieldName: 'conditionType',
      label: $t('promotion.rewardActivity.form.conditionType'),
      component: 'RadioGroup',
      componentProps: {
        options: getDictOptions(DICT_TYPE.PROMOTION_CONDITION_TYPE, 'number'),
        buttonStyle: 'solid',
        optionType: 'button',
      },
      rules: z.number().default(PromotionConditionTypeEnum.PRICE.type),
    },
    {
      fieldName: 'productScope',
      label: $t('promotion.rewardActivity.form.productScope'),
      component: 'RadioGroup',
      componentProps: {
        options: getDictOptions(DICT_TYPE.PROMOTION_PRODUCT_SCOPE, 'number'),
        buttonStyle: 'solid',
        optionType: 'button',
      },
      rules: z.number().default(PromotionProductScopeEnum.ALL.scope),
    },
    {
      fieldName: 'productSpuIds',
      label: $t('promotion.rewardActivity.form.productSpuIds'),
      component: 'Input',
      dependencies: {
        triggerFields: ['productScope', 'productScopeValues'],
        show: (values) => {
          return values.productScope === PromotionProductScopeEnum.SPU.scope;
        },
        trigger(values, form) {
          // 当加载已有数据时，根据 productScopeValues 设置 productSpuIds
          if (
            values.productScope === PromotionProductScopeEnum.SPU.scope &&
            values.productScopeValues
          ) {
            form.setFieldValue('productSpuIds', values.productScopeValues);
          }
        },
      },
      rules: 'required',
    },
    {
      fieldName: 'productCategoryIds',
      label: $t('promotion.rewardActivity.form.productCategoryIds'),
      component: 'Input',
      dependencies: {
        triggerFields: ['productScope', 'productScopeValues'],
        show: (values) => {
          return (
            values.productScope === PromotionProductScopeEnum.CATEGORY.scope
          );
        },
        trigger(values, form) {
          // 当加载已有数据时，根据 productScopeValues 设置 productCategoryIds
          if (
            values.productScope === PromotionProductScopeEnum.CATEGORY.scope &&
            values.productScopeValues
          ) {
            const categoryIds = values.productScopeValues;
            // 单选时使用数组不能反显，取第一个元素
            form.setFieldValue(
              'productCategoryIds',
              Array.isArray(categoryIds) && categoryIds.length > 0
                ? categoryIds[0]
                : categoryIds,
            );
          }
        },
      },
      rules: 'required',
    },
    {
      fieldName: 'rules',
      label: $t('promotion.rewardActivity.form.rules'),
      component: 'Input',
      formItemClass: 'items-start',
      rules: z
        .array(z.any())
        .min(1, { message: $t('promotion.rewardActivity.placeholder.rules') })
        .default([]),
    },
    {
      fieldName: 'productScopeValues', // 隐藏字段：用于自动同步 productScopeValues
      component: 'Input',
      dependencies: {
        triggerFields: ['productScope', 'productSpuIds', 'productCategoryIds'],
        show: () => false,
        trigger(values, form) {
          switch (values.productScope) {
            case PromotionProductScopeEnum.CATEGORY.scope: {
              const categoryIds = Array.isArray(values.productCategoryIds)
                ? values.productCategoryIds
                : [values.productCategoryIds];
              form.setFieldValue('productScopeValues', categoryIds);
              break;
            }
            case PromotionProductScopeEnum.SPU.scope: {
              form.setFieldValue('productScopeValues', values.productSpuIds);
              break;
            }
          }
        },
      },
    },
  ];
}
