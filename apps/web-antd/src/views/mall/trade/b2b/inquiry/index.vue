<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { B2BInquiryApi } from '#/api/mall/trade/b2b/inquiry';

import { useRouter } from 'vue-router';

import { Page, useVbenModal } from '@vben/common-ui';
import { message } from 'ant-design-vue';

import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import { deleteInquiry, getInquiryPage } from '#/api/mall/trade/b2b/inquiry';
import { $t } from '#/locales';

import { useGridColumns, useGridFormSchema } from './data';
import StatusForm from './modules/status-form.vue';

const { push } = useRouter();

const [StatusFormModal, statusFormModalApi] = useVbenModal({
  connectedComponent: StatusForm,
  destroyOnClose: true,
});

/** 刷新表格 */
function handleRefresh() {
  gridApi.query();
}

/** 详情 */
function handleDetail(row: B2BInquiryApi.InquiryPageItem) {
  push({ name: 'TradeB2BInquiryDetailPage', params: { id: row.id } });
}

/** 处理询价 */
function handleUpdateStatus(row: B2BInquiryApi.InquiryPageItem) {
  statusFormModalApi
    .setData({ id: row.id, status: row.status })
    .open();
}

/** 删除 */
async function handleDelete(row: B2BInquiryApi.InquiryPageItem) {
  const hideLoading = message.loading({
    content: $t('ui.actionMessage.deleting', [row.no]),
    duration: 0,
  });
  try {
    await deleteInquiry(row.id);
    message.success($t('ui.actionMessage.deleteSuccess', [row.no]));
    handleRefresh();
  } finally {
    hideLoading();
  }
}

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    schema: useGridFormSchema(),
  },
  gridOptions: {
    columns: useGridColumns(),
    height: 'auto',
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          return await getInquiryPage({
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
  } as VxeTableGridOptions<B2BInquiryApi.InquiryPageItem>,
});
</script>

<template>
  <Page auto-content-height>
    <StatusFormModal @success="handleRefresh" />
    <Grid :table-title="$t('trade.b2b.inquiry.index.title')">
      <template #actions="{ row }">
        <TableAction
          :actions="[
            {
              label: $t('common.detail'),
              type: 'link',
              icon: ACTION_ICON.VIEW,
              auth: ['trade:b2b:inquiry:detail'],
              onClick: handleDetail.bind(null, row),
            },
          ]"
          :drop-down-actions="[
            {
              label: $t('trade.b2b.inquiry.actions.process'),
              type: 'link',
              auth: ['trade:b2b:inquiry:update'],
              onClick: handleUpdateStatus.bind(null, row),
            },
            {
              label: $t('common.delete'),
              type: 'link',
              auth: ['trade:b2b:inquiry:delete'],
              onClick: handleDelete.bind(null, row),
            },
          ]"
        />
      </template>
    </Grid>
  </Page>
</template>
