import type { VbenFormSchema } from '#/adapter/form';

import { DICT_TYPE } from '@vben/constants';
import { getDictOptions } from '@vben/hooks';
import { handleTree } from '@vben/utils';

import { getSimpleBrandList } from '#/api/mall/product/brand';
import { getCategoryList } from '#/api/mall/product/category';
import { getSimpleSupplierList } from '#/api/mall/product/supplier';
import { getSimpleTemplateList } from '#/api/mall/trade/delivery/expressTemplate';
import { $t } from '#/locales';

/** 基础设置的表单 */
export function useInfoFormSchema(): VbenFormSchema[] {
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
      label: $t('mall-product.spu.form.name'),
      component: 'Input',
      componentProps: {
        allowClear: true,
        placeholder: $t('mall-product.spu.placeholder.name'),
      },
      rules: 'required',
    },
    {
      fieldName: 'categoryId',
      label: $t('mall-product.spu.form.categoryName'),
      component: 'ApiTreeSelect',
      componentProps: {
        api: async () => {
          const data = await getCategoryList({});
          return handleTree(data);
        },
        fieldNames: { label: 'name', value: 'id', children: 'children' },
        placeholder: $t('mall-product.spu.placeholder.category'),
      },
      rules: 'required',
    },
    {
      fieldName: 'brandId',
      label: $t('mall-product.spu.form.brand'),
      component: 'ApiSelect',
      componentProps: {
        api: getSimpleBrandList,
        labelField: 'name',
        valueField: 'id',
        allowClear: true,
        placeholder: $t('mall-product.spu.placeholder.brand'),
      },
      rules: 'required',
    },
    {
      fieldName: 'supplierIds',
      label: $t('mall-product.spu.form.supplier'),
      component: 'ApiSelect',
      componentProps: {
        api: getSimpleSupplierList,
        labelField: 'name',
        valueField: 'id',
        mode: 'multiple',
        allowClear: true,
        placeholder: $t('mall-product.spu.placeholder.supplier'),
      },
    },
    {
      fieldName: 'keyword',
      label: $t('mall-product.spu.form.keyword'),
      component: 'Input',
      componentProps: {
        placeholder: $t('mall-product.spu.placeholder.keyword'),
      },
      rules: 'required',
    },
    {
      fieldName: 'introduction',
      label: $t('mall-product.spu.form.introduction'),
      component: 'Textarea',
      componentProps: {
        placeholder: $t('mall-product.spu.placeholder.introduction'),
        autoSize: { minRows: 2, maxRows: 2 },
        showCount: true,
        maxlength: 128,
        allowClear: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'picUrl',
      label: $t('mall-product.spu.form.picUrl'),
      component: 'ImageUpload',
      componentProps: {
        maxSize: 30,
      },
      rules: 'required',
    },
    {
      fieldName: 'sliderPicUrls',
      label: $t('mall-product.spu.form.sliderPicUrls'),
      component: 'ImageUpload',
      componentProps: {
        maxNumber: 10,
        multiple: true,
        maxSize: 30,
      },
      rules: 'required',
    },
  ];
}

/** 配送设置的表单 */
export function useDeliveryFormSchema(): VbenFormSchema[] {
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
      fieldName: 'deliveryTypes',
      label: $t('mall-product.spu.form.deliveryType'),
      component: 'CheckboxGroup',
      componentProps: {
        options: getDictOptions(DICT_TYPE.TRADE_DELIVERY_TYPE, 'number'),
      },
      rules: 'required',
    },
    {
      fieldName: 'deliveryTemplateId',
      label: $t('mall-product.spu.form.deliveryTemplate'),
      component: 'ApiSelect',
      componentProps: {
        api: getSimpleTemplateList,
        labelField: 'name',
        valueField: 'id',
        placeholder: $t('mall-product.spu.placeholder.deliveryTemplate'),
      },
      rules: 'required',
    },
  ];
}

/** 商品详情的表单 */
export function useDescriptionFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'description',
      label: $t('mall-product.spu.form.description'),
      component: 'RichTextarea',
      componentProps: {
        placeholder: $t('mall-product.spu.placeholder.description'),
      },
      rules: 'required',
    },
  ];
}

/** 其他设置的表单 */
export function useOtherFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'sort',
      label: $t('mall-product.spu.form.sort'),
      component: 'InputNumber',
      componentProps: {
        min: 0,
        max: 9999,
        precision: 0,
      },
      defaultValue: 0,
    },
    {
      fieldName: 'giveIntegral',
      label: $t('mall-product.spu.form.giveIntegral'),
      component: 'InputNumber',
      componentProps: {
        min: 0,
        precision: 0,
      },
      defaultValue: 0,
    },
    {
      fieldName: 'virtualSalesCount',
      label: $t('mall-product.spu.form.virtualSalesCount'),
      component: 'InputNumber',
      componentProps: {
        min: 0,
        precision: 0,
      },
      defaultValue: 0,
    },
  ];
}

/** 价格库存的表单 */
export function useSkuFormSchema(
  propertyList: any[] = [],
  isDetail: boolean = false,
): VbenFormSchema[] {
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
      fieldName: 'specType',
      label: $t('mall-product.spu.form.specType'),
      component: 'RadioGroup',
      componentProps: {
        allowClear: true,
        options: [
          {
            label: $t('mall-product.spu.form.specSingle'),
            value: false,
          },
          {
            label: $t('mall-product.spu.form.specMultiple'),
            value: true,
          },
        ],
      },
      rules: 'required',
    },
    // 单规格时显示的 SkuList
    {
      fieldName: 'singleSkuList',
      label: '',
      component: 'Input',
      dependencies: {
        triggerFields: ['specType'],
        // 当 specType 为 false（单规格）时显示
        show: (values) => values.specType === false,
      },
    },
    // 多规格时显示的商品属性（占位，实际通过插槽渲染）
    {
      fieldName: 'productAttributes',
      label: $t('mall-product.spu.form.productAttributes'),
      component: 'Input',
      dependencies: {
        triggerFields: ['specType'],
        // 当 specType 为 true（多规格）时显示
        show: (values) => values.specType === true,
      },
    },
    // 多规格 - 批量设置
    {
      fieldName: 'batchSkuList',
      label: $t('mall-product.spu.form.batchSetting'),
      component: 'Input',
      dependencies: {
        triggerFields: ['specType'],
        // 当 specType 为 true（多规格）且 propertyList 有数据时显示，且非详情模式
        show: (values) =>
          values.specType === true && propertyList.length > 0 && !isDetail,
      },
    },
    // 多规格 - 规格列表
    {
      fieldName: 'multiSkuList',
      label: $t('mall-product.spu.form.specList'),
      component: 'Input',
      dependencies: {
        triggerFields: ['specType'],
        // 当 specType 为 true（多规格）且 propertyList 有数据时显示
        show: (values) => values.specType === true && propertyList.length > 0,
      },
    },
  ];
}
