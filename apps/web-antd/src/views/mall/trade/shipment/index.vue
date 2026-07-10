<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { OrderShipmentApi } from '#/api/mall/trade/shipment/types';

import { ref } from 'vue';
import { useRouter } from 'vue-router';

import { Page, useVbenModal } from '@vben/common-ui';

import { message } from 'ant-design-vue';

import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  createShipment,
  deleteShipment,
  getShipmentPage,
} from '#/api/mall/trade/shipment';
import { $t } from '#/locales';

import { useGridColumns, useGridFormSchema } from './data';
import OrderSelector from './modules/order-selector.vue';

const { push } = useRouter();

const selectedOrderIds = ref<number[]>([]);

const [OrderSelectorModal, orderSelectorModalApi] = useVbenModal({
  connectedComponent: OrderSelector,
  destroyOnClose: true,
});

function handleRefresh() {
  gridApi.query();
}

function handleDetail(row: OrderShipmentApi.PageItem) {
  push({ name: 'TradeShipmentDetail', params: { id: row.id } });
}

function handleEdit(row: OrderShipmentApi.PageItem) {
  push({ name: 'TradeShipmentEdit', params: { id: row.id } });
}

async function handleDelete(row: OrderShipmentApi.PageItem) {
  const hideLoading = message.loading({
    content: $t('ui.actionMessage.deleting', [row.shipmentNo]),
    duration: 0,
  });
  try {
    await deleteShipment(row.id);
    message.success($t('ui.actionMessage.deleteSuccess', [row.shipmentNo]));
    handleRefresh();
  } finally {
    hideLoading();
  }
}

function handleCreateFromOrder() {
  selectedOrderIds.value = [];
  orderSelectorModalApi.setData([]).open();
}

async function handleOrderConfirm(orderIds: number[]) {
  selectedOrderIds.value = orderIds;
  if (selectedOrderIds.value.length === 0) {
    return;
  }
  const hideLoading = message.loading({
    content: $t('ui.actionMessage.creating'),
    duration: 0,
  });
  try {
    const shipmentId = await createShipment({
      orderIds: selectedOrderIds.value,
    });
    message.success($t('ui.actionMessage.createSuccess'));
    push({ name: 'TradeShipmentDetail', params: { id: shipmentId } });
  } finally {
    hideLoading();
  }
}

function handleCreate() {
  push({ name: 'TradeShipmentEdit' });
}

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    schema: useGridFormSchema(),
  },
  gridOptions: {
    columns: useGridColumns(),
    height: 'auto',
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          return await getShipmentPage({
            pageNo: page.currentPage,
            pageSize: page.pageSize,
            ...formValues,
          });
        },
      },
    },
    rowConfig: {
      keyField: 'id',
      isHover: true,
    },
    toolbarConfig: {
      refresh: true,
      search: true,
    },
  } as VxeTableGridOptions<OrderShipmentApi.PageItem>,
});
</script>

<template>
  <Page auto-content-height>
    <OrderSelectorModal @success="handleOrderConfirm" />

    <Grid :table-title="$t('trade.shipment.index.title')">
      <template #toolbar-tools>
        <TableAction
          :actions="[
            {
              label: $t('trade.shipment.action.createFromOrder'),
              type: 'primary',
              icon: ACTION_ICON.ADD,
              auth: ['trade:shipment:create'],
              onClick: handleCreateFromOrder,
            },
            {
              label: $t('trade.shipment.action.create'),
              type: 'primary',
              icon: ACTION_ICON.ADD,
              auth: ['trade:shipment:create'],
              onClick: handleCreate,
            },
          ]"
        />
      </template>
      <template #actions="{ row }">
        <TableAction
          :actions="[
            {
              label: $t('trade.shipment.action.detail'),
              type: 'link',
              icon: ACTION_ICON.VIEW,
              auth: ['trade:shipment:query'],
              onClick: handleDetail.bind(null, row),
            },
            {
              label: $t('trade.shipment.action.edit'),
              type: 'link',
              icon: ACTION_ICON.EDIT,
              auth: ['trade:shipment:update'],
              onClick: handleEdit.bind(null, row),
            },
          ]"
          :drop-down-actions="[
            {
              label: $t('trade.shipment.action.delete'),
              type: 'link',
              danger: true,
              auth: ['trade:shipment:delete'],
              popConfirm: {
                title: $t('ui.actionMessage.deleteConfirm', [row.shipmentNo]),
                confirm: handleDelete.bind(null, row),
              },
            },
          ]"
        />
      </template>
    </Grid>
  </Page>
</template>
