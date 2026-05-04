import type { VxeTableGridOptions } from '@vben/plugins/vxe-table';

import type { VbenFormSchema } from '#/adapter/form';

import { CommonStatusEnum, DICT_TYPE } from '@vben/constants';
import { getDictOptions } from '@vben/hooks';
import { $t } from '@vben/locales';

import { z } from '#/adapter/form';
import { getRangePickerDefaultProps } from '#/utils';

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
      label: $t('promotion.banner.form.title'),
      component: 'Input',
      componentProps: {
        placeholder: $t('promotion.banner.placeholder.title'),
      },
      rules: 'required',
    },
    {
      fieldName: 'picUrl',
      label: $t('promotion.banner.form.picUrl'),
      component: 'ImageUpload',
      componentProps: {
        placeholder: $t('promotion.banner.placeholder.picUrl'),
      },
      rules: 'required',
    },
    {
      fieldName: 'position',
      label: $t('promotion.banner.form.position'),
      component: 'RadioGroup',
      componentProps: {
        options: getDictOptions(DICT_TYPE.PROMOTION_BANNER_POSITION, 'number'),
        buttonStyle: 'solid',
        optionType: 'button',
      },
      rules: 'required',
    },
    {
      fieldName: 'url',
      label: $t('promotion.banner.form.url'),
      component: 'Input',
      componentProps: {
        placeholder: $t('promotion.banner.placeholder.url'),
      },
      rules: 'required',
    },
    {
      fieldName: 'sort',
      label: $t('promotion.banner.form.sort'),
      component: 'InputNumber',
      componentProps: {
        min: 0,
        placeholder: $t('promotion.banner.placeholder.sort'),
      },
      rules: 'required',
    },
    {
      fieldName: 'status',
      label: $t('promotion.banner.form.status'),
      component: 'RadioGroup',
      componentProps: {
        options: getDictOptions(DICT_TYPE.COMMON_STATUS, 'number'),
        buttonStyle: 'solid',
        optionType: 'button',
      },
      rules: z.number().default(CommonStatusEnum.ENABLE),
    },
    {
      fieldName: 'memo',
      label: $t('promotion.banner.form.memo'),
      component: 'Textarea',
      componentProps: {
        rows: 4,
        placeholder: $t('promotion.banner.placeholder.memo'),
      },
    },
  ];
}

/** 列表的搜索表单 */
export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'title',
      label: $t('promotion.banner.form.title'),
      component: 'Input',
      componentProps: {
        placeholder: $t('promotion.banner.placeholder.title'),
      },
    },
    {
      fieldName: 'status',
      label: $t('promotion.banner.form.status'),
      component: 'Select',
      componentProps: {
        placeholder: $t('promotion.banner.placeholder.status'),
        options: getDictOptions(DICT_TYPE.COMMON_STATUS, 'number'),
      },
    },
    {
      fieldName: 'createTime',
      label: $t('promotion.banner.form.createTime'),
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
      title: $t('promotion.banner.grid.title'),
      field: 'title',
      minWidth: 100,
    },
    {
      title: $t('promotion.banner.grid.picUrl'),
      field: 'picUrl',
      minWidth: 80,
      cellRender: {
        name: 'CellImage',
      },
    },
    {
      title: $t('promotion.banner.form.status'),
      field: 'status',
      minWidth: 150,
      cellRender: {
        name: 'CellDict',
        props: {
          type: DICT_TYPE.COMMON_STATUS,
        },
      },
    },
    {
      title: $t('promotion.banner.form.position'),
      field: 'position',
      minWidth: 150,
      cellRender: {
        name: 'CellDict',
        props: {
          type: DICT_TYPE.PROMOTION_BANNER_POSITION,
        },
      },
    },
    {
      title: $t('promotion.banner.form.url'),
      field: 'url',
      minWidth: 200,
    },
    {
      title: $t('promotion.banner.form.createTime'),
      field: 'createTime',
      minWidth: 180,
      formatter: 'formatDateTime',
    },
    {
      title: $t('promotion.banner.form.sort'),
      field: 'sort',
      minWidth: 100,
    },
    {
      title: $t('promotion.banner.form.memo'),
      field: 'memo',
      minWidth: 150,
    },
    {
      title: $t('promotion.banner.grid.actions'),
      width: 180,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}
