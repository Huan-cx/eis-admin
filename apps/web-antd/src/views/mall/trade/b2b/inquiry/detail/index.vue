<script lang="ts" setup>
import type { B2BInquiryApi } from '#/api/mall/trade/b2b/inquiry';

import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { Page } from '@vben/common-ui';
import { useTabs } from '@vben/hooks';
import { formatDateTime } from '@vben/utils';

import { Descriptions, Empty, Tag } from 'ant-design-vue';

import { TableAction } from '#/adapter/vxe-table';
import { getInquiry } from '#/api/mall/trade/b2b/inquiry';
import { $t } from '#/locales';

const route = useRoute();
const router = useRouter();
const tabs = useTabs();

/** 返回列表页 */
function handleBack() {
  tabs.closeCurrentTab();
  router.back();
}

const inquiryDetail = ref<B2BInquiryApi.InquiryDetail | null>(null);
const loading = ref(true);

const getStatusColor = (status: number) => {
  const colors: Record<number, string> = {
    0: 'orange', // 待处理
    1: 'blue', // 已联系
    2: 'green', // 已成交
  };
  return colors[status] || 'default';
};

onMounted(async () => {
  const id = Number(route.params.id);
  loading.value = true;
  try {
    inquiryDetail.value = await getInquiry(id);
  } catch (error) {
    console.error('B2B Inquiry Detail - load error:', error);
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <Page auto-content-height :title="inquiryDetail?.no" :loading="loading">
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

    <div v-if="!loading && !inquiryDetail" class="py-10 text-center">
      <Empty :description="$t('common.empty')" />
    </div>

    <div v-if="inquiryDetail" class="rounded-lg bg-white p-6">
      <h2 class="mb-4 text-xl font-bold">
        {{ $t('trade.b2b.inquiry.detail.title') }}
      </h2>

      <Descriptions
        :column="2"
        size="middle"
        class="mb-6 rounded-lg bg-gray-50 p-4"
      >
        <Descriptions.Item :label="$t('trade.b2b.inquiry.detail.no')">
          {{ inquiryDetail.no }}
        </Descriptions.Item>
        <Descriptions.Item :label="$t('trade.b2b.inquiry.detail.status')">
          <Tag :color="getStatusColor(inquiryDetail.status)">
            {{ inquiryDetail.statusName }}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item :label="$t('trade.b2b.inquiry.detail.userName')">
          {{ inquiryDetail.userName || '-' }}
        </Descriptions.Item>
        <Descriptions.Item :label="$t('trade.b2b.inquiry.detail.email')">
          {{ inquiryDetail.email || '-' }}
        </Descriptions.Item>
        <Descriptions.Item :label="$t('trade.b2b.inquiry.detail.company')">
          {{ inquiryDetail.company || '-' }}
        </Descriptions.Item>
        <Descriptions.Item :label="$t('trade.b2b.inquiry.detail.country')">
          {{ inquiryDetail.country || '-' }}
        </Descriptions.Item>
        <Descriptions.Item :label="$t('trade.b2b.inquiry.detail.budgetAmount')">
          {{
            inquiryDetail.budgetAmount != null
              ? `${inquiryDetail.budgetAmount} ${inquiryDetail.budgetCurrency}`
              : '-'
          }}
        </Descriptions.Item>
        <Descriptions.Item :label="$t('trade.b2b.inquiry.detail.createTime')">
          {{ formatDateTime(inquiryDetail.createTime) || '-' }}
        </Descriptions.Item>
        <Descriptions.Item
          :label="$t('trade.b2b.inquiry.detail.description')"
          :span="2"
        >
          {{ inquiryDetail.description || '-' }}
        </Descriptions.Item>
        <Descriptions.Item
          :label="$t('trade.b2b.inquiry.detail.handleRemark')"
          :span="2"
        >
          {{ inquiryDetail.handleRemark || '-' }}
        </Descriptions.Item>
        <Descriptions.Item
          v-if="inquiryDetail.adPlatform"
          :label="$t('trade.b2b.inquiry.detail.adPlatform')"
        >
          {{ inquiryDetail.adPlatform }}
        </Descriptions.Item>
        <Descriptions.Item
          v-if="inquiryDetail.adClickId"
          :label="$t('trade.b2b.inquiry.detail.adClickId')"
        >
          {{ inquiryDetail.adClickId }}
        </Descriptions.Item>
        <Descriptions.Item
          v-if="inquiryDetail.utmSource"
          :label="$t('trade.b2b.inquiry.detail.utmSource')"
        >
          {{ inquiryDetail.utmSource }}
        </Descriptions.Item>
        <Descriptions.Item
          v-if="inquiryDetail.utmMedium"
          :label="$t('trade.b2b.inquiry.detail.utmMedium')"
        >
          {{ inquiryDetail.utmMedium }}
        </Descriptions.Item>
        <Descriptions.Item
          v-if="inquiryDetail.utmCampaign"
          :label="$t('trade.b2b.inquiry.detail.utmCampaign')"
        >
          {{ inquiryDetail.utmCampaign }}
        </Descriptions.Item>
        <Descriptions.Item
          v-if="inquiryDetail.landingPage"
          :label="$t('trade.b2b.inquiry.detail.landingPage')"
        >
          {{ inquiryDetail.landingPage }}
        </Descriptions.Item>
        <Descriptions.Item
          v-if="inquiryDetail.capturedAt"
          :label="$t('trade.b2b.inquiry.detail.capturedAt')"
        >
          {{ formatDateTime(inquiryDetail.capturedAt) }}
        </Descriptions.Item>
      </Descriptions>
    </div>
  </Page>
</template>
