import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { CommonStatusEnum, DICT_TYPE } from '@vben/constants';
import { getDictOptions } from '@vben/hooks';

import { z } from '#/adapter/form';
import { getAreaTree } from '#/api/system/area';
import { getSimpleUserList } from '#/api/system/user';
import { $t } from '#/locales';
import { getRangePickerDefaultProps } from '#/utils';

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
      label: $t('trade.delivery.pickUpStore.form.name'),
      rules: 'required',
      componentProps: {
        placeholder: $t('trade.delivery.pickUpStore.form.namePlaceholder'),
      },
    },
    {
      component: 'Input',
      fieldName: 'phone',
      label: $t('trade.delivery.pickUpStore.form.phone'),
      rules: 'mobileRequired',
      componentProps: {
        placeholder: $t('trade.delivery.pickUpStore.form.phonePlaceholder'),
      },
    },
    {
      component: 'ImageUpload',
      fieldName: 'logo',
      label: $t('trade.delivery.pickUpStore.form.logo'),
      rules: 'required',
      formItemClass: 'col-span-2',
      componentProps: {
        placeholder: $t('trade.delivery.pickUpStore.form.logoPlaceholder'),
      },
      help: $t('trade.delivery.pickUpStore.form.logoHelp'),
    },
    {
      component: 'Textarea',
      fieldName: 'introduction',
      label: $t('trade.delivery.pickUpStore.form.introduction'),
      formItemClass: 'col-span-2',
      componentProps: {
        placeholder: $t(
          'trade.delivery.pickUpStore.form.introductionPlaceholder',
        ),
        rows: 4,
      },
    },
    {
      fieldName: 'areaId',
      label: $t('trade.delivery.pickUpStore.form.areaId'),
      component: 'ApiTreeSelect',
      rules: 'required',
      componentProps: {
        api: getAreaTree,
        fieldNames: { label: 'name', value: 'id', children: 'children' },
        placeholder: $t('trade.delivery.pickUpStore.form.areaIdPlaceholder'),
      },
    },
    {
      component: 'Input',
      fieldName: 'detailAddress',
      label: $t('trade.delivery.pickUpStore.form.detailAddress'),
      rules: 'required',
      componentProps: {
        placeholder: $t(
          'trade.delivery.pickUpStore.form.detailAddressPlaceholder',
        ),
      },
    },
    {
      component: 'TimeRangePicker',
      fieldName: 'rangeTime',
      label: $t('trade.delivery.pickUpStore.form.rangeTime'),
      rules: 'required',
      componentProps: {
        format: 'HH:mm',
      },
    },
    {
      fieldName: 'status',
      label: $t('trade.delivery.pickUpStore.form.status'),
      component: 'RadioGroup',
      componentProps: {
        options: getDictOptions(DICT_TYPE.COMMON_STATUS, 'number'),
        buttonStyle: 'solid',
        optionType: 'button',
      },
      rules: z.number().default(CommonStatusEnum.ENABLE),
    },
    {
      component: 'Input',
      fieldName: 'longitude',
      label: $t('trade.delivery.pickUpStore.form.longitude'),
      rules: 'required',
      componentProps: {
        placeholder: $t('trade.delivery.pickUpStore.form.longitudePlaceholder'),
      },
    },
    {
      component: 'Input',
      fieldName: 'latitude',
      label: $t('trade.delivery.pickUpStore.form.latitude'),
      rules: 'required',
      componentProps: {
        placeholder: $t('trade.delivery.pickUpStore.form.latitudePlaceholder'),
      },
    },
  ];
}

/** 绑定店员的表单 */
export function useBindFormSchema(): VbenFormSchema[] {
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
      label: $t('trade.delivery.pickUpStore.form.name'),
      dependencies: {
        triggerFields: ['id'],
        disabled: true,
      },
    },
    {
      component: 'ApiSelect',
      fieldName: 'verifyUserIds',
      label: $t('trade.delivery.pickUpStore.form.verifyUserIds'),
      rules: 'required',
      componentProps: {
        api: getSimpleUserList,
        labelField: 'nickname',
        valueField: 'id',
        mode: 'tags',
        allowClear: true,
        placeholder: $t(
          'trade.delivery.pickUpStore.form.verifyUserIdsPlaceholder',
        ),
      },
    },
  ];
}

/** 列表的搜索表单 */
export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'phone',
      label: $t('trade.delivery.pickUpStore.form.phone'),
      component: 'Input',
      componentProps: {
        placeholder: $t('trade.delivery.pickUpStore.form.phonePlaceholder'),
        allowClear: true,
      },
    },
    {
      fieldName: 'name',
      label: $t('trade.delivery.pickUpStore.form.name'),
      component: 'Input',
      componentProps: {
        placeholder: $t('trade.delivery.pickUpStore.form.namePlaceholder'),
        allowClear: true,
      },
    },
    {
      fieldName: 'status',
      label: $t('trade.delivery.pickUpStore.form.status'),
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: getDictOptions(DICT_TYPE.COMMON_STATUS, 'number'),
        placeholder: $t('trade.delivery.pickUpStore.form.statusPlaceholder'),
      },
    },
    {
      fieldName: 'createTime',
      label: $t('common.createTime'),
      component: 'RangePicker',
      componentProps: {
        ...getRangePickerDefaultProps(),
        allowClear: true,
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
      minWidth: 80,
    },
    {
      field: 'logo',
      title: $t('trade.delivery.pickUpStore.grid.logo'),
      minWidth: 100,
      cellRender: {
        name: 'CellImage',
      },
    },
    {
      field: 'name',
      title: $t('trade.delivery.pickUpStore.grid.name'),
      minWidth: 150,
    },
    {
      field: 'phone',
      title: $t('trade.delivery.pickUpStore.grid.phone'),
      minWidth: 120,
    },
    {
      field: 'detailAddress',
      title: $t('trade.delivery.pickUpStore.grid.detailAddress'),
      minWidth: 200,
    },
    {
      field: 'openingTime',
      title: $t('trade.delivery.pickUpStore.grid.openingTime'),
      minWidth: 160,
      formatter: ({ row }) => {
        return `${row.openingTime} ~ ${row.closingTime}`;
      },
    },
    {
      field: 'status',
      title: $t('trade.delivery.pickUpStore.grid.status'),
      minWidth: 100,
      cellRender: {
        name: 'CellDict',
        props: { type: DICT_TYPE.COMMON_STATUS },
      },
    },
    {
      field: 'createTime',
      title: $t('common.createTime'),
      minWidth: 160,
      formatter: 'formatDateTime',
    },
    {
      title: $t('common.actions'),
      width: 220,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}
