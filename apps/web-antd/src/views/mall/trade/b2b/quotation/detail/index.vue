<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { Page, useVbenModal } from '@vben/common-ui';
import { B2BQuotationStatusEnum } from '@vben/constants';
import { useTabs } from '@vben/hooks';
import { fenToYuan, formatDateTime } from '@vben/utils';

import { Descriptions, Image, Input, List, message, Tag } from 'ant-design-vue';

import {
  approveQuotation,
  getQuotation,
  rejectQuotationByAdmin,
  submitQuotationForReview,
} from '#/api/mall/trade/b2b/quotation';
import { TableAction } from '#/components/table-action';
import { $t } from '#/locales';

const route = useRoute();
const router = useRouter();
const tabs = useTabs();

const quotationDetail = ref<any>(null);
const loading = ref(true);

// 计算剩余有效天数
function getRemainingDays(validUntil?: number): string {
  if (!validUntil) return '-';
  const now = Date.now();
  const diff = validUntil - now;
  if (diff <= 0) return '已过期';
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  return `${days} 天`;
}

// 审核相关
const auditRemark = ref('');

/** 返回列表页 */
function handleBack() {
  tabs.closeCurrentTab();
  router.push({ name: 'TradeB2BQuotation' });
}

const [ApproveModal, approveModalApi] = useVbenModal({
  title: $t('trade.b2b.quotation.actions.approve'),
  async onConfirm() {
    if (!quotationDetail.value?.id) {
      message.error($t('trade.b2b.quotation.actionMessage.loadFailed'));
      return;
    }
    loading.value = true;
    try {
      await approveQuotation(quotationDetail.value.id, auditRemark.value);
      message.success($t('trade.b2b.quotation.actionMessage.approveSuccess'));
      approveModalApi.close();
      loadDetail();
    } finally {
      loading.value = false;
      auditRemark.value = '';
    }
  },
});

const [RejectModal, rejectModalApi] = useVbenModal({
  title: $t('trade.b2b.quotation.actions.reject'),
  async onConfirm() {
    if (!quotationDetail.value?.id) {
      message.error($t('trade.b2b.quotation.actionMessage.loadFailed'));
      return;
    }
    if (!auditRemark.value?.trim()) {
      message.warning($t('trade.b2b.quotation.formPage.rejectReasonRequired'));
      return;
    }
    loading.value = true;
    try {
      await rejectQuotationByAdmin(quotationDetail.value.id, auditRemark.value);
      message.success($t('trade.b2b.quotation.actionMessage.rejectSuccess'));
      rejectModalApi.close();
      loadDetail();
    } finally {
      loading.value = false;
      auditRemark.value = '';
    }
  },
});

onMounted(() => {
  loadDetail();
});

const loadDetail = async () => {
  const id = Number(route.params.id);
  loading.value = true;
  try {
    quotationDetail.value = await getQuotation(id);
  } catch (error) {
    console.error($t('trade.b2b.quotation.actionMessage.loadFailed'), error);
  } finally {
    loading.value = false;
  }
};

const handleSubmitReview = async () => {
  loading.value = true;
  try {
    await submitQuotationForReview(quotationDetail.value.id);
    message.success(
      $t('trade.b2b.quotation.actionMessage.submitReviewSuccess'),
    );
    loadDetail();
  } finally {
    loading.value = false;
  }
};

const openApproveModal = () => {
  auditRemark.value = '';
  approveModalApi.open();
};

const openRejectModal = () => {
  auditRemark.value = '';
  rejectModalApi.open();
};

const getStatusColor = (status: number) => {
  const colors: Record<number, string> = {
    [B2BQuotationStatusEnum.DRAFT.status]: 'orange',
    [B2BQuotationStatusEnum.PENDING_REVIEW.status]: 'cyan',
    [B2BQuotationStatusEnum.APPROVED.status]: 'green',
    [B2BQuotationStatusEnum.REJECTED.status]: 'red',
    [B2BQuotationStatusEnum.ACCEPTED.status]: 'purple',
    [B2BQuotationStatusEnum.EXPIRED.status]: 'blue',
  };
  return colors[status] || 'default';
};

const isDraft = () => quotationDetail.value?.status === 0;
const isPendingReview = () => quotationDetail.value?.status === 5;
</script>

<template>
  <Page auto-content-height :title="quotationDetail?.no" :loading="loading">
    <template #extra>
      <TableAction
        :actions="[
          {
            label: $t('common.back'),
            type: 'default',
            icon: 'lucide:arrow-left',
            onClick: handleBack,
          },
          {
            label: $t('trade.b2b.quotation.actions.submitReview'),
            type: 'primary',
            onClick: handleSubmitReview,
            ifShow: isDraft(),
            loading,
          },
          {
            label: $t('trade.b2b.quotation.actions.approve'),
            type: 'primary',
            onClick: openApproveModal,
            ifShow: isPendingReview(),
            loading,
          },
          {
            label: $t('trade.b2b.quotation.actions.reject'),
            type: 'primary',
            danger: true,
            onClick: openRejectModal,
            ifShow: isPendingReview(),
            loading,
          },
        ]"
      />
    </template>

    <div v-if="quotationDetail" class="rounded-lg bg-white p-6">
      <div class="mb-6">
        <div class="mb-4">
          <h2 class="text-xl font-bold">
            {{ $t('trade.b2b.quotation.detail.title') }}
          </h2>
        </div>

        <Descriptions
          :column="2"
          size="middle"
          class="rounded-lg bg-gray-50 p-4"
        >
          <Descriptions.Item :label="$t('trade.b2b.quotation.detail.no')">
            {{ quotationDetail.no }}
          </Descriptions.Item>
          <Descriptions.Item :label="$t('trade.b2b.quotation.detail.rfqNo')">
            {{ quotationDetail.rfqNo }}
          </Descriptions.Item>
          <Descriptions.Item :label="$t('trade.b2b.quotation.detail.status')">
            <Tag :color="getStatusColor(quotationDetail.status)">
              {{ quotationDetail.statusName }}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item
            :label="$t('trade.b2b.quotation.detail.supplierName')"
          >
            {{ quotationDetail.supplierName || '-' }}
          </Descriptions.Item>
          <Descriptions.Item
            :label="$t('trade.b2b.quotation.detail.totalPrice')"
          >
            <span class="text-lg font-bold text-primary">
              ¥{{ fenToYuan(quotationDetail.totalPrice) }}
            </span>
            <span class="ml-1 text-gray-500">{{
              quotationDetail.currency
            }}</span>
          </Descriptions.Item>
          <Descriptions.Item :label="$t('trade.b2b.quotation.detail.currency')">
            {{ quotationDetail.currency }}
          </Descriptions.Item>
          <Descriptions.Item
            :label="$t('trade.b2b.quotation.detail.validUntil')"
          >
            <div>{{ formatDateTime(quotationDetail.validUntil) || '-' }}</div>
            <div class="text-xs text-gray-500">
              剩余: {{ getRemainingDays(quotationDetail.validUntil) }}
            </div>
          </Descriptions.Item>
          <Descriptions.Item
            :label="$t('trade.b2b.quotation.detail.createdAt')"
          >
            {{ formatDateTime(quotationDetail.createdAt) }}
          </Descriptions.Item>
          <Descriptions.Item
            :label="$t('trade.b2b.quotation.detail.remark')"
            :span="2"
          >
            {{ quotationDetail.remark || '-' }}
          </Descriptions.Item>
        </Descriptions>
      </div>

      <!-- 商品列表 -->
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
                      {{ $t('trade.b2b.quotation.detail.supplierPrice') }}: ¥{{
                        fenToYuan(item.supplierPrice)
                      }}
                    </span>
                    <span>
                      {{ $t('trade.b2b.quotation.detail.subtotal') }}: ¥{{
                        fenToYuan(item.totalPrice)
                      }}
                    </span>
                  </div>
                </template>
              </List.Item.Meta>
            </List.Item>
          </template>
        </List>
      </div>

      <!-- 费用项目（如果有） -->
      <div v-if="quotationDetail.feeItems?.length" class="mt-8">
        <h3 class="mb-4 text-lg font-semibold">
          {{ $t('trade.b2b.quotation.detail.feeItems') }}
        </h3>
        <List item-layout="horizontal" :data-source="quotationDetail.feeItems">
          <template #renderItem="{ item }">
            <List.Item>
              <List.Item.Meta
                :title="`${item.feeTypeName} - ${item.feeName}`"
                :description="item.description || $t('common.empty')"
              />
              <template #extra>
                <span class="font-bold">¥{{ fenToYuan(item.amount) }}</span>
              </template>
            </List.Item>
          </template>
        </List>
      </div>
    </div>

    <!-- 审核弹窗 -->
    <ApproveModal>
      <p class="mb-2">
        {{ $t('trade.b2b.order.approvalForm.approveTitle') }}？
      </p>
      <Input.TextArea
        v-model="auditRemark"
        :placeholder="$t('trade.b2b.order.approvalForm.remarkPlaceholder')"
        :rows="4"
      />
    </ApproveModal>

    <!-- 拒绝弹窗 -->
    <RejectModal>
      <p class="mb-2">{{ $t('trade.b2b.order.approvalForm.rejectTitle') }}：</p>
      <Input.TextArea
        v-model="auditRemark"
        :placeholder="$t('trade.b2b.order.approvalForm.remarkPlaceholder')"
        :rows="4"
      />
    </RejectModal>
  </Page>
</template>
