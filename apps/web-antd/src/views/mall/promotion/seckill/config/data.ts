import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { MallSeckillConfigApi } from '#/api/mall/promotion/seckill/seckillConfig';

import { DICT_TYPE } from '@vben/constants';
import { getDictOptions } from '@vben/hooks';
import { $t } from '#/locales';

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
      label: $t('promotion.seckill.config.form.name'),
      component: 'Input',
      componentProps: {
        placeholder: $t('promotion.seckill.config.placeholder.name'),
      },
      rules: 'required',
    },
    {
      fieldName: 'startTime',
      label: $t('promotion.seckill.config.form.startTime'),
      component: 'TimePicker',
      componentProps: {
        format: 'HH:mm',
        valueFormat: 'HH:mm',
        placeholder: $t('promotion.seckill.config.placeholder.startTime'),
      },
      rules: 'required',
    },
    {
      fieldName: 'endTime',
      label: $t('promotion.seckill.config.form.endTime'),
      component: 'TimePicker',
      componentProps: {
        format: 'HH:mm',
        valueFormat: 'HH:mm',
        placeholder: $t('promotion.seckill.config.placeholder.endTime'),
      },
      rules: 'required',
    },
    {
      fieldName: 'sliderPicUrls',
      label: $t('promotion.seckill.config.form.sliderPicUrls'),
      component: 'ImageUpload',
      componentProps: {
        multiple: true,
        maxNumber: 5,
      },
    },
    {
      fieldName: 'status',
      label: $t('promotion.seckill.config.form.status'),
      component: 'RadioGroup',
      componentProps: {
        options: getDictOptions(DICT_TYPE.COMMON_STATUS, 'number'),
        buttonStyle: 'solid',
        optionType: 'button',
      },
      rules: 'required',
    },
  ];
}

/** 列表的搜索表单 */
export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'name',
      label: $t('promotion.seckill.config.form.name'),
      component: 'Input',
      componentProps: {
        placeholder: $t('promotion.seckill.config.placeholder.name'),
      },
    },
    {
      fieldName: 'status',
      label: $t('promotion.seckill.config.form.status'),
      component: 'Select',
      componentProps: {
        placeholder: $t('promotion.seckill.config.placeholder.status'),
        options: getDictOptions(DICT_TYPE.COMMON_STATUS, 'number'),
      },
    },
  ];
}

/** 表格列配置 */
export function useGridColumns(
  onStatusChange?: (
    newStatus: number,
    row: MallSeckillConfigApi.SeckillConfig,
  ) => PromiseLike<boolean | undefined>,
): VxeTableGridOptions['columns'] {
  return [
    {
      title: $t('promotion.seckill.config.form.name'),
      field: 'name',
      minWidth: 200,
    },
    {
      title: $t('promotion.seckill.config.form.startTime'),
      field: 'startTime',
      minWidth: 120,
    },
    {
      title: $t('promotion.seckill.config.form.endTime'),
      field: 'endTime',
      minWidth: 120,
    },
    {
      title: $t('promotion.seckill.config.form.sliderPicUrls'),
      field: 'sliderPicUrls',
      minWidth: 100,
      cellRender: {
        name: 'CellImages',
      },
    },
    {
      title: $t('promotion.seckill.config.form.status'),
      field: 'status',
      minWidth: 100,
      cellRender: {
        attrs: { beforeChange: onStatusChange },
        name: 'CellSwitch',
        props: {
          checkedValue: 1,
          checkedChildren: $t('promotion.seckill.config.grid.checkedChildren'),
          unCheckedValue: 0,
          unCheckedChildren: $t('promotion.seckill.config.grid.unCheckedChildren'),
        },
      },
    },
    {
      title: $t('promotion.seckill.config.form.createTime'),
      field: 'createTime',
      minWidth: 180,
      formatter: 'formatDateTime',
    },
    {
      title: $t('promotion.seckill.config.grid.actions'),
      width: 180,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}
