import type { VbenFormSchema } from '#/adapter/form';
import type { VxeGridPropTypes } from '#/adapter/vxe-table';
import type { MallDeliveryPickUpStoreApi } from '#/api/mall/trade/delivery/pickUpStore';

import { ref } from 'vue';

import { DICT_TYPE } from '@vben/constants';
import { useUserStore } from '@vben/stores';

import { getSimpleDeliveryPickUpStoreList } from '#/api/mall/trade/delivery/pickUpStore';
import { $t } from '#/locales';
import { getRangePickerDefaultProps } from '#/utils';

/** 关联数据 */
const userStore = useUserStore();
const pickUpStoreList = ref<MallDeliveryPickUpStoreApi.DeliveryPickUpStore[]>(
  [],
);
getSimpleDeliveryPickUpStoreList().then((res) => {
  pickUpStoreList.value = res;
  // 移除自己无法核销的门店
  const userId = userStore?.userInfo?.id;
  pickUpStoreList.value = pickUpStoreList.value.filter((item) =>
    item.verifyUserIds?.includes(userId),
  );
});

/** 列表的搜索表单 */
export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'createTime',
      label: $t('trade.delivery.pickUpOrder.form.createTime'),
      component: 'RangePicker',
      componentProps: {
        ...getRangePickerDefaultProps(),
        allowClear: true,
      },
    },
    {
      fieldName: 'pickUpStoreIds',
      label: $t('trade.delivery.pickUpOrder.form.pickUpStoreIds'),
      component: 'Select',
      componentProps: {
        options: pickUpStoreList,
        labelField: 'name',
        valueField: 'id',
        placeholder: $t(
          'trade.delivery.pickUpOrder.form.pickUpStoreIdsPlaceholder',
        ),
      },
      defaultValue: pickUpStoreList.value[0]?.id,
    },
    {
      fieldName: 'no',
      label: $t('trade.delivery.pickUpOrder.form.no'),
      component: 'Input',
      componentProps: {
        placeholder: $t('trade.delivery.pickUpOrder.form.noPlaceholder'),
        allowClear: true,
      },
    },
    {
      fieldName: 'userId',
      label: $t('trade.delivery.pickUpOrder.form.userId'),
      component: 'Input',
      componentProps: {
        placeholder: $t('trade.delivery.pickUpOrder.form.userIdPlaceholder'),
        allowClear: true,
      },
    },
    {
      fieldName: 'userNickname',
      label: $t('trade.delivery.pickUpOrder.form.userNickname'),
      component: 'Input',
      componentProps: {
        placeholder: $t(
          'trade.delivery.pickUpOrder.form.userNicknamePlaceholder',
        ),
        allowClear: true,
      },
    },
    {
      fieldName: 'userMobile',
      label: $t('trade.delivery.pickUpOrder.form.userMobile'),
      component: 'Input',
      componentProps: {
        placeholder: $t(
          'trade.delivery.pickUpOrder.form.userMobilePlaceholder',
        ),
        allowClear: true,
      },
    },
  ];
}

/** 表格列配置 */
export function useGridColumns(): VxeGridPropTypes.Columns {
  return [
    {
      field: 'no',
      title: $t('trade.delivery.pickUpOrder.grid.no'),
      fixed: 'left',
      minWidth: 180,
    },
    {
      field: 'user.nickname',
      title: $t('trade.delivery.pickUpOrder.grid.user'),
      minWidth: 100,
    },
    {
      field: 'brokerageUser.nickname',
      title: $t('trade.delivery.pickUpOrder.grid.brokerageUser'),
      minWidth: 100,
    },
    {
      field: 'spuName',
      title: $t('trade.delivery.pickUpOrder.grid.spuName'),
      minWidth: 300,
      slots: { default: 'spuName' },
    },
    {
      field: 'payPrice',
      title: $t('trade.delivery.pickUpOrder.grid.payPrice'),
      formatter: 'formatAmount2',
      minWidth: 180,
    },
    {
      field: 'storeStaffName',
      title: $t('trade.delivery.pickUpOrder.grid.storeStaffName'),
      minWidth: 160,
    },
    {
      field: 'pickUpStoreId',
      title: $t('trade.delivery.pickUpOrder.grid.pickUpStoreId'),
      minWidth: 160,
      formatter: ({ row }) => {
        return (
          pickUpStoreList.value.find((item) => item.id === row.pickUpStoreId)
            ?.name || ''
        );
      },
    },
    {
      field: 'payStatus',
      title: $t('trade.delivery.pickUpOrder.grid.payStatus'),
      cellRender: {
        name: 'CellDict',
        props: { type: DICT_TYPE.INFRA_BOOLEAN_STRING },
      },
      minWidth: 80,
    },
    {
      field: 'status',
      title: $t('trade.delivery.pickUpOrder.grid.status'),
      cellRender: {
        name: 'CellDict',
        props: { type: DICT_TYPE.TRADE_ORDER_STATUS },
      },
      minWidth: 80,
    },
    {
      field: 'createTime',
      title: $t('trade.delivery.pickUpOrder.grid.createTime'),
      formatter: 'formatDateTime',
      minWidth: 160,
    },
  ];
}
