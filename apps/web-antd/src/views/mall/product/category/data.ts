import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { MallCategoryApi } from '#/api/mall/product/category';

import { CommonStatusEnum, DICT_TYPE } from '@vben/constants';
import { getDictOptions } from '@vben/hooks';
import { handleTree } from '@vben/utils';

import { z } from '#/adapter/form';
import { getCategoryList } from '#/api/mall/product/category';
import { $t } from '#/locales';

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
      fieldName: 'parentId',
      label: $t('mall-product.category.parent'),
      component: 'ApiTreeSelect',
      componentProps: {
        allowClear: true,
        api: async () => {
          const data = await getCategoryList({ parentId: 0 });
          data.unshift({
            id: 0,
            name: $t('mall-product.category.top'),
          } as MallCategoryApi.Category);
          return handleTree(data);
        },
        labelField: 'name',
        valueField: 'id',
        childrenField: 'children',
        placeholder: $t('mall-product.category.placeholder.parent'),
        treeDefaultExpandAll: true,
      },
      rules: 'selectRequired',
    },
    {
      fieldName: 'name',
      label: $t('mall-product.category.name'),
      component: 'Input',
      componentProps: {
        placeholder: $t('mall-product.category.placeholder.name'),
      },
      rules: 'required',
    },
    {
      fieldName: 'picUrl',
      label: $t('mall-product.category.picUrl'),
      component: 'ImageUpload',
      componentProps: {
        placeholder: $t('mall-product.category.placeholder.picUrl'),
      },
      rules: 'required',
    },
    {
      fieldName: 'sort',
      label: $t('mall-product.category.sort'),
      component: 'InputNumber',
      componentProps: {
        min: 0,
        placeholder: $t('mall-product.category.placeholder.sort'),
      },
      rules: 'required',
    },
    {
      fieldName: 'status',
      label: $t('mall-product.category.status'),
      component: 'RadioGroup',
      componentProps: {
        options: getDictOptions(DICT_TYPE.COMMON_STATUS, 'number'),
        buttonStyle: 'solid',
        optionType: 'button',
      },
      rules: z.number().default(CommonStatusEnum.ENABLE),
    },
    // ========== SEO 相关字段 =========
    {
      fieldName: 'metaTitle',
      label: $t('mall-product.category.metaTitle.label'),
      component: 'Input',
      componentProps: {
        placeholder: $t('mall-product.category.metaTitle.placeholder'),
        maxlength: 200,
      },
    },
    {
      fieldName: 'metaDescription',
      label: $t('mall-product.category.metaDescription.label'),
      component: 'Textarea',
      componentProps: {
        placeholder: $t('mall-product.category.metaDescription.placeholder'),
        autoSize: { minRows: 2, maxRows: 3 },
        showCount: true,
        maxlength: 500,
      },
    },
    {
      fieldName: 'slug',
      label: $t('mall-product.category.slug.label'),
      component: 'Input',
      componentProps: {
        placeholder: $t('mall-product.category.slug.placeholder'),
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
      label: $t('mall-product.category.name'),
      component: 'Input',
      componentProps: {
        placeholder: $t('mall-product.category.placeholder.name'),
        allowClear: true,
      },
    },
  ];
}

/** 列表的字段 */
export function useGridColumns(): VxeTableGridOptions<MallCategoryApi.Category>['columns'] {
  return [
    {
      field: 'name',
      title: $t('mall-product.category.name'),
      minWidth: 200,
      align: 'left',
      fixed: 'left',
      treeNode: true,
    },
    {
      field: 'picUrl',
      title: $t('mall-product.category.picUrl'),
      minWidth: 120,
      cellRender: {
        name: 'CellImage',
      },
    },
    {
      field: 'sort',
      title: $t('mall-product.category.sort'),
      minWidth: 100,
    },
    {
      field: 'status',
      title: $t('mall-product.category.status'),
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
      width: 240,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}
