<script lang="ts" setup>
import type { OrderShipmentApi } from '#/api/mall/trade/shipment/types';

import { computed, ref, watch } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { Button, Input, message, Spin, Table } from 'ant-design-vue';

import { searchOrders } from '#/api/mall/trade/shipment';
import { $t } from '#/locales';

const emit = defineEmits(['success']);

const keyword = ref('');
const searchLoading = ref(false);
const orderList = ref<OrderShipmentApi.OrderSearchItem[]>([]);
const selectedOrders = ref<OrderShipmentApi.OrderSearchItem[]>([]);
const selectedOrderIds = ref<number[]>([]);

const getTitle = computed(() => $t('trade.shipment.modal.selectOrderTitle'));

const [Modal, modalApi] = useVbenModal({
  async onConfirm() {
    if (selectedOrders.value.length === 0) {
      message.warning($t('trade.shipment.message.pleaseSelectOrder'));
      return;
    }
    emit('success', selectedOrderIds.value);
    await modalApi.close();
  },
  async onOpenChange(isOpen: boolean) {
    if (!isOpen) {
      selectedOrderIds.value = [];
      selectedOrders.value = [];
      keyword.value = '';
      orderList.value = [];
      return;
    }
    const data = modalApi.getData<number[]>();
    if (data) {
      selectedOrderIds.value = data;
    }
    await handleSearch();
  },
});

watch(selectedOrderIds, (newVal) => {
  selectedOrders.value = orderList.value.filter((o) => newVal.includes(o.id));
});

async function handleSearch() {
  searchLoading.value = true;
  try {
    orderList.value = await searchOrders(keyword.value.trim());
    selectedOrders.value = orderList.value.filter((o) =>
      selectedOrderIds.value.includes(o.id),
    );
  } finally {
    searchLoading.value = false;
  }
}

function handleSelect(order: OrderShipmentApi.OrderSearchItem) {
  const index = selectedOrders.value.findIndex((o) => o.id === order.id);
  if (index === -1) {
    selectedOrders.value.push(order);
  } else {
    selectedOrders.value.splice(index, 1);
  }
  selectedOrderIds.value = selectedOrders.value.map((o) => o.id);
}

function handleSelectionChange(keys: any[]) {
  const idKeys = keys.map(Number);
  selectedOrders.value = orderList.value.filter(
    (o: OrderShipmentApi.OrderSearchItem) => idKeys.includes(o.id),
  );
  selectedOrderIds.value = idKeys;
}

const tableColumns = [
  {
    title: $t('trade.shipment.grid.orderNo'),
    dataIndex: 'no',
    width: 200,
  },
  {
    title: $t('trade.shipment.grid.customerName'),
    dataIndex: 'customerName',
    width: 200,
  },
  {
    title: $t('trade.shipment.grid.totalAmount'),
    dataIndex: 'totalAmount',
    width: 120,
    customRender: ({ text }: { text: number | string }) => `¥${text}`,
  },
  {
    title: $t('trade.shipment.grid.orderStatus'),
    dataIndex: 'statusName',
    width: 180,
  },
];
</script>

<template>
  <Modal :title="getTitle" class="w-2/5">
    <div class="order-selector">
      <div class="search-bar mb-4">
        <Input
          v-model="keyword"
          :placeholder="$t('trade.shipment.modal.searchOrderPlaceholder')"
          class="mr-4 w-1/2"
          @keyup.enter="handleSearch"
        />
        <Button type="primary" @click="handleSearch" :loading="searchLoading">
          {{ $t('ui.action.search') }}
        </Button>
      </div>

      <div class="selected-list mb-4" v-if="selectedOrders.length > 0">
        <div class="mb-2 text-sm text-gray-600">
          {{ $t('trade.shipment.modal.selectedOrders') }}:
          {{ selectedOrders.length }}
        </div>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="order in selectedOrders"
            :key="order.id"
            class="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-600"
          >
            {{ order.no }}
            <Button
              size="small"
              type="text"
              class="ml-1"
              @click="handleSelect(order)"
              >×
            </Button>
          </span>
        </div>
      </div>

      <Spin :spinning="searchLoading">
        <Table
          :columns="tableColumns"
          :data-source="orderList"
          row-key="id"
          :pagination="false"
          :row-selection="{
            type: 'checkbox',
            selectedRowKeys: selectedOrders.map((o) => o.id),
            onChange: handleSelectionChange,
          }"
          @row-click="
            (record: OrderShipmentApi.OrderSearchItem) => handleSelect(record)
          "
        />
      </Spin>
    </div>
  </Modal>
</template>

<style scoped>
.order-selector {
  padding: 8px;
}
</style>
