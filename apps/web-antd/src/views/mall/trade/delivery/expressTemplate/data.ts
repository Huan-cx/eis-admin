import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { DICT_TYPE } from '@vben/constants';
import { getDictOptions } from '@vben/hooks';

import { z } from '#/adapter/form';
import { $t } from '#/locales';

/** 计费方式列标题映射 */
export const CHARGE_MODE_TITLE_MAP: Record<
  number,
  {
    extraCountTitle: string;
    startCountTitle: string;
  }
> = {
  1: {
    startCountTitle: $t(
      'trade.delivery.expressTemplate.chargeMode.piece.start',
    ),
    extraCountTitle: $t(
      'trade.delivery.expressTemplate.chargeMode.piece.extra',
    ),
  },
  2: {
    startCountTitle: $t(
      'trade.delivery.expressTemplate.chargeMode.weight.start',
    ),
    extraCountTitle: $t(
      'trade.delivery.expressTemplate.chargeMode.weight.extra',
    ),
  },
  3: {
    startCountTitle: $t(
      'trade.delivery.expressTemplate.chargeMode.volume.start',
    ),
    extraCountTitle: $t(
      'trade.delivery.expressTemplate.chargeMode.volume.extra',
    ),
  },
};

/** 包邮方式列标题映射 */
export const FREE_MODE_TITLE_MAP: Record<number, { freeCountTitle: string }> = {
  1: { freeCountTitle: $t('trade.delivery.expressTemplate.freeMode.piece') },
  2: { freeCountTitle: $t('trade.delivery.expressTemplate.freeMode.weight') },
  3: { freeCountTitle: $t('trade.delivery.expressTemplate.freeMode.volume') },
};

/** 运费设置表格列 */
export function useChargesColumns(
  chargeMode = 1,
): VxeTableGridOptions['columns'] {
  const chargeTitleMap = CHARGE_MODE_TITLE_MAP[chargeMode];
  return [
    {
      field: 'countries',
      title: $t('trade.delivery.expressTemplate.grid.countries'),
      minWidth: 300,
      slots: { default: 'countries' },
    },
    {
      field: 'startCount',
      title: chargeTitleMap?.startCountTitle,
      width: 120,
      slots: { default: 'startCount' },
    },
    {
      field: 'startPrice',
      title: $t('trade.delivery.expressTemplate.grid.startPrice'),
      width: 120,
      slots: { default: 'startPrice' },
    },
    {
      field: 'extraCount',
      title: chargeTitleMap?.extraCountTitle,
      width: 120,
      slots: { default: 'extraCount' },
    },
    {
      field: 'extraPrice',
      title: $t('trade.delivery.expressTemplate.grid.extraPrice'),
      width: 120,
      slots: { default: 'extraPrice' },
    },
    {
      title: $t('common.action'),
      width: 80,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}

/** 包邮设置表格列 */
export function useFreesColumns(
  chargeMode = 1,
): VxeTableGridOptions['columns'] {
  const freeTitleMap = FREE_MODE_TITLE_MAP[chargeMode];
  return [
    {
      field: 'countries',
      title: '区域',
      minWidth: 300,
      slots: { default: 'countries' },
    },
    {
      field: 'freeCount',
      title: freeTitleMap?.freeCountTitle,
      width: 120,
      slots: { default: 'freeCount' },
    },
    {
      field: 'freePrice',
      title: $t('trade.delivery.expressTemplate.grid.freePrice'),
      width: 120,
      slots: { default: 'freePrice' },
    },
    {
      title: '操作',
      width: 80,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}

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
      component: 'Input',
      fieldName: 'name',
      label: $t('trade.delivery.expressTemplate.form.name'),
      componentProps: {
        placeholder: $t('trade.delivery.expressTemplate.form.namePlaceholder'),
      },
      rules: 'required',
    },
    {
      fieldName: 'chargeMode',
      label: $t('trade.delivery.expressTemplate.form.chargeMode'),
      component: 'RadioGroup',
      componentProps: {
        options: getDictOptions(DICT_TYPE.EXPRESS_CHARGE_MODE, 'number'),
        buttonStyle: 'solid',
        optionType: 'button',
      },
      rules: z.number().default(1),
    },
    {
      fieldName: 'sort',
      label: $t('trade.delivery.expressTemplate.form.sort'),
      component: 'InputNumber',
      componentProps: {
        placeholder: $t('trade.delivery.expressTemplate.form.sortPlaceholder'),
        min: 0,
      },
      rules: 'required',
    },
    {
      fieldName: 'charges',
      label: $t('trade.delivery.expressTemplate.form.charges'),
      component: 'Input',
      formItemClass: 'col-span-3',
    },
    {
      fieldName: 'frees',
      label: $t('trade.delivery.expressTemplate.form.frees'),
      component: 'Input',
      formItemClass: 'col-span-3',
    },
  ];
}

/** 列表的搜索表单 */
export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'name',
      label: $t('trade.delivery.expressTemplate.form.name'),
      component: 'Input',
      componentProps: {
        placeholder: $t('trade.delivery.expressTemplate.form.namePlaceholder'),
        allowClear: true,
      },
    },
    {
      fieldName: 'chargeMode',
      label: $t('trade.delivery.expressTemplate.form.chargeMode'),
      component: 'Select',
      componentProps: {
        placeholder: $t(
          'trade.delivery.expressTemplate.form.chargeModePlaceholder',
        ),
        allowClear: true,
        options: getDictOptions(DICT_TYPE.EXPRESS_CHARGE_MODE, 'number'),
      },
    },
  ];
}

/** 列表的字段 */
export function useGridColumns(): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'id',
      title: $t('common.id'),
      minWidth: 100,
    },
    {
      field: 'name',
      title: $t('trade.delivery.expressTemplate.grid.name'),
      minWidth: 200,
    },
    {
      field: 'chargeMode',
      title: $t('trade.delivery.expressTemplate.grid.chargeMode'),
      minWidth: 100,
      cellRender: {
        name: 'CellDict',
        props: { type: DICT_TYPE.EXPRESS_CHARGE_MODE },
      },
    },
    {
      field: 'sort',
      title: $t('trade.delivery.expressTemplate.grid.sort'),
      minWidth: 100,
    },
    {
      field: 'createTime',
      title: $t('common.createTime'),
      minWidth: 180,
      formatter: 'formatDateTime',
    },
    {
      title: '操作',
      width: 130,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}
