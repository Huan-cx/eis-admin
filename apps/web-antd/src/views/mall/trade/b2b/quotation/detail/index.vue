<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { Page } from '@vben/common-ui';

import { Image, List, Tag } from 'ant-design-vue';

import { getQuotation } from '#/api/mall/trade/b2b/quotation';
import { $t } from '#/locales';

const route = useRoute();
const { back } = useRouter();

const quotationDetail = ref<any>(null);

onMounted(async () => {
  const id = Number(route.params.id);
  quotationDetail.value = await getQuotation(id);
});
</script>

<template>
  <Page auto-content-height>
    <template #header>
      <button @click="back" class="mr-2">{{ $t('common.back') }}</button>
    </template>

    <div v-if="quotationDetail" class="rounded-lg bg-white p-6">
      <div class="mb-6">
        <h2 class="mb-4 text-xl font-bold">
          {{ $t('trade.b2b.quotation.detail.title') }}
        </h2>

        <a-descriptions
          :column="2"
          size="middle"
          class="rounded-lg bg-gray-50 p-4"
        >
          <a-descriptions-item :label="$t('trade.b2b.quotation.detail.no')">
            {{ quotationDetail.no }}
          </a-descriptions-item>
          <a-descriptions-item :label="$t('trade.b2b.quotation.detail.rfqNo')">
            {{ quotationDetail.rfqNo }}
          </a-descriptions-item>
          <a-descriptions-item :label="$t('trade.b2b.quotation.detail.status')">
            <a-tag
              :color="
                quotationDetail.status === 0
                  ? 'orange'
                  : quotationDetail.status === 10
                    ? 'blue'
                    : quotationDetail.status === 20
                      ? 'green'
                      : quotationDetail.status === 30
                        ? 'red'
                        : 'gray'
              "
            >
              {{ quotationDetail.statusName }}
            </a-tag>
          </a-descriptions-item>
          <a-descriptions-item
            :label="$t('trade.b2b.quotation.detail.supplierName')"
          >
            {{ quotationDetail.supplierName || '-' }}
          </a-descriptions-item>
          <a-descriptions-item
            :label="$t('trade.b2b.quotation.detail.totalPrice')"
          >
            {{ quotationDetail.totalPrice }} {{ quotationDetail.currency }}
          </a-descriptions-item>
          <a-descriptions-item
            :label="$t('trade.b2b.quotation.detail.currency')"
          >
            {{ quotationDetail.currency }}
          </a-descriptions-item>
          <a-descriptions-item
            :label="$t('trade.b2b.quotation.detail.incoterms')"
          >
            {{ quotationDetail.incoterms || '-' }}
          </a-descriptions-item>
          <a-descriptions-item
            :label="$t('trade.b2b.quotation.detail.validUntil')"
          >
            {{ quotationDetail.validUntil || '-' }}
          </a-descriptions-item>
          <a-descriptions-item
            :label="$t('trade.b2b.quotation.detail.remark')"
            :span="2"
          >
            {{ quotationDetail.remark || '-' }}
          </a-descriptions-item>
          <a-descriptions-item
            :label="$t('trade.b2b.quotation.detail.createdAt')"
          >
            {{ quotationDetail.createdAt }}
          </a-descriptions-item>
        </a-descriptions>
      </div>

      <div>
        <h3 class="mb-4 text-lg font-semibold">
          {{ $t('trade.b2b.quotation.detail.items') }}
        </h3>
        <List item-layout="vertical" :data-source="quotationDetail.items">
          <template #renderItem="{ item }">
            <List.Item>
              <List.Item.Meta>
                <template #title>
                  {{ item.spuName }}
                  <Tag color="blue" v-if="item.skuName">{{ item.skuName }}</Tag>
                </template>
                <template #avatar>
                  <Image :src="item.picUrl" :width="60" :height="60" />
                </template>
                <template #description>
                  <div class="flex flex-wrap gap-4">
                    <span>
                      {{ $t('trade.b2b.quotation.detail.count') }}:
                      {{ item.count }}
                    </span>
                    <span>
                      {{ $t('trade.b2b.quotation.detail.unitPrice') }}:
                      {{ item.unitPrice }} {{ quotationDetail.currency }}
                    </span>
                    <span>
                      {{ $t('trade.b2b.quotation.detail.subtotal') }}:
                      {{ item.totalPrice }} {{ quotationDetail.currency }}
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
