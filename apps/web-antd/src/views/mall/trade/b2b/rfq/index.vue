<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { B2BRfqApi } from '#/api/mall/trade/b2b/rfq';

import { useRouter } from 'vue-router';

import { Page, useVbenModal } from '@vben/common-ui';
import { B2BRfqStatusEnum } from '@vben/constants';

import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import { getRfqPage } from '#/api/mall/trade/b2b/rfq';
import { $t } from '#/locales';

import { useGridColumns, useGridFormSchema } from './data';
import AssignForm from './modules/assign-form.vue';
import QuoteForm from './modules/quote-form.vue';

const { push } = useRouter();

const [AssignFormModal, assignFormModalApi] = useVbenModal({
  connectedComponent: AssignForm,
  destroyOnClose: true,
});

const [QuoteFormModal, quoteFormModalApi] = useVbenModal({
  connectedComponent: QuoteForm,
  destroyOnClose: true,
});

/** 刷新表格 */
function handleRefresh() {
  gridApi.query();
}

/** 详情 */
function handleDetail(row: B2BRfqApi.RfqPageItem) {
  push({ name: 'B2BRfqDetail', params: { id: row.id } });
}

/** 分配供应商 */
function handleAssign(row: B2BRfqApi.RfqPageItem) {
  assignFormModalApi.setData({ id: row.id }).open();
}

/** 快速报价 */
function handleQuote(row: B2BRfqApi.RfqPageItem) {
  quoteFormModalApi.setData({ id: row.id }).open();
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
    <QuoteFormModal @success="handleRefresh" />
    <Grid :table-title="$t('trade.b2b.rfq.index.title')">
      <template #expand_content="{ row }">
        <div v-if="row.items && row.items.length > 0" class="expand-content">
          <a-table
            :columns="[
              {
                title: $t('trade.b2b.rfq.detail.productName'),
                dataIndex: 'productName',
              },
              {
                title: $t('trade.b2b.rfq.detail.skuName'),
                dataIndex: 'skuName',
              },
              { title: $t('trade.b2b.rfq.detail.count'), dataIndex: 'count' },
              {
                title: $t('trade.b2b.rfq.detail.expectedPrice'),
                dataIndex: 'expectedPrice',
                customRender: (text: number) => `${text} ${$t('common.yuan')}`,
              },
            ]"
            :data-source="row.items"
            :pagination="false"
            size="small"
          />
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
