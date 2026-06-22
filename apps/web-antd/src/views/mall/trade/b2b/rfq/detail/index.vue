<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { Page } from '@vben/common-ui';
import { useTabs } from '@vben/hooks';
import { fenToYuan, formatDateTime } from '@vben/utils';

import {
  Button,
  Card,
  Descriptions,
  Empty,
  Image,
  List,
  Space,
  Tabs,
  Tag,
} from 'ant-design-vue';

import { TableAction } from '#/adapter/vxe-table';
import {
  getFinalQuotation,
  getQuotationPage,
} from '#/api/mall/trade/b2b/quotation';
import { getRfq } from '#/api/mall/trade/b2b/rfq';
import { $t } from '#/locales';

const finalQuotation = ref<any>(null);
const loadingFinalQuotation = ref(false);

const loadFinalQuotation = async () => {
  if (!rfqDetail.value?.id) return;
  loadingFinalQuotation.value = true;
  try {
    finalQuotation.value = await getFinalQuotation(rfqDetail.value.id);
  } catch (error) {
    console.error('Load final quotation failed:', error);
    finalQuotation.value = null;
  } finally {
    loadingFinalQuotation.value = false;
  }
};

const route = useRoute();
const router = useRouter();
const tabs = useTabs();

/** 返回列表页 */
function handleBack() {
  tabs.closeCurrentTab();
  router.back();
}

const rfqDetail = ref<any>(null);
const quotations = ref<any[]>([]);
const loadingQuotations = ref(false);
const loading = ref(true);

const activeTab = ref('basic');

onMounted(async () => {
  const id = Number(route.params.id);
  loading.value = true;
  try {
    rfqDetail.value = await getRfq(id);
    loadQuotations();
    loadFinalQuotation();
  } catch (error) {
    console.error('RFQ Detail - load error:', error);
  } finally {
    loading.value = false;
  }
});

const loadQuotations = async () => {
  if (!rfqDetail.value?.id) return;
  loadingQuotations.value = true;
  try {
    const result = await getQuotationPage({
      pageNo: 1,
      pageSize: 100,
      rfqId: rfqDetail.value.id,
    } as any);
    quotations.value = result.list || [];
  } catch (error) {
    console.error($t('trade.b2b.quotation.actionMessage.loadFailed'), error);
  } finally {
    loadingQuotations.value = false;
  }
};

const goToCompare = () => {
  router.push({
    path: '/mall/trade/b2b/compare',
    query: { rfqId: rfqDetail.value?.id },
  });
};

const openQuoteForm = () => {
  router.push({
    name: 'TradeB2BQuotationFormPage',
    query: { rfqId: rfqDetail.value?.id },
  });
};

function handleViewQuotation(item: any) {
  router.push({
    name: 'TradeB2BQuotationDetailPage',
    params: { id: item.quotationId },
  });
}

function handleEditQuotation(item: any) {
  router.push({
    name: 'TradeB2BQuotationEditPage',
    params: { id: item.quotationId },
  });
}

const getStatusColor = (status: number) => {
  const colors: Record<number, string> = {
    0: 'orange', // 草稿
    10: 'blue', // 待报价
    15: 'cyan', // 处理中
    20: 'green', // 已报价
    30: 'purple', // 已接受
    40: 'blue', // 已下单
    50: 'success', // 已完成
    99: 'red', // 已拒绝
  };
  return colors[status] || 'default';
};
</script>

<template>
  <Page auto-content-height :title="rfqDetail?.no" :loading="loading">
    <template #extra>
      <TableAction
        :actions="[
          {
            label: $t('common.back'),
            type: 'default',
            icon: 'lucide:arrow-left',
            onClick: handleBack,
          },
        ]"
      />
    </template>

    <div v-if="!loading && !rfqDetail" class="py-10 text-center">
      <Empty :description="$t('common.empty')" />
    </div>

    <div v-if="rfqDetail" class="rounded-lg bg-white p-6">
      <h2 class="mb-4 text-xl font-bold">
        {{ $t('trade.b2b.rfq.detail.title') }}
      </h2>

      <Descriptions
        :column="2"
        size="middle"
        class="mb-6 rounded-lg bg-gray-50 p-4"
      >
        <Descriptions.Item :label="$t('trade.b2b.rfq.detail.no')">
          {{ rfqDetail.no }}
        </Descriptions.Item>
        <Descriptions.Item :label="$t('trade.b2b.rfq.detail.status')">
          <Tag :color="getStatusColor(rfqDetail.status)">
            {{ rfqDetail.statusName }}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item :label="$t('trade.b2b.rfq.detail.userName')">
          {{ rfqDetail.userName || '-' }}
        </Descriptions.Item>
        <Descriptions.Item :label="$t('trade.b2b.rfq.detail.supplierName')">
          {{ rfqDetail.supplierName || '-' }}
        </Descriptions.Item>
        <Descriptions.Item :label="$t('trade.b2b.rfq.detail.contactName')">
          {{ rfqDetail.contactName || '-' }}
        </Descriptions.Item>
        <Descriptions.Item :label="$t('trade.b2b.rfq.detail.email')">
          {{ rfqDetail.email || '-' }}
        </Descriptions.Item>
        <Descriptions.Item :label="$t('trade.b2b.rfq.grid.incoterms')">
          <span v-if="rfqDetail.incoterms">
            {{ rfqDetail.incoterms }}
            <span class="ml-2 text-xs text-gray-400">
              ({{
                $t(`trade.b2b.rfq.incotermsOptions.${rfqDetail.incoterms}`)
              }})
            </span>
          </span>
          <span v-else>-</span>
        </Descriptions.Item>
        <Descriptions.Item :label="$t('trade.b2b.rfq.grid.deliveryPort')">
          {{ rfqDetail.deliveryPort || '-' }}
        </Descriptions.Item>
        <!-- 期望交货：根据类型展示 -->
        <Descriptions.Item
          v-if="rfqDetail.expectedDeliveryType === 'CUSTOM_DATE'"
          :label="$t('trade.b2b.rfq.grid.expectedDeliveryDate')"
        >
          {{ rfqDetail.expectedDeliveryDate || '-' }}
        </Descriptions.Item>
        <Descriptions.Item
          v-else-if="rfqDetail.expectedDeliveryType"
          :label="$t('trade.b2b.rfq.grid.expectedDeliveryDate')"
        >
          {{
            $t(
              `trade.b2b.rfq.expectedDeliveryTypeOptions.${rfqDetail.expectedDeliveryType}`,
            )
          }}
        </Descriptions.Item>
        <Descriptions.Item
          v-else
          :label="$t('trade.b2b.rfq.grid.expectedDeliveryDate')"
        >
          -
        </Descriptions.Item>
        <Descriptions.Item :label="$t('trade.b2b.rfq.detail.targetCurrency')">
          {{ rfqDetail.targetCurrency || '-' }}
        </Descriptions.Item>
        <Descriptions.Item
          :label="$t('trade.b2b.rfq.detail.requirement')"
          :span="2"
        >
          {{ rfqDetail.requirement || '-' }}
        </Descriptions.Item>
        <Descriptions.Item :label="$t('trade.b2b.rfq.detail.validUntil')">
          {{ formatDateTime(rfqDetail.validUntil) || '-' }}
        </Descriptions.Item>
        <Descriptions.Item :label="$t('trade.b2b.rfq.detail.submittedAt')">
          {{ formatDateTime(rfqDetail.submittedAt) || '-' }}
        </Descriptions.Item>
        <Descriptions.Item :label="$t('trade.b2b.rfq.detail.createdAt')">
          {{ formatDateTime(rfqDetail.createTime) || '-' }}
        </Descriptions.Item>
      </Descriptions>

      <Tabs v-model:active-key="activeTab">
        <!-- Tab 1: 商品列表 -->
        <Tabs.TabPane key="basic" :tab="$t('trade.b2b.rfqDetail.rfqProducts')">
          <List item-layout="vertical" :data-source="rfqDetail?.items || []">
            <template #renderItem="{ item }">
              <List.Item>
                <List.Item.Meta>
                  <template #title>
                    {{ item.productName }}
                    <Tag color="blue" v-if="item.skuName">
                      {{ item.skuName }}
                    </Tag>
                  </template>
                  <template #avatar>
                    <Image :src="item.imageUrl" :width="60" :height="60" />
                  </template>
                  <template #description>
                    <div class="flex flex-wrap gap-4">
                      <span>
                        {{ $t('trade.b2b.rfq.detail.quantity') }}:
                        {{ item.count }}
                      </span>
                      <span>
                        {{ $t('trade.b2b.rfq.detail.expectedPrice') }}:
                        {{ fenToYuan(item.expectedPrice) }}
                        {{ $t('common.yuan') }}
                      </span>
                      <span v-if="item.specifications">
                        {{ $t('trade.b2b.rfq.detail.specifications') }}:
                        {{ item.specifications }}
                      </span>
                      <span v-if="item.unit">
                        {{ $t('trade.b2b.rfq.detail.unit') }}:
                        {{ item.unit }}
                      </span>
                      <span v-if="item.brand">
                        {{ $t('trade.b2b.rfq.detail.brand') }}:
                        {{ item.brand }}
                      </span>
                    </div>
                  </template>
                </List.Item.Meta>
              </List.Item>
            </template>
          </List>
        </Tabs.TabPane>

        <!-- Tab 2: 报价列表 -->
        <Tabs.TabPane
          key="quotations"
          :tab="$t('trade.b2b.rfqDetail.quotationList')"
        >
          <div class="mb-4 flex justify-end" v-if="rfqDetail?.status !== 35">
            <Space>
              <Button type="primary" @click="openQuoteForm">
                {{ $t('trade.b2b.rfqDetail.createQuotation') }}
              </Button>
              <Button
                type="primary"
                :disabled="quotations.length < 1"
                @click="goToCompare"
              >
                {{ $t('trade.b2b.compare.index.title') }}
              </Button>
            </Space>
          </div>

          <List item-layout="horizontal" :data-source="quotations">
            <template #renderItem="{ item }">
              <List.Item>
                <List.Item.Meta>
                  <template #title>
                    <div class="flex items-center gap-2">
                      <span>{{ item.supplierName }}</span>
                      <Tag :color="getStatusColor(item.status)">
                        {{ item.statusName }}
                      </Tag>
                    </div>
                  </template>
                  <template #description>
                    <div class="text-sm text-gray-500">
                      <span class="mr-4">
                        {{ $t('trade.b2b.quotation.detail.no') }}:
                        {{ item.no }}
                      </span>
                      <span class="mr-4">
                        {{ $t('trade.b2b.quotation.detail.currency') }}:
                        {{ item.currency }}
                      </span>
                      <span class="mr-4">
                        {{ $t('trade.b2b.quotation.detail.totalPrice') }}: ¥{{
                          fenToYuan(item.totalPrice ?? 0)
                        }}
                      </span>
                      <span>
                        {{ $t('common.createTime') }}:
                        {{ formatDateTime(item.createdAt) }}
                      </span>
                    </div>
                  </template>
                </List.Item.Meta>
                <div class="flex gap-2">
                  <Button type="link" @click="handleViewQuotation(item)">
                    {{ $t('common.detail') }}
                  </Button>
                  <Button
                    v-if="item.status === 0"
                    type="link"
                    @click="handleEditQuotation(item)"
                  >
                    {{ $t('common.edit') }}
                  </Button>
                </div>
              </List.Item>
            </template>
          </List>

          <div
            v-if="quotations.length === 0"
            class="py-10 text-center text-gray-500"
          >
            {{ $t('trade.b2b.rfqDetail.noQuotationTip') }}
          </div>
        </Tabs.TabPane>

        <!-- Tab 3: 比价结果 -->
        <Tabs.TabPane
          key="compareResult"
          :tab="$t('trade.b2b.rfqDetail.compareResult')"
        >
          <div v-if="loadingFinalQuotation" class="py-10 text-center">
            <span class="loading">Loading...</span>
          </div>
          <div
            v-else-if="!finalQuotation"
            class="py-10 text-center text-gray-500"
          >
            {{ $t('trade.b2b.rfqDetail.noFinalQuotation') }}
          </div>
          <div v-else>
            <Card class="mb-4">
              <Descriptions :column="2" bordered size="small">
                <Descriptions.Item :label="$t('trade.b2b.rfq.detail.no')">
                  {{ rfqDetail.no }}
                </Descriptions.Item>
                <Descriptions.Item
                  :label="$t('trade.b2b.quotation.detail.totalPrice')"
                >
                  ¥{{ fenToYuan(finalQuotation.totalPrice ?? 0) }}
                </Descriptions.Item>
              </Descriptions>
            </Card>
            <List
              item-layout="vertical"
              :data-source="finalQuotation.items || []"
            >
              <template #renderItem="{ item }">
                <List.Item>
                  <List.Item.Meta>
                    <template #title>
                      {{ item.spuName || item.productName }}
                      <Tag color="blue" v-if="item.skuName">
                        {{ item.skuName }}
                      </Tag>
                    </template>
                    <template #avatar>
                      <Image
                        :src="item.picUrl || item.imageUrl"
                        :width="60"
                        :height="60"
                      />
                    </template>
                    <template #description>
                      <div class="flex flex-wrap gap-4">
                        <span>
                          {{ $t('trade.b2b.quotation.detail.count') }}:
                          {{ item.count }}
                        </span>
                        <span>
                          {{ $t('trade.b2b.quotation.detail.supplierPrice') }}: ¥{{
                            fenToYuan(item.supplierPrice ?? 0)
                          }}
                        </span>
                        <span v-if="item.supplierName">
                          {{ $t('trade.b2b.rfq.detail.supplierName') }}:
                          {{ item.supplierName }}
                        </span>
                      </div>
                    </template>
                  </List.Item.Meta>
                </List.Item>
              </template>
            </List>
          </div>
        </Tabs.TabPane>
      </Tabs>
    </div>
  </Page>
</template>
