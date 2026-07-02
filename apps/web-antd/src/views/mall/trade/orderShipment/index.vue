<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { OrderShipmentApi } from '#/api/mall/trade/orderShipment/types';

import { useRouter } from 'vue-router';

import { Page, prompt, useVbenModal } from '@vben/common-ui';

import { message } from 'ant-design-vue';

import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  createShipment,
  createShipmentFromOrder,
  deleteShipment,
  getShipmentPage,
} from '#/api/mall/trade/orderShipment';
import { $t } from '#/locales';

import { useGridColumns, useGridFormSchema } from './data';
import EventForm from './modules/event-form.vue';
import ShipmentForm from './modules/shipment-form.vue';
import StatusForm from './modules/status-form.vue';

const { push } = useRouter();

/** 创建发货单弹窗 */
const [ShipmentCreateModal, shipmentCreateModalApi] = useVbenModal({
  connectedComponent: ShipmentForm,
  destroyOnClose: true,
});

/** 编辑弹窗 */
const [ShipmentFormModal, shipmentFormModalApi] = useVbenModal({
  connectedComponent: ShipmentForm,
  destroyOnClose: true,
});

/** 添加事件弹窗 */
const [EventFormModal, eventFormModalApi] = useVbenModal({
  connectedComponent: EventForm,
  destroyOnClose: true,
});

/** 更新状态弹窗 */
const [StatusFormModal, statusFormModalApi] = useVbenModal({
  connectedComponent: StatusForm,
  destroyOnClose: true,
});

/** 刷新表格 */
function handleRefresh() {
  gridApi.query();
}

/** 详情 */
function handleDetail(row: OrderShipmentApi.PageItem) {
  push({ name: 'TradeOrderShipmentDetail', params: { id: row.id } });
}

/** 编辑 */
function handleEdit(row: OrderShipmentApi.PageItem) {
  shipmentFormModalApi.setData(row).open();
}

/** 添加事件 */
function handleAddEvent(row: OrderShipmentApi.PageItem) {
  eventFormModalApi.setData({ shipmentId: row.id }).open();
}

/** 更新状态 */
function handleUpdateStatus(row: OrderShipmentApi.PageItem) {
  statusFormModalApi.setData(row).open();
}

/** 查看订单详情 */
function handleOrderDetail(row: OrderShipmentApi.PageItem) {
  push({ name: 'TradeOrderDetail', params: { id: row.orderId } });
}

/** 删除发货单 */
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

/** 创建发货单（根据订单） */
async function handleCreateFromOrder() {
  const orderId = await prompt({
    title: $t('trade.shipment.modal.createFromOrderTitle'),
    content: $t('trade.shipment.modal.createFromOrderPlaceholder'),
    modelPropName: 'value',
  });
  if (orderId) {
    const id = Number(orderId);
    if (Number.isNaN(id) || id <= 0) {
      message.error($t('trade.shipment.message.invalidOrderId'));
      return;
    }
    const shipmentId = await createShipmentFromOrder(id);
    push({ name: 'TradeOrderShipmentDetail', params: { id: shipmentId } });
  }
}

/** 手动创建发货单 */
function handleCreate() {
  shipmentCreateModalApi.setData({ isCreate: true }).open();
}

/** 判断是否可以更新状态 */
function canUpdateStatus(row: OrderShipmentApi.PageItem) {
  return row.status !== 0 && row.status !== 80;
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
    <ShipmentCreateModal @success="handleRefresh" />
    <ShipmentFormModal @success="handleRefresh" />
    <EventFormModal @success="handleRefresh" />
    <StatusFormModal @success="handleRefresh" />

    <Grid :table-title="$t('trade.shipment.index.title')">
      <template #toolbar-tools>
        <TableAction
          :actions="[
            {
              label: $t('trade.shipment.action.createFromOrder'),
              type: 'primary',
              icon: ACTION_ICON.ADD,
              auth: ['trade:order-shipment:create'],
              onClick: handleCreateFromOrder,
            },
            {
              label: $t('trade.shipment.action.create'),
              type: 'primary',
              icon: ACTION_ICON.ADD,
              auth: ['trade:order-shipment:create'],
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
              auth: ['trade:order-shipment:query'],
              onClick: handleDetail.bind(null, row),
            },
            {
              label: $t('trade.shipment.action.edit'),
              type: 'link',
              icon: ACTION_ICON.EDIT,
              auth: ['trade:order-shipment:update'],
              onClick: handleEdit.bind(null, row),
            },
          ]"
          :drop-down-actions="[
            {
              label: $t('trade.shipment.action.orderDetail'),
              type: 'link',
              onClick: handleOrderDetail.bind(null, row),
            },
            {
              label: $t('trade.shipment.action.updateStatus'),
              type: 'link',
              auth: ['trade:order-shipment:updateStatus'],
              ifShow: () => canUpdateStatus(row),
              onClick: handleUpdateStatus.bind(null, row),
            },
            {
              label: $t('trade.shipment.action.addEvent'),
              type: 'link',
              auth: ['trade:order-shipment-event:create'],
              onClick: handleAddEvent.bind(null, row),
            },
            {
              label: $t('trade.shipment.action.delete'),
              type: 'link',
              danger: true,
              icon: ACTION_ICON.DELETE,
              auth: ['trade:order-shipment:delete'],
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
