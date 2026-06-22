<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { B2BQuotationApi } from '#/api/mall/trade/b2b/quotation';

import { useRouter } from 'vue-router';

import { Page } from '@vben/common-ui';
import { fenToYuan } from '@vben/utils';

import { Image, List, message } from 'ant-design-vue';

import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  getQuotationPage,
  submitQuotationForReview,
} from '#/api/mall/trade/b2b/quotation';
import { $t } from '#/locales';

import { useGridColumns, useGridFormSchema } from './data';

const { push } = useRouter();

// 格式化价格显示（服务端存储为分，前端展示为元）
function formatPrice(price: number, currency: string) {
  return `${fenToYuan(price)} ${currency}`;
}

function handleRefresh() {
  gridApi.query();
}

function handleDetail(row: B2BQuotationApi.QuotationPageItem) {
  push({ name: 'TradeB2BQuotationDetailPage', params: { id: row.id } });
}

function handleEdit(row: B2BQuotationApi.QuotationPageItem) {
  push({ name: 'TradeB2BQuotationEditPage', params: { id: row.id } });
}

function handleCreate() {
  push({ name: 'TradeB2BQuotationFormPage' });
}

// 提交审核
async function handleSubmitReview(row: B2BQuotationApi.QuotationPageItem) {
  try {
    await submitQuotationForReview(row.id);
    message.success(
      $t('trade.b2b.quotation.actionMessage.submitReviewSuccess'),
    );
    handleRefresh();
  } catch (error) {
    console.error(
      $t('trade.b2b.quotation.actionMessage.submitReviewFailed'),
      error,
    );
  }
}

// 根据状态获取可用操作
function getRowActions(row: B2BQuotationApi.QuotationPageItem) {
  const actions: any[] = [
    {
      label: $t('common.detail'),
      type: 'link',
      icon: ACTION_ICON.VIEW,
      auth: ['trade:b2b:quotation:detail'],
      onClick: handleDetail.bind(null, row),
    },
  ];

  // 草稿状态: 可以编辑、提交审核
  if (row.status === 0) {
    actions.push(
      {
        label: $t('common.edit'),
        type: 'link',
        icon: ACTION_ICON.EDIT,
        auth: ['trade:b2b:quotation:update'],
        onClick: handleEdit.bind(null, row),
      },
      {
        label: $t('trade.b2b.quotation.actions.submitReview'),
        type: 'link',
        auth: ['trade:b2b:quotation:approve'],
        onClick: handleSubmitReview.bind(null, row),
      },
    );
  }

  // 待审核状态: 跳转到详情页面进行审核
  if (row.status === 5) {
    actions.push({
      label: $t('trade.b2b.quotation.actions.audit'),
      type: 'link',
      icon: ACTION_ICON.VIEW,
      auth: ['trade:b2b:quotation:approve'],
      onClick: handleDetail.bind(null, row),
    });
  }

  return actions;
}

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    schema: useGridFormSchema(),
  },
  gridOptions: {
    expandConfig: {
      trigger: 'row',
      expandAll: true,
      padding: true,
    },
    columns: useGridColumns(),
    height: 'auto',
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          return await getQuotationPage({
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
      actions: [
        {
          label: $t('trade.b2b.quotation.actions.create'),
          type: 'primary',
          onClick: handleCreate,
          auth: ['trade:b2b:quotation:create'],
        },
      ],
    },
  } as VxeTableGridOptions<B2BQuotationApi.QuotationPageItem>,
});
</script>

<template>
  <Page auto-content-height>
    <Grid :table-title="$t('trade.b2b.quotation.index.title')">
      <template #totalPrice="{ row }">
        ¥{{ fenToYuan(row.totalPrice) }}
      </template>
      <template #expand_content="{ row }">
        <div v-if="row.items && row.items.length > 0" class="expand-content">
          <List item-layout="vertical" :data-source="row.items">
            <template #renderItem="{ item }">
              <List.Item>
                <List.Item.Meta>
                  <template #title>
                    {{ item.spuName }}
                    <span v-if="item.skuName" style="margin-left: 8px">
                      {{ item.skuName }}
                    </span>
                  </template>
                  <template #avatar>
                    <Image :src="item.picUrl" :width="60" :height="60" />
                  </template>
                  <template #description>
                    <div class="flex flex-wrap gap-4">
                      <span>
                        {{ $t('trade.b2b.quotation.detail.count') }}：{{
                          item.count
                        }}
                      </span>
                      <span>
                        {{ $t('trade.b2b.quotation.detail.supplierPrice') }}：{{
                          formatPrice(item.supplierPrice, row.currency)
                        }}
                      </span>
                      <span>
                        {{ $t('trade.b2b.quotation.detail.subtotal') }}：{{
                          formatPrice(item.totalPrice, row.currency)
                        }}
                      </span>
                    </div>
                  </template>
                </List.Item.Meta>
              </List.Item>
            </template>
          </List>
        </div>
        <div v-else>
          {{ $t('common.empty') }}
        </div>
      </template>
      <template #actions="{ row }">
        <TableAction :actions="getRowActions(row)" />
      </template>
    </Grid>
  </Page>
</template>

<style scoped>
.expand-content {
  padding: 12px;
}
</style>
