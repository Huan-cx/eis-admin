<script lang="ts" setup>
import type { OrderShipmentApi } from '#/api/mall/trade/shipment/types';

import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { Page, useVbenModal } from '@vben/common-ui';
import { cloneDeep } from '@vben/utils';

import { Button, message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  calculatePackingListBatch,
  createShipment,
  getShipment,
  getShipmentTypeOptions,
  updateShipment,
  updateShipmentItems,
} from '#/api/mall/trade/shipment';
import { $t } from '#/locales';

import OrderSelector from '../modules/order-selector.vue';

const route = useRoute();
const router = useRouter();
const shipmentId = computed(() => Number(route.params.id));
const isEdit = computed(() => shipmentId.value > 0);

const selectedOrderIds = ref<number[]>([]);
const shipmentDetail = ref<null | OrderShipmentApi.Detail>(null);
const gridData = ref<OrderShipmentApi.ShipmentItem[]>([]);

const [OrderSelectorModal, orderSelectorModalApi] = useVbenModal({
  connectedComponent: OrderSelector,
  destroyOnClose: true,
});

const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: { class: 'w-full' },
    formItemClass: 'col-span-2',
    labelWidth: 120,
  },
  layout: 'horizontal',
  schema: getFormSchema(),
  showDefaultActions: false,
});

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    editConfig: {
      trigger: 'click',
      mode: 'cell',
    },
    columns: getItemColumns(),
    data: [],
    minHeight: 200,
    height: 'auto',
    keepSource: true,
    border: true,
    rowConfig: { keyField: 'orderItemId' },
    pagerConfig: {
      enabled: false,
    },
    toolbarConfig: {
      enabled: false,
    },
    events: {
      editClosed: ({ row }: { row: OrderShipmentApi.ShipmentItem }) => {
        const index = gridData.value.findIndex(
          (item) => item.orderItemId === row.orderItemId,
        );
        if (index !== -1) {
          gridData.value[index] = { ...row };
        }
      },
    },
  } as any,
});

watch(
  () => gridData.value,
  async (items) => {
    if (!items || items.length === 0) return;
    await nextTick();
    await gridApi.grid?.reloadData(items);
  },
  { deep: true, immediate: true },
);

const summary = computed(() => {
  let ctns = 0;
  let nw = 0;
  let gw = 0;
  let cbm = 0;
  for (const item of gridData.value) {
    ctns += item.ctns || 0;
    nw += item.totalNw || 0;
    gw += item.totalGw || 0;
    cbm += item.totalCbm || 0;
  }
  return { ctns, nw, gw, cbm };
});

function getFormSchema() {
  return [
    {
      fieldName: 'orderIds',
      label: $t('trade.shipment.form.orderIds'),
      component: 'Input',
      componentProps: {
        disabled: true,
        placeholder: $t('trade.shipment.form.orderIdsPlaceholder'),
      },
      visible: () => !isEdit.value,
      defaultValue: '',
    },
    {
      fieldName: 'orderNos',
      label: $t('trade.shipment.form.orderNos'),
      component: 'Input',
      componentProps: { disabled: true },
      visible: () => isEdit.value,
    },
    {
      fieldName: 'shipmentType',
      label: $t('trade.shipment.form.shipmentType'),
      component: 'Select',
      componentProps: { options: getShipmentTypeOptions() },
    },
    {
      fieldName: 'loadingPort',
      label: $t('trade.shipment.form.loadingPort'),
      component: 'Input',
    },
    {
      fieldName: 'dischargePort',
      label: $t('trade.shipment.form.dischargePort'),
      component: 'Input',
    },
    {
      fieldName: 'carrier',
      label: $t('trade.shipment.form.carrier'),
      component: 'Input',
    },
    {
      fieldName: 'vesselFlight',
      label: $t('trade.shipment.form.vesselFlight'),
      component: 'Input',
    },
    {
      fieldName: 'containerNo',
      label: $t('trade.shipment.form.containerNo'),
      component: 'Input',
    },
    {
      fieldName: 'blNo',
      label: $t('trade.shipment.form.blNo'),
      component: 'Input',
    },
    {
      fieldName: 'logisticsId',
      label: $t('trade.shipment.form.logisticsId'),
      component: 'InputNumber',
    },
    {
      fieldName: 'trackingNo',
      label: $t('trade.shipment.form.trackingNo'),
      component: 'Input',
    },
    {
      fieldName: 'remark',
      label: $t('trade.shipment.form.remark'),
      component: 'Textarea',
      componentProps: { rows: 3 },
      span: 4,
    },
  ];
}

function getItemColumns() {
  return [
    {
      field: 'spuName',
      title: $t('trade.shipment.grid.productName'),
      width: 150,
    },
    {
      field: 'skuName',
      title: $t('trade.shipment.grid.description'),
      width: 180,
    },
    {
      field: 'hsCode',
      title: $t('trade.shipment.grid.hsCode'),
      width: 120,
      editRender: { name: 'VxeInput' },
    },
    {
      field: 'count',
      title: $t('trade.shipment.grid.quantity'),
      width: 100,
      editRender: { name: 'VxeNumberInput' },
    },
    {
      field: 'packagingWay',
      title: $t('trade.shipment.grid.packagingWay'),
      width: 100,
      editRender: { name: 'VxeInput' },
    },
    {
      field: 'pcsPerCtn',
      title: $t('trade.shipment.grid.pcsPerCtn'),
      width: 100,
      editRender: { name: 'VxeNumberInput' },
    },
    {
      field: 'ctns',
      title: $t('trade.shipment.grid.ctns'),
      width: 80,
      editRender: { name: 'VxeNumberInput' },
    },
    {
      field: 'totalNw',
      title: $t('trade.shipment.grid.totalNw'),
      width: 100,
      editRender: { name: 'VxeNumberInput' },
    },
    {
      field: 'totalGw',
      title: $t('trade.shipment.grid.totalGw'),
      width: 100,
      editRender: { name: 'VxeNumberInput' },
    },
    {
      field: 'length',
      title: $t('trade.shipment.grid.length'),
      width: 80,
      editRender: { name: 'VxeNumberInput' },
    },
    {
      field: 'width',
      title: $t('trade.shipment.grid.width'),
      width: 80,
      editRender: { name: 'VxeNumberInput' },
    },
    {
      field: 'height',
      title: $t('trade.shipment.grid.height'),
      width: 80,
      editRender: { name: 'VxeNumberInput' },
    },
    {
      field: 'unit',
      title: $t('trade.shipment.grid.unit'),
      width: 80,
      editRender: { name: 'VxeInput' },
    },
    {
      field: 'totalCbm',
      title: $t('trade.shipment.grid.totalCbm'),
      width: 100,
      editRender: { name: 'VxeNumberInput' },
    },
    {
      field: 'remark',
      title: $t('trade.shipment.grid.remark'),
      width: 120,
      editRender: { name: 'VxeInput' },
    },
  ];
}

function openOrderSelector() {
  orderSelectorModalApi.setData(selectedOrderIds.value).open();
}

watch(
  () => selectedOrderIds.value,
  (val) => {
    formApi.setValues({ orderIds: val.join(', ') });
  },
);

function updateGridData(data: OrderShipmentApi.ShipmentItem[]) {
  gridData.value = cloneDeep(data);
}

async function handleOrderConfirm(orderIds: number[]) {
  selectedOrderIds.value = orderIds;
  if (selectedOrderIds.value.length === 0) {
    return;
  }
  const hideLoading = message.loading({
    content: $t('trade.shipment.message.loadingPackingList'),
    duration: 0,
  });
  try {
    const packingResults = await calculatePackingListBatch(
      selectedOrderIds.value,
    );
    const allItems: OrderShipmentApi.ShipmentItem[] = [];
    for (const result of packingResults) {
      if (result?.items) {
        allItems.push(...result.items);
      }
    }
    updateGridData(allItems);
    message.success($t('trade.shipment.message.loadPackingListSuccess'));
  } catch (error) {
    message.error($t('trade.shipment.message.loadPackingListFailed'));
    console.error('Failed to load packing list:', error);
  } finally {
    hideLoading();
  }
}

async function fetchDetail() {
  if (!isEdit.value) return;
  shipmentDetail.value = await getShipment(shipmentId.value);
  if (shipmentDetail.value) {
    selectedOrderIds.value = shipmentDetail.value.orderIds || [];
    await formApi.setValues(shipmentDetail.value);
    formApi.setValues({
      orderNos: (shipmentDetail.value.orderNos || []).join(', '),
    });
    updateGridData(shipmentDetail.value.items || []);
  }
}

async function handleSave() {
  const { valid } = await formApi.validate();
  if (!valid) return;

  const values = await formApi.getValues();

  if (!isEdit.value && selectedOrderIds.value.length === 0) {
    message.warning($t('trade.shipment.message.pleaseSelectOrder'));
    return;
  }

  try {
    if (isEdit.value) {
      await updateShipment({ ...values, id: shipmentId.value });
      await updateShipmentItems({
        shipmentId: shipmentId.value,
        items: gridData.value.map((item) => ({
          orderItemId: item.orderItemId,
          hsCode: item.hsCode,
          packagingWay: item.packagingWay,
          pcsPerCtn: item.pcsPerCtn,
          nwPerCtn: item.nwPerCtn,
          gwPerCtn: item.gwPerCtn,
          cbmPerCtn: item.cbmPerCtn,
          length: item.length,
          width: item.width,
          height: item.height,
          unit: item.unit,
          ctns: item.ctns,
          totalNw: item.totalNw,
          totalGw: item.totalGw,
          totalCbm: item.totalCbm,
          remark: item.remark,
        })),
      });
    } else {
      const id = await createShipment({
        ...values,
        orderIds: selectedOrderIds.value,
      });
      router.push({ name: 'TradeShipmentDetail', params: { id } });
      return;
    }
    message.success($t('ui.actionMessage.operationSuccess'));
    router.back();
  } catch {
    message.error($t('ui.actionMessage.operationFailed'));
  }
}

onMounted(() => {
  fetchDetail();
});
</script>

<template>
  <Page auto-content-height>
    <OrderSelectorModal @success="handleOrderConfirm" />

    <div class="rounded-lg bg-white p-6 shadow">
      <div class="mb-6 flex items-center justify-between">
        <h2 class="text-lg font-bold">
          {{
            isEdit
              ? $t('trade.shipment.modal.editTitle')
              : $t('trade.shipment.modal.createTitle')
          }}
        </h2>
      </div>

      <div v-if="!isEdit" class="mb-6 rounded-lg bg-gray-50 p-4">
        <div class="flex items-center justify-between">
          <span>{{ $t('trade.shipment.form.orderIds') }}</span>
          <Button type="primary" @click="openOrderSelector">
            {{ $t('trade.shipment.action.addOrder') }}
          </Button>
        </div>
        <div
          v-if="selectedOrderIds.length > 0"
          class="mt-2 flex flex-wrap gap-2"
        >
          <span
            v-for="id in selectedOrderIds"
            :key="id"
            class="rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-600"
          >
            #{{ id }}
          </span>
        </div>
      </div>

      <Form />

      <div class="mt-6">
        <h3 class="text-md mb-3 font-semibold">
          {{ $t('trade.shipment.detail.packingList') }}
        </h3>
        <Grid />

        <div class="mt-4 flex gap-6 rounded-lg bg-gray-50 p-3">
          <span>
            {{ $t('trade.shipment.detail.totalCtns') }}:
            <strong>{{ summary.ctns }}</strong>
          </span>
          <span>
            {{ $t('trade.shipment.detail.totalNw') }}:
            <strong>{{ summary.nw.toFixed(2) }} kg</strong>
          </span>
          <span>
            {{ $t('trade.shipment.detail.totalGw') }}:
            <strong>{{ summary.gw.toFixed(2) }} kg</strong>
          </span>
          <span>
            {{ $t('trade.shipment.detail.totalCbm') }}:
            <strong>{{ summary.cbm.toFixed(4) }} CBM</strong>
          </span>
        </div>
      </div>

      <div class="mt-6 flex justify-end gap-4">
        <Button @click="router.back()">{{ $t('common.cancel') }}</Button>
        <Button type="primary" @click="handleSave">
          {{ $t('common.save') }}
        </Button>
      </div>
    </div>
  </Page>
</template>
