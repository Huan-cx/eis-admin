import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { MallLanguageApi } from '#/api/mall/product/language';

import { $t } from '#/locales';

export function useGridColumns(
  onStatusChange?: (
    newStatus: number,
    row: MallLanguageApi.Language,
  ) => PromiseLike<boolean | undefined>,
  onDefaultChange?: (
    newDefault: boolean,
    row: MallLanguageApi.Language,
  ) => PromiseLike<boolean | undefined>,
): VxeTableGridOptions<MallLanguageApi.Language>['columns'] {
  return [
    {
      title: $t('common.id'),
      field: 'id',
      width: 80,
    },
    {
      title: $t('language.code'),
      field: 'code',
      width: 120,
    },
    {
      title: $t('language.name'),
      field: 'name',
      width: 120,
    },
    {
      title: $t('language.nativeName'),
      field: 'nativeName',
      width: 120,
    },
    {
      title: $t('language.flag'),
      field: 'flag',
      width: 80,
    },
    {
      title: $t('language.isDefault'),
      field: 'isDefault',
      width: 120,
      align: 'center',
      cellRender: {
        attrs: { beforeChange: onDefaultChange },
        name: 'CellSwitch',
        props: {
          checkedValue: true,
          unCheckedValue: false,
          checkedChildren: $t('common.yes'),
          unCheckedChildren: $t('common.no'),
        },
      },
    },
    {
      title: $t('common.status'),
      field: 'status',
      width: 120,
      align: 'center',
      cellRender: {
        attrs: { beforeChange: onStatusChange },
        name: 'CellSwitch',
        props: {
          checkedValue: 1,
          unCheckedValue: 0,
          checkedChildren: $t('common.enable'),
          unCheckedChildren: $t('common.disable'),
        },
      },
    },
    {
      title: $t('common.sort'),
      field: 'sort',
      width: 80,
    },
    {
      title: $t('common.createTime'),
      field: 'createTime',
      width: 180,
      formatter: 'formatDateTime',
    },
    {
      title: $t('common.actions'),
      field: 'actions',
      width: 160,
      align: 'center',
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}

export function useGridFormSchema() {
  return [
    {
      field: 'code',
      label: $t('language.code'),
      component: 'Input',
      componentProps: {
        placeholder: $t('ui.inputPlaceholder.enter', [$t('language.code')]),
      },
    },
    {
      field: 'name',
      label: $t('language.name'),
      component: 'Input',
      componentProps: {
        placeholder: $t('ui.inputPlaceholder.enter', [$t('language.name')]),
      },
    },
  ];
}
