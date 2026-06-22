<script lang="ts" setup>
import type {
  OrderShipmentApi,
  OrderShipmentEventApi,
} from '#/api/mall/trade/orderShipment/types';

import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { Page, useVbenModal } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';

import { Descriptions, message, Space, Tag, Timeline } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  getShipment,
  getShipmentEventList,
} from '#/api/mall/trade/orderShipment';
import { $t } from '#/locales';

import { getShipmentStatusOptions, getShipmentTypeOptions } from '../data';
import EventForm from '../modules/event-form.vue';
import ShipmentForm from '../modules/shipment-form.vue';
import StatusForm from '../modules/status-form.vue';
import { usePackingListColumns } from './data';

const { back } = useRouter();
const route = useRoute();

const shipmentId = computed(() => {
  const id = Number(route.params.id);
  if (Number.isNaN(id) || id <= 0) {
    message.error($t('trade.shipment.message.invalidId'));
    setTimeout(() => back(), 100);
    return null;
  }
  return id;
});

const shipmentDetail = ref<null | OrderShipmentApi.Detail>(null);
const eventList = ref<OrderShipmentEventApi.Detail[]>([]);
const loading = ref(false);

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

/** 获取发货单详情 */
async function fetchShipmentDetail() {
  if (!shipmentId.value) return;
  loading.value = true;
  try {
    const data = await getShipment(shipmentId.value);
    shipmentDetail.value = data;
  } catch (error) {
    message.error($t('trade.shipment.message.fetchDetailFailed'));
    console.error(error);
  } finally {
    loading.value = false;
  }
}

/** 获取事件列表 */
async function fetchEventList() {
  if (!shipmentId.value) return;
  try {
    const data = await getShipmentEventList(shipmentId.value);
    eventList.value = data || [];
  } catch (error) {
    message.error($t('trade.shipment.message.fetchEventFailed'));
    console.error(error);
  }
}

/** 编辑 */
function handleEdit() {
  if (shipmentDetail.value) {
    shipmentFormModalApi.setData(shipmentDetail.value).open();
  }
}

/** 添加事件 */
function handleAddEvent() {
  eventFormModalApi.setData({ shipmentId: shipmentId.value }).open();
}

/** 更新状态 */
function handleUpdateStatus() {
  if (shipmentDetail.value) {
    statusFormModalApi.setData(shipmentDetail.value).open();
  }
}

const [registerGrid] = useVbenVxeGrid({
  gridOptions: {
    columns: usePackingListColumns(),
    showOverflow: 'tooltip',
  },
});

onMounted(() => {
  fetchShipmentDetail();
  fetchEventList();
});
</script>

<template>
  <Page :loading="loading">
    <template #pageHeaderExtra>
      <Space>
        <Button @click="back">
          <template #icon>
            <IconifyIcon icon="icon-park-outline:back" class="mr-4px" />
          </template>
          {{ $t('trade.shipment.action.back') }}
        </Button>
        <Button
          v-if="
            shipmentDetail &&
            shipmentDetail.status !== 0 &&
            shipmentDetail.status !== 80
          "
          type="primary"
          @click="handleUpdateStatus"
        >
          <template #icon>
            <IconifyIcon icon="icon-park-outline:refresh" class="mr-4px" />
          </template>
          {{ $t('trade.shipment.action.updateStatus') }}
        </Button>
        <Button type="primary" @click="handleEdit">
          <template #icon>
            <IconifyIcon icon="icon-park-outline:edit" class="mr-4px" />
          </template>
          {{ $t('trade.shipment.action.edit') }}
        </Button>
        <Button type="primary" @click="handleAddEvent">
          <template #icon>
            <IconifyIcon icon="icon-park-outline:plus" class="mr-4px" />
          </template>
          {{ $t('trade.shipment.action.addEvent') }}
        </Button>
      </Space>
    </template>

    <!-- 发货单信息 -->
    <a-card :title="$t('trade.shipment.detail.title')" class="mb-4">
      <template #extra v-if="shipmentDetail?.status !== undefined">
        <Tag>
          {{
            getShipmentStatusOptions().find(
              (item) => item.value === shipmentDetail?.status,
            )?.label || '-'
          }}
        </Tag>
      </template>
      <Descriptions :column="4" bordered size="small">
        <Descriptions.Item :label="$t('trade.shipment.grid.shipmentNo')">
          {{ shipmentDetail?.shipmentNo || '-' }}
        </Descriptions.Item>
        <Descriptions.Item :label="$t('trade.shipment.grid.orderNo')">
          {{ shipmentDetail?.orderNo || '-' }}
        </Descriptions.Item>
        <Descriptions.Item :label="$t('trade.shipment.grid.shipmentType')">
          {{
            getShipmentTypeOptions().find(
              (item) => item.value === shipmentDetail?.shipmentType,
            )?.label || '-'
          }}
        </Descriptions.Item>
        <Descriptions.Item :label="$t('trade.shipment.grid.createTime')">
          {{ shipmentDetail?.createTime || '-' }}
        </Descriptions.Item>
        <Descriptions.Item :label="$t('trade.shipment.grid.loadingPort')">
          {{ shipmentDetail?.loadingPort || '-' }}
        </Descriptions.Item>
        <Descriptions.Item :label="$t('trade.shipment.grid.dischargePort')">
          {{ shipmentDetail?.dischargePort || '-' }}
        </Descriptions.Item>
        <Descriptions.Item :label="$t('trade.shipment.grid.carrier')">
          {{ shipmentDetail?.carrier || '-' }}
        </Descriptions.Item>
        <Descriptions.Item :label="$t('trade.shipment.grid.vesselFlight')">
          {{ shipmentDetail?.vesselFlight || '-' }}
        </Descriptions.Item>
        <Descriptions.Item :label="$t('trade.shipment.grid.containerNo')">
          {{ shipmentDetail?.containerNo || '-' }}
        </Descriptions.Item>
        <Descriptions.Item :label="$t('trade.shipment.grid.blNo')">
          {{ shipmentDetail?.blNo || '-' }}
        </Descriptions.Item>
        <Descriptions.Item :label="$t('trade.shipment.grid.etd')">
          {{ shipmentDetail?.etd || '-' }}
        </Descriptions.Item>
        <Descriptions.Item :label="$t('trade.shipment.grid.eta')">
          {{ shipmentDetail?.eta || '-' }}
        </Descriptions.Item>
        <Descriptions.Item :label="$t('trade.shipment.grid.atd')">
          {{ shipmentDetail?.atd || '-' }}
        </Descriptions.Item>
        <Descriptions.Item :label="$t('trade.shipment.grid.ata')">
          {{ shipmentDetail?.ata || '-' }}
        </Descriptions.Item>
        <Descriptions.Item :label="$t('trade.shipment.grid.totalCtns')">
          {{ shipmentDetail?.totalCtns || '-' }}
        </Descriptions.Item>
        <Descriptions.Item :label="$t('trade.shipment.grid.totalNw')">
          {{ shipmentDetail?.totalNw || '-' }}
        </Descriptions.Item>
        <Descriptions.Item :label="$t('trade.shipment.grid.totalGw')">
          {{ shipmentDetail?.totalGw || '-' }}
        </Descriptions.Item>
        <Descriptions.Item :label="$t('trade.shipment.grid.totalCbm')">
          {{ shipmentDetail?.totalCbm || '-' }}
        </Descriptions.Item>
        <Descriptions.Item :label="$t('trade.shipment.form.remark')" :span="3">
          {{ shipmentDetail?.remark || '-' }}
        </Descriptions.Item>
      </Descriptions>
    </a-card>

    <!-- 发货事件时间线 -->
    <a-card :title="$t('trade.shipment.event.title')" class="mb-4">
      <template v-if="eventList.length > 0">
        <Timeline mode="left">
          <Timeline.Item
            v-for="event in eventList"
            :key="event.id"
            :color="event.eventType === 9999 ? 'gray' : 'blue'"
          >
            <template #label>
              <div class="text-right">
                <div class="text-sm font-medium">{{ event.eventTime }}</div>
                <div class="text-xs text-gray-500">
                  {{ event.operatorName || $t('trade.shipment.detail.system') }}
                </div>
              </div>
            </template>
            <div class="font-medium">{{ event.title }}</div>
            <div v-if="event.description" class="mt-1 text-sm text-gray-600">
              {{ event.description }}
            </div>
          </Timeline.Item>
        </Timeline>
      </template>
      <a-empty v-else :description="$t('trade.shipment.detail.noEvents')" />
    </a-card>

    <!-- 装箱清单 -->
    <a-card :title="$t('trade.shipment.detail.packingList')">
      <template #extra>
        <div class="text-sm text-gray-600">
          <span class="mr-4">
            {{ $t('trade.shipment.detail.totalCtns') }}:
            <b>{{ shipmentDetail?.totalCtns || 0 }}</b>
          </span>
          <span class="mr-4">
            {{ $t('trade.shipment.detail.totalNw') }}:
            <b>{{ shipmentDetail?.totalNw || 0 }} kg</b>
          </span>
          <span class="mr-4">
            {{ $t('trade.shipment.detail.totalGw') }}:
            <b>{{ shipmentDetail?.totalGw || 0 }} kg</b>
          </span>
          <span>
            {{ $t('trade.shipment.detail.totalCbm') }}:
            <b>{{ shipmentDetail?.totalCbm || 0 }} CBM</b>
          </span>
        </div>
      </template>
      <VbenVxeGrid
        v-if="shipmentDetail?.items && shipmentDetail.items.length > 0"
        :data="shipmentDetail.items"
        v-bind="registerGrid"
      />
      <a-empty
        v-else
        :description="$t('trade.shipment.detail.noPackingData')"
      />
    </a-card>

    <!-- 弹窗 -->
    <ShipmentFormModal @success="fetchShipmentDetail" />
    <EventFormModal @success="fetchEventList" />
    <StatusFormModal @success="fetchShipmentDetail" />
  </Page>
</template>

<style scoped>
:deep(.ant-timeline-item-label) {
  width: 160px !important;
}
</style>
