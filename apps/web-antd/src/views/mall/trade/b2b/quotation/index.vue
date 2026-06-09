<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { B2BQuotationApi } from '#/api/mall/trade/b2b/quotation';

import { useRouter } from 'vue-router';

import { Page, useVbenModal } from '@vben/common-ui';

import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import { getQuotationPage } from '#/api/mall/trade/b2b/quotation';
import { $t } from '#/locales';

import { useGridColumns, useGridFormSchema } from './data';
import CreateForm from './modules/create-form.vue';

const { push } = useRouter();

const [CreateFormModal, createFormModalApi] = useVbenModal({
  connectedComponent: CreateForm,
  destroyOnClose: true,
});

function handleRefresh() {
  gridApi.query();
}

function handleDetail(row: B2BQuotationApi.QuotationPageItem) {
  push({ name: 'B2BQuotationDetail', params: { id: row.id } });
}

function handleCreate() {
  createFormModalApi.open();
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
    <CreateFormModal @success="handleRefresh" />
    <Grid :table-title="$t('trade.b2b.quotation.index.title')">
      <template #expand_content="{ row }">
        <div v-if="row.items && row.items.length > 0" class="expand-content">
          <a-table
            :columns="[
              {
                title: $t('trade.b2b.quotation.detail.spuName'),
                dataIndex: 'spuName',
              },
              {
                title: $t('trade.b2b.quotation.detail.skuName'),
                dataIndex: 'skuName',
              },
              {
                title: $t('trade.b2b.quotation.detail.count'),
                dataIndex: 'count',
              },
              {
                title: $t('trade.b2b.quotation.detail.unitPrice'),
                dataIndex: 'unitPrice',
                customRender: (text: number) => `${text} ${row.currency}`,
              },
              {
                title: $t('trade.b2b.quotation.detail.subtotal'),
                dataIndex: 'totalPrice',
                customRender: (text: number) => `${text} ${row.currency}`,
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
              auth: ['trade:b2b:quotation:detail'],
              onClick: handleDetail.bind(null, row),
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
