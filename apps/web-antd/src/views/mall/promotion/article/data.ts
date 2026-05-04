import type { VbenFormSchema } from '#/adapter/form';
import type { VxeGridPropTypes } from '#/adapter/vxe-table';
import type { MallArticleCategoryApi } from '#/api/mall/promotion/article/category';

import { CommonStatusEnum, DICT_TYPE } from '@vben/constants';
import { getDictOptions } from '@vben/hooks';

import { z } from '#/adapter/form';
import { getSimpleArticleCategoryList } from '#/api/mall/promotion/article/category';
import { getRangePickerDefaultProps } from '#/utils';
import { $t } from '#/locales';

/** 关联数据 */
let categoryList: MallArticleCategoryApi.ArticleCategory[] = [];
getSimpleArticleCategoryList().then((data) => (categoryList = data));

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
      fieldName: 'title',
      label: $t('promotion.article.form.title'),
      component: 'Input',
      componentProps: {
        placeholder: $t('promotion.article.placeholder.title'),
      },
      rules: 'required',
    },
    {
      fieldName: 'categoryId',
      label: $t('promotion.article.form.categoryId'),
      component: 'ApiSelect',
      componentProps: {
        api: getSimpleArticleCategoryList,
        labelField: 'name',
        valueField: 'id',
        placeholder: $t('promotion.article.placeholder.categoryId'),
      },
      rules: 'required',
    },
    {
      fieldName: 'author',
      label: $t('promotion.article.form.author'),
      component: 'Input',
      componentProps: {
        placeholder: $t('promotion.article.placeholder.author'),
      },
    },
    {
      fieldName: 'introduction',
      label: $t('promotion.article.form.introduction'),
      component: 'Input',
      componentProps: {
        placeholder: $t('promotion.article.placeholder.introduction'),
      },
    },
    {
      fieldName: 'picUrl',
      label: $t('promotion.article.form.picUrl'),
      component: 'ImageUpload',
      formItemClass: 'col-span-2',
      componentProps: {
        placeholder: $t('promotion.article.placeholder.picUrl'),
      },
      rules: 'required',
    },
    {
      fieldName: 'recommendHot',
      label: $t('promotion.article.form.recommendHot'),
      component: 'RadioGroup',
      componentProps: {
        options: getDictOptions(DICT_TYPE.INFRA_BOOLEAN_STRING, 'boolean'),
        buttonStyle: 'solid',
        optionType: 'button',
      },
      rules: 'required',
      defaultValue: true,
    },
    {
      fieldName: 'recommendBanner',
      label: $t('promotion.article.form.recommendBanner'),
      component: 'RadioGroup',
      componentProps: {
        options: getDictOptions(DICT_TYPE.INFRA_BOOLEAN_STRING, 'boolean'),
        buttonStyle: 'solid',
        optionType: 'button',
      },
      rules: 'required',
      defaultValue: true,
    },
    {
      fieldName: 'spuId',
      label: $t('promotion.article.form.spuId'),
      component: 'Input',
      formItemClass: 'col-span-2',
    },
    {
      fieldName: 'sort',
      label: $t('promotion.article.form.sort'),
      component: 'InputNumber',
      componentProps: {
        min: 0,
        placeholder: $t('promotion.article.placeholder.sort'),
      },
      rules: 'required',
    },
    {
      fieldName: 'status',
      label: $t('promotion.article.form.status'),
      component: 'RadioGroup',
      componentProps: {
        options: getDictOptions(DICT_TYPE.COMMON_STATUS, 'number'),
        buttonStyle: 'solid',
        optionType: 'button',
      },
      rules: z.number().default(CommonStatusEnum.ENABLE),
    },
    {
      fieldName: 'content',
      label: $t('promotion.article.form.content'),
      component: 'RichTextarea',
      rules: 'required',
      formItemClass: 'col-span-2',
    },
    // ========== SEO 相关字段 =========
    {
      fieldName: 'metaTitle',
      label: $t('promotion.article.metaTitle.label'),
      component: 'Input',
      componentProps: {
        placeholder: $t('promotion.article.metaTitle.placeholder'),
        maxlength: 200,
      },
    },
    {
      fieldName: 'metaDescription',
      label: $t('promotion.article.metaDescription.label'),
      component: 'Textarea',
      componentProps: {
        placeholder: $t('promotion.article.metaDescription.placeholder'),
        autoSize: { minRows: 2, maxRows: 3 },
        showCount: true,
        maxlength: 500,
      },
    },
    {
      fieldName: 'slug',
      label: $t('promotion.article.slug.label'),
      component: 'Input',
      componentProps: {
        placeholder: $t('promotion.article.slug.placeholder'),
        maxlength: 100,
      },
    },
  ];
}

/** 列表的搜索表单 */
export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'categoryId',
      label: $t('promotion.article.form.categoryId'),
      component: 'ApiSelect',
      componentProps: {
        api: getSimpleArticleCategoryList,
        labelField: 'name',
        valueField: 'id',
        placeholder: $t('promotion.article.placeholder.categoryId'),
        allowClear: true,
      },
    },
    {
      fieldName: 'title',
      label: $t('promotion.article.form.title'),
      component: 'Input',
      componentProps: {
        placeholder: $t('promotion.article.placeholder.title'),
        allowClear: true,
      },
    },
    {
      fieldName: 'status',
      label: $t('promotion.article.form.status'),
      component: 'Select',
      componentProps: {
        options: getDictOptions(DICT_TYPE.COMMON_STATUS, 'number'),
        placeholder: $t('promotion.article.placeholder.status'),
        allowClear: true,
      },
    },
    {
      fieldName: 'createTime',
      label: $t('promotion.article.form.createTime'),
      component: 'RangePicker',
      componentProps: {
        ...getRangePickerDefaultProps(),
        allowClear: true,
      },
    },
  ];
}

/** 列表的字段 */
export function useGridColumns(): VxeGridPropTypes.Columns {
  return [
    {
      field: 'id',
      title: $t('promotion.article.grid.id'),
      minWidth: 100,
    },
    {
      field: 'title',
      title: $t('promotion.article.grid.title'),
      minWidth: 200,
    },
    {
      field: 'picUrl',
      title: $t('promotion.article.grid.picUrl'),
      minWidth: 120,
      cellRender: {
        name: 'CellImage',
      },
    },
    {
      field: 'categoryId',
      title: $t('promotion.article.grid.categoryId'),
      minWidth: 100,
      formatter: ({ cellValue }) =>
        categoryList.find((item) => item.id === cellValue)?.name || '-',
    },
    {
      field: 'browseCount',
      title: $t('promotion.article.grid.browseCount'),
      minWidth: 100,
    },
    {
      field: 'author',
      title: $t('promotion.article.grid.author'),
      minWidth: 120,
    },
    {
      field: 'introduction',
      title: $t('promotion.article.grid.introduction'),
      minWidth: 250,
    },
    {
      field: 'sort',
      title: $t('promotion.article.grid.sort'),
      minWidth: 80,
    },
    {
      field: 'status',
      title: $t('promotion.article.form.status'),
      minWidth: 100,
      cellRender: {
        name: 'CellDict',
        props: { type: DICT_TYPE.COMMON_STATUS },
      },
    },
    {
      field: 'createTime',
      title: $t('promotion.article.form.createTime'),
      minWidth: 180,
      formatter: 'formatDateTime',
    },
    {
      title: $t('promotion.article.grid.actions'),
      width: 180,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}
