<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { B2BRfqApi } from '#/api/mall/trade/b2b/rfq';

import { useRouter } from 'vue-router';

import { Page, useVbenModal } from '@vben/common-ui';
import { B2BRfqStatusEnum } from '@vben/constants';
import { fenToYuan } from '@vben/utils';

import { Image, List, Tag } from 'ant-design-vue';

import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import { getRfqPage } from '#/api/mall/trade/b2b/rfq';
import { $t } from '#/locales';

import { useGridColumns, useGridFormSchema } from './data';
import AssignForm from './modules/assign-form.vue';

const { push } = useRouter();

const [AssignFormModal, assignFormModalApi] = useVbenModal({
  connectedComponent: AssignForm,
  destroyOnClose: true,
});

/** 刷新表格 */
function handleRefresh() {
  gridApi.query();
}

/** 详情 */
function handleDetail(row: B2BRfqApi.RfqPageItem) {
  push({ name: 'TradeB2BRfqDetailPage', params: { id: row.id } });
}

/** 分配供应商 */
function handleAssign(row: B2BRfqApi.RfqPageItem) {
  assignFormModalApi.setData({ id: row.id }).open();
}

/** 快速报价 - 跳转到报价编辑页 */
function handleQuote(row: B2BRfqApi.RfqPageItem) {
  push({ name: 'TradeB2BQuotationFormPage', query: { rfqId: row.id } });
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
          return await getRfqPage({
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
  } as VxeTableGridOptions<B2BRfqApi.RfqPageItem>,
});
</script>

<template>
  <Page auto-content-height>
    <AssignFormModal @success="handleRefresh" />
    <Grid :table-title="$t('trade.b2b.rfq.index.title')">
      <template #expand_content="{ row }">
        <div v-if="row.items && row.items.length > 0" class="expand-content">
          <List item-layout="vertical" :data-source="row.items">
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
                        {{ $t('trade.b2b.rfq.detail.quantity') }}：{{
                          item.count
                        }}
                      </span>
                      <span>
                        {{ $t('trade.b2b.rfq.detail.expectedPrice') }}：{{
                          fenToYuan(item.expectedPrice)
                        }}
                        {{ $t('common.yuan') }}
                      </span>
                      <span v-if="item.specifications">
                        {{ $t('trade.b2b.rfq.detail.specifications') }}：{{
                          item.specifications
                        }}
                      </span>
                      <span v-if="item.unit">
                        {{ $t('trade.b2b.rfq.detail.unit') }}：{{ item.unit }}
                      </span>
                      <span v-if="item.brand">
                        {{ $t('trade.b2b.rfq.detail.brand') }}：{{ item.brand }}
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
        <TableAction
          :actions="[
            {
              label: $t('common.detail'),
              type: 'link',
              icon: ACTION_ICON.VIEW,
              auth: ['trade:b2b:rfq:detail'],
              onClick: handleDetail.bind(null, row),
            },
          ]"
          :drop-down-actions="[
            {
              label: $t('trade.b2b.rfq.actions.assign'),
              type: 'link',
              ifShow: () =>
                row.status === B2BRfqStatusEnum.SUBMITTED.status ||
                row.status === B2BRfqStatusEnum.PROCESSING.status,
              onClick: handleAssign.bind(null, row),
            },
            {
              label: $t('trade.b2b.rfq.actions.quote'),
              type: 'link',
              ifShow: () => row.status === B2BRfqStatusEnum.PROCESSING.status,
              onClick: handleQuote.bind(null, row),
            },
          ]"
        />
      </template>
    </Grid>
  </Page>
</template>

<style scoped>
.expand-content {
  padding: 12px;
}
</style>
