<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { Page } from '@vben/common-ui';

import { Image, List, Tag } from 'ant-design-vue';

import { getRfq } from '#/api/mall/trade/b2b/rfq';
import { $t } from '#/locales';

const route = useRoute();
const { back } = useRouter();

const rfqDetail = ref<any>(null);

onMounted(async () => {
  const id = Number(route.params.id);
  rfqDetail.value = await getRfq(id);
});
</script>

<template>
  <Page auto-content-height>
    <template #header>
      <button @click="back" class="mr-2">{{ $t('common.back') }}</button>
    </template>

    <div v-if="rfqDetail" class="rounded-lg bg-white p-6">
      <div class="mb-6">
        <h2 class="mb-4 text-xl font-bold">
          {{ $t('trade.b2b.rfq.detail.title') }}
        </h2>

        <a-descriptions
          :column="2"
          size="middle"
          class="rounded-lg bg-gray-50 p-4"
        >
          <a-descriptions-item :label="$t('trade.b2b.rfq.detail.no')">
            {{ rfqDetail.no }}
          </a-descriptions-item>
          <a-descriptions-item :label="$t('trade.b2b.rfq.detail.status')">
            <a-tag
              :color="
                rfqDetail.status === 0
                  ? 'orange'
                  : rfqDetail.status === 10
                    ? 'blue'
                    : rfqDetail.status === 20
                      ? 'green'
                      : rfqDetail.status === 30
                        ? 'purple'
                        : 'red'
              "
            >
              {{ rfqDetail.statusName }}
            </a-tag>
          </a-descriptions-item>
          <a-descriptions-item :label="$t('trade.b2b.rfq.detail.userName')">
            {{ rfqDetail.userName || '-' }}
          </a-descriptions-item>
          <a-descriptions-item :label="$t('trade.b2b.rfq.detail.supplierName')">
            {{ rfqDetail.supplierName || '-' }}
          </a-descriptions-item>
          <a-descriptions-item
            :label="$t('trade.b2b.rfq.detail.requirement')"
            :span="2"
          >
            {{ rfqDetail.requirement || '-' }}
          </a-descriptions-item>
          <a-descriptions-item :label="$t('trade.b2b.rfq.detail.validUntil')">
            {{ rfqDetail.validUntil || '-' }}
          </a-descriptions-item>
          <a-descriptions-item :label="$t('trade.b2b.rfq.detail.submittedAt')">
            {{ rfqDetail.submittedAt || '-' }}
          </a-descriptions-item>
          <a-descriptions-item :label="$t('trade.b2b.rfq.detail.createdAt')">
            {{ rfqDetail.createdAt || '-' }}
          </a-descriptions-item>
        </a-descriptions>
      </div>

      <div>
        <h3 class="mb-4 text-lg font-semibold">
          {{ $t('trade.b2b.rfq.detail.items') }}
        </h3>
        <List item-layout="vertical" :data-source="rfqDetail.items">
          <template #renderItem="{ item }">
            <List.Item>
              <List.Item.Meta>
                <template #title>
                  {{ item.productName }}
                  <Tag color="blue" v-if="item.skuName">{{ item.skuName }}</Tag>
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
                      {{ item.expectedPrice }}
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
      </div>
    </div>
  </Page>
</template>
