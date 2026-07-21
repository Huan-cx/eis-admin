<script lang="ts" setup>
import type {
  OrderShipmentApi,
  OrderShipmentEventApi,
} from '#/api/mall/trade/shipment/types';

import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { Page, useVbenModal } from '@vben/common-ui';
import { formatDateTime } from '@vben/utils';

import {
  Button,
  Descriptions,
  message,
  Space,
  Tag,
  Timeline,
} from 'ant-design-vue';
import dayjs from 'dayjs';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getShipment } from '#/api/mall/trade/shipment';
import { $t } from '#/locales';

import EventForm from '../modules/event-form.vue';
import StatusForm from '../modules/status-form.vue';
import { usePackingListColumns } from './data';

const { back, push } = useRouter();
const route = useRoute();

const shipmentId = ref<null | number>(null);
const shipmentDetail = ref<null | OrderShipmentApi.Detail>(null);
const eventList = ref<OrderShipmentEventApi.Detail[]>([]);
const loading = ref(false);

const [StatusFormModal, statusFormModalApi] = useVbenModal({
  connectedComponent: StatusForm,
  destroyOnClose: true,
});

const [EventFormModal, eventFormModalApi] = useVbenModal({
  connectedComponent: EventForm,
  destroyOnClose: true,
});

async function fetchShipmentDetail() {
  const id = Number(route.params.id);
  if (Number.isNaN(id) || id <= 0) {
    message.error($t('trade.shipment.message.invalidId'));
    setTimeout(() => back(), 100);
    return;
  }
  shipmentId.value = id;
  loading.value = true;
  try {
    const data = await getShipment(shipmentId.value);
    shipmentDetail.value = data;
    eventList.value = data.events || [];
  } catch (error) {
    message.error($t('trade.shipment.message.fetchDetailFailed'));
    console.error(error);
  } finally {
    loading.value = false;
  }
}

function handleEdit() {
  push({ name: 'TradeShipmentEdit', params: { id: shipmentId.value } });
}

function handleAddEvent() {
  if (!shipmentDetail.value) return;
  eventFormModalApi.setData({ shipmentId: shipmentDetail.value.id }).open();
}

function handleUpdateStatus() {
  if (!shipmentDetail.value) return;
  statusFormModalApi.setData(shipmentDetail.value).open();
}

function canUpdateStatus() {
  return (
    shipmentDetail.value &&
    shipmentDetail.value.status !== 0 &&
    shipmentDetail.value.status !== 80
  );
}

const sortedEventList = computed<OrderShipmentEventApi.Detail[]>(() => {
  if (!eventList.value || eventList.value.length === 0) {
    return [];
  }
  return [...eventList.value].toSorted((a, b) => {
    const ta = a.eventTime ? dayjs(a.eventTime).valueOf() : 0;
    const tb = b.eventTime ? dayjs(b.eventTime).valueOf() : 0;
    if (tb !== ta) {
      return tb - ta;
    }
    return (b.id || 0) - (a.id || 0);
  });
});

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: usePackingListColumns(),
    data: [],
    minHeight: 200,
    height: 'auto',
    keepSource: true,
    border: true,
    rowConfig: { keyField: 'orderItemId', isHover: true },
    pagerConfig: {
      enabled: false,
    },
    toolbarConfig: {
      enabled: false,
    },
  } as any,
});

onMounted(() => {
  fetchShipmentDetail();
});

watch(
  () => shipmentDetail.value?.items,
  async (items) => {
    if (!items || items.length === 0) {
      await nextTick();
      await gridApi.grid?.reloadData([]);
      return;
    }
    await nextTick();
    await gridApi.grid?.reloadData(items);
  },
  { deep: true, immediate: true },
);
</script>

<template>
  <Page auto-content-height :loading="loading">
    <StatusFormModal @success="fetchShipmentDetail" />
    <EventFormModal @success="fetchShipmentDetail" />

    <div v-if="shipmentDetail" class="space-y-4">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-xl font-bold">{{ shipmentDetail.shipmentNo }}</h2>
          <div class="mt-1 text-sm text-gray-500">
            {{ $t('trade.shipment.detail.orderNos') }}:
            {{ (shipmentDetail.orderNos || []).join(', ') }}
          </div>
        </div>
        <Space>
          <Button @click="handleEdit">{{ $t('common.edit') }}</Button>
          <Button
            type="primary"
            v-if="canUpdateStatus()"
            @click="handleUpdateStatus"
          >
            {{ $t('trade.shipment.action.updateStatus') }}
          </Button>
          <Button @click="handleAddEvent">
            {{ $t('trade.shipment.action.addEvent') }}
          </Button>
          <Button @click="back">{{ $t('common.back') }}</Button>
        </Space>
      </div>

      <a-card :title="$t('trade.shipment.detail.basicInfo')">
        <Descriptions :column="4" bordered>
          <Descriptions.Item :label="$t('trade.shipment.grid.status')">
            <Tag :color="shipmentDetail.status === 80 ? 'green' : 'blue'">
              {{ shipmentDetail.statusName }}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item :label="$t('trade.shipment.grid.shipmentType')">
            {{ shipmentDetail.shipmentTypeName }}
          </Descriptions.Item>
          <Descriptions.Item :label="$t('trade.shipment.grid.loadingPort')">
            {{ shipmentDetail.loadingPort || '-' }}
          </Descriptions.Item>
          <Descriptions.Item :label="$t('trade.shipment.grid.dischargePort')">
            {{ shipmentDetail.dischargePort || '-' }}
          </Descriptions.Item>
          <Descriptions.Item :label="$t('trade.shipment.grid.carrier')">
            {{ shipmentDetail.carrier || '-' }}
          </Descriptions.Item>
          <Descriptions.Item :label="$t('trade.shipment.grid.vesselFlight')">
            {{ shipmentDetail.vesselFlight || '-' }}
          </Descriptions.Item>
          <Descriptions.Item :label="$t('trade.shipment.grid.containerNo')">
            {{ shipmentDetail.containerNo || '-' }}
          </Descriptions.Item>
          <Descriptions.Item :label="$t('trade.shipment.grid.blNo')">
            {{ shipmentDetail.blNo || '-' }}
          </Descriptions.Item>
          <Descriptions.Item :label="$t('trade.shipment.grid.logisticsName')">
            {{ shipmentDetail.logisticsName || '-' }}
          </Descriptions.Item>
          <Descriptions.Item :label="$t('trade.shipment.grid.trackingNo')">
            {{ shipmentDetail.trackingNo || '-' }}
          </Descriptions.Item>
          <Descriptions.Item :label="$t('trade.shipment.detail.totalCtns')">
            {{ shipmentDetail.totalCtns || 0 }}
          </Descriptions.Item>
          <Descriptions.Item :label="$t('trade.shipment.grid.createTime')">
            {{ formatDateTime(shipmentDetail.createTime) || '-' }}
          </Descriptions.Item>
          <Descriptions.Item :label="$t('trade.shipment.detail.totalNw')">
            {{ shipmentDetail.totalNw || 0 }} kg
          </Descriptions.Item>
          <Descriptions.Item :label="$t('trade.shipment.detail.totalGw')">
            {{ shipmentDetail.totalGw || 0 }} kg
          </Descriptions.Item>
          <Descriptions.Item :label="$t('trade.shipment.detail.totalCbm')">
            {{ shipmentDetail.totalCbm || 0 }} CBM
          </Descriptions.Item>
          <Descriptions.Item :label="$t('trade.shipment.form.remark')">
            {{ shipmentDetail.remark || '-' }}
          </Descriptions.Item>
        </Descriptions>
      </a-card>

      <a-card :title="$t('trade.shipment.event.title')">
        <template v-if="sortedEventList.length > 0">
          <Timeline mode="left">
            <Timeline.Item
              v-for="event in sortedEventList"
              :key="event.id"
              :color="event.eventType === 9999 ? 'gray' : 'blue'"
            >
              <template #label>
                <div class="text-right">
                  <div class="text-sm font-medium">
                    {{ formatDateTime(event.eventTime) }}
                  </div>
                  <div class="text-xs text-gray-500">
                    {{
                      event.operatorName || $t('trade.shipment.detail.system')
                    }}
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

      <a-card :title="$t('trade.shipment.detail.packingList')">
        <template #extra>
          <div class="text-sm text-gray-600">
            <span class="mr-4">
              {{ $t('trade.shipment.detail.totalCtns') }}:
              <b>{{ shipmentDetail.totalCtns || 0 }}</b>
            </span>
            <span class="mr-4">
              {{ $t('trade.shipment.detail.totalNw') }}:
              <b>{{ shipmentDetail.totalNw || 0 }} kg</b>
            </span>
            <span class="mr-4">
              {{ $t('trade.shipment.detail.totalGw') }}:
              <b>{{ shipmentDetail.totalGw || 0 }} kg</b>
            </span>
            <span>
              {{ $t('trade.shipment.detail.totalCbm') }}:
              <b>{{ shipmentDetail.totalCbm || 0 }} CBM</b>
            </span>
          </div>
        </template>
        <Grid />
        <a-empty
          v-if="!shipmentDetail.items || shipmentDetail.items.length === 0"
          :description="$t('trade.shipment.detail.noPackingData')"
        />
      </a-card>
    </div>
  </Page>
</template>
