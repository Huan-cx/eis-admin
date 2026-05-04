import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { MallCouponTemplateApi } from '#/api/mall/promotion/coupon/couponTemplate';

import {
  CommonStatusEnum,
  CouponTemplateTakeTypeEnum,
  CouponTemplateValidityTypeEnum,
  DICT_TYPE,
  PromotionDiscountTypeEnum,
  PromotionProductScopeEnum,
} from '@vben/constants';
import { getDictOptions } from '@vben/hooks';

import { getRangePickerDefaultProps } from '#/utils';
import { $t } from '#/locales';

import {
  discountFormat,
  remainedCountFormat,
  takeLimitCountFormat,
  totalCountFormat,
  validityTypeFormat,
} from '../formatter';

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
      label: $t('promotion.coupon.template.name'),
      component: 'Input',
      componentProps: {
        placeholder: $t('promotion.coupon.template.placeholder.name'),
      },
      rules: 'required',
    },
    {
      fieldName: 'description',
      label: $t('promotion.coupon.template.description'),
      component: 'Textarea',
      componentProps: {
        placeholder: $t('promotion.coupon.template.placeholder.description'),
      },
    },
    {
      fieldName: 'productScope',
      label: $t('promotion.coupon.template.productScope'),
      component: 'RadioGroup',
      componentProps: {
        options: getDictOptions(DICT_TYPE.PROMOTION_PRODUCT_SCOPE, 'number'),
      },
      rules: 'required',
      defaultValue: PromotionProductScopeEnum.ALL.scope,
    },
    {
      fieldName: 'productSpuIds',
      label: $t('promotion.coupon.template.product'),
      component: 'Input',
      dependencies: {
        triggerFields: ['productScope', 'productScopeValues'],
        show: (model) =>
          model.productScope === PromotionProductScopeEnum.SPU.scope,
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
      label: $t('promotion.coupon.template.category'),
      component: 'Input',
      dependencies: {
        triggerFields: ['productScope', 'productScopeValues'],
        show: (model) =>
          model.productScope === PromotionProductScopeEnum.CATEGORY.scope,
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
      fieldName: 'discountType',
      label: $t('promotion.coupon.template.discountType'),
      component: 'RadioGroup',
      componentProps: {
        options: getDictOptions(DICT_TYPE.PROMOTION_DISCOUNT_TYPE, 'number'),
      },
      rules: 'required',
      defaultValue: PromotionDiscountTypeEnum.PRICE.type,
    },
    {
      fieldName: 'discountPrice',
      label: $t('promotion.coupon.template.discountPrice'),
      component: 'InputNumber',
      componentProps: {
        min: 0,
        precision: 2,
        placeholder: $t('promotion.coupon.template.placeholder.discountPrice'),
        addonAfter: $t('promotion.coupon.template.unit.yuan'),
      },
      dependencies: {
        triggerFields: ['discountType'],
        show: (model) =>
          model.discountType === PromotionDiscountTypeEnum.PRICE.type,
      },
      rules: 'required',
    },
    {
      fieldName: 'discountPercent',
      label: $t('promotion.coupon.template.discountPercent'),
      component: 'InputNumber',
      componentProps: {
        min: 1,
        max: 9.9,
        precision: 1,
        placeholder: $t('promotion.coupon.template.placeholder.discountPercent'),
        addonAfter: $t('promotion.coupon.template.unit.percent'),
      },
      dependencies: {
        triggerFields: ['discountType'],
        show: (model) =>
          model.discountType === PromotionDiscountTypeEnum.PERCENT.type,
      },
      rules: 'required',
    },
    {
      fieldName: 'discountLimitPrice',
      label: $t('promotion.coupon.template.discountLimitPrice'),
      component: 'InputNumber',
      componentProps: {
        min: 0,
        precision: 2,
        placeholder: $t('promotion.coupon.template.placeholder.discountLimitPrice'),
        addonAfter: $t('promotion.coupon.template.unit.yuan'),
      },
      dependencies: {
        triggerFields: ['discountType'],
        show: (model) =>
          model.discountType === PromotionDiscountTypeEnum.PERCENT.type,
      },
      rules: 'required',
    },
    {
      fieldName: 'usePrice',
      label: $t('promotion.coupon.template.usePrice'),
      component: 'InputNumber',
      componentProps: {
        min: 0,
        precision: 2,
        placeholder: $t('promotion.coupon.template.placeholder.usePrice'),
        addonAfter: $t('promotion.coupon.template.unit.yuan'),
      },
      rules: 'required',
    },
    {
      fieldName: 'takeType',
      label: $t('promotion.coupon.template.takeType'),
      component: 'RadioGroup',
      componentProps: {
        options: getDictOptions(DICT_TYPE.PROMOTION_COUPON_TAKE_TYPE, 'number'),
      },
      rules: 'required',
      defaultValue: CouponTemplateTakeTypeEnum.USER.type,
    },
    {
      fieldName: 'totalCount',
      label: $t('promotion.coupon.template.totalCount'),
      component: 'InputNumber',
      componentProps: {
        min: -1,
        placeholder: $t('promotion.coupon.template.placeholder.totalCount'),
        addonAfter: $t('promotion.coupon.template.unit.count'),
      },
      dependencies: {
        triggerFields: ['takeType'],
        show: (model) =>
          model.takeType === CouponTemplateTakeTypeEnum.USER.type,
      },
      rules: 'required',
    },
    {
      fieldName: 'takeLimitCount',
      label: $t('promotion.coupon.template.takeLimitCount'),
      component: 'InputNumber',
      componentProps: {
        min: -1,
        placeholder: $t('promotion.coupon.template.placeholder.takeLimitCount'),
        addonAfter: $t('promotion.coupon.template.unit.count'),
      },
      dependencies: {
        triggerFields: ['takeType'],
        show: (model) => model.takeType === 1,
      },
      rules: 'required',
    },
    {
      fieldName: 'validityType',
      label: $t('promotion.coupon.template.validityType'),
      component: 'RadioGroup',
      componentProps: {
        options: getDictOptions(
          DICT_TYPE.PROMOTION_COUPON_TEMPLATE_VALIDITY_TYPE,
          'number',
        ),
      },
      defaultValue: CouponTemplateValidityTypeEnum.DATE.type,
      rules: 'required',
    },
    {
      fieldName: 'validTimes',
      label: $t('promotion.coupon.template.validTimes'),
      component: 'RangePicker',
      componentProps: {
        ...getRangePickerDefaultProps(),
        valueFormat: 'x',
      },
      dependencies: {
        triggerFields: ['validityType'],
        show: (model) =>
          model.validityType === CouponTemplateValidityTypeEnum.DATE.type,
      },
      rules: 'required',
    },
    {
      fieldName: 'fixedStartTerm',
      label: $t('promotion.coupon.template.fixedStartTerm'),
      component: 'InputNumber',
      componentProps: {
        min: 0,
        placeholder: $t('promotion.coupon.template.placeholder.fixedStartTerm'),
        addonBefore: $t('promotion.coupon.template.unit.dayStart'),
        addonAfter: $t('promotion.coupon.template.unit.day'),
      },
      dependencies: {
        triggerFields: ['validityType'],
        show: (model) =>
          model.validityType === CouponTemplateValidityTypeEnum.TERM.type,
      },
      rules: 'required',
    },
    {
      fieldName: 'fixedEndTerm',
      component: 'InputNumber',
      componentProps: {
        min: 0,
        placeholder: $t('promotion.coupon.template.placeholder.fixedEndTerm'),
        addonBefore: $t('promotion.coupon.template.unit.to'),
        addonAfter: $t('promotion.coupon.template.unit.dayValid'),
      },
      dependencies: {
        triggerFields: ['validityType'],
        show: (model) =>
          model.validityType === CouponTemplateValidityTypeEnum.TERM.type,
      },
      rules: 'required',
    },
    {
      fieldName: 'productScopeValues',
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

/** 列表的搜索表单 */
export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'name',
      label: $t('promotion.coupon.template.name'),
      component: 'Input',
      componentProps: {
        placeholder: $t('promotion.coupon.template.placeholder.searchName'),
        allowClear: true,
      },
    },
    {
      fieldName: 'discountType',
      label: $t('promotion.coupon.template.discountType'),
      component: 'Select',
      componentProps: {
        placeholder: $t('promotion.coupon.template.placeholder.discountType'),
        allowClear: true,
        options: getDictOptions(DICT_TYPE.PROMOTION_DISCOUNT_TYPE, 'number'),
      },
    },
    {
      fieldName: 'status',
      label: $t('promotion.coupon.template.status'),
      component: 'Select',
      componentProps: {
        placeholder: $t('promotion.coupon.template.placeholder.status'),
        allowClear: true,
        options: getDictOptions(DICT_TYPE.COMMON_STATUS, 'number'),
      },
    },
    {
      fieldName: 'createTime',
      label: $t('promotion.coupon.template.createTime'),
      component: 'RangePicker',
      componentProps: {
        ...getRangePickerDefaultProps(),
        allowClear: true,
      },
    },
  ];
}

/** 列表的字段 */
export function useGridColumns(
  onStatusChange?: (
    newStatus: number,
    row: MallCouponTemplateApi.CouponTemplate,
  ) => PromiseLike<boolean | undefined>,
): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'name',
      title: $t('promotion.coupon.template.name'),
      minWidth: 140,
    },
    {
      field: 'productScope',
      title: $t('promotion.coupon.template.grid.productScope'),
      minWidth: 130,
      cellRender: {
        name: 'CellDict',
        props: { type: DICT_TYPE.PROMOTION_PRODUCT_SCOPE },
      },
    },
    {
      field: 'discountType',
      title: $t('promotion.coupon.template.grid.discount'),
      minWidth: 110,
      cellRender: {
        name: 'CellDict',
        props: { type: DICT_TYPE.PROMOTION_DISCOUNT_TYPE },
      },
    },
    {
      field: 'discountPrice',
      title: $t('promotion.coupon.template.grid.discountLevel'),
      minWidth: 110,
      formatter: ({ row }) => {
        return discountFormat(row);
      },
    },
    {
      field: 'takeType',
      title: $t('promotion.coupon.template.takeType'),
      minWidth: 100,
      cellRender: {
        name: 'CellDict',
        props: { type: DICT_TYPE.PROMOTION_COUPON_TAKE_TYPE },
      },
    },
    {
      field: 'validityType',
      title: $t('promotion.coupon.template.grid.validTime'),
      minWidth: 180,
      formatter: ({ row }) => {
        return validityTypeFormat(row);
      },
    },
    {
      field: 'totalCount',
      title: $t('promotion.coupon.template.totalCount'),
      minWidth: 100,
      formatter: ({ row }) => {
        return totalCountFormat(row);
      },
    },
    {
      field: 'remainedCount',
      title: $t('promotion.coupon.template.grid.remainedCount'),
      minWidth: 100,
      formatter: ({ row }) => {
        return remainedCountFormat(row);
      },
    },
    {
      field: 'takeLimitCount',
      title: $t('promotion.coupon.template.grid.takeLimitCount'),
      minWidth: 100,
      formatter: ({ row }) => {
        return takeLimitCountFormat(row);
      },
    },
    {
      field: 'status',
      title: $t('promotion.coupon.template.status'),
      minWidth: 100,
      align: 'center',
      cellRender: {
        attrs: { beforeChange: onStatusChange },
        name: 'CellSwitch',
        props: {
          checkedValue: CommonStatusEnum.ENABLE,
          unCheckedValue: CommonStatusEnum.DISABLE,
        },
      },
    },
    {
      field: 'createTime',
      title: $t('promotion.coupon.template.createTime'),
      minWidth: 180,
      formatter: 'formatDateTime',
    },
    {
      title: $t('promotion.coupon.template.grid.actions'),
      width: 120,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}
