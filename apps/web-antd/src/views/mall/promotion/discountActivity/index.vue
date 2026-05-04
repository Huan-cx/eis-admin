<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { MallDiscountActivityApi } from '#/api/mall/promotion/discount/discountActivity';

import { confirm, DocAlert, Page, useVbenModal } from '@vben/common-ui';

import { message } from 'ant-design-vue';

import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  closeDiscountActivity,
  deleteDiscountActivity,
  getDiscountActivityPage,
} from '#/api/mall/promotion/discount/discountActivity';
import { $t } from '#/locales';

import { useGridColumns, useGridFormSchema } from './data';
import DiscountActivityForm from './modules/form.vue';

defineOptions({ name: 'PromotionDiscountActivity' });

const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: DiscountActivityForm,
  destroyOnClose: true,
});

/** 刷新表格 */
function handleRefresh() {
  gridApi.query();
}

/** 创建满减活动 */
function handleCreate() {
  formModalApi.setData(null).open();
}

/** 编辑满减活动 */
function handleEdit(row: MallDiscountActivityApi.DiscountActivity) {
  formModalApi.setData(row).open();
}

/** 关闭满减活动 */
async function handleClose(row: MallDiscountActivityApi.DiscountActivity) {
  await confirm($t('promotion.discountActivity.confirmClose'));
  const hideLoading = message.loading({
    content: $t('promotion.discountActivity.closing'),
    duration: 0,
  });
  try {
    await closeDiscountActivity(row.id!);
    message.success($t('promotion.discountActivity.closeSuccess'));
    handleRefresh();
  } finally {
    hideLoading();
  }
}

/** 删除满减活动 */
async function handleDelete(row: MallDiscountActivityApi.DiscountActivity) {
  const hideLoading = message.loading({
    content: $t('ui.actionMessage.deleting', [row.name]),
    duration: 0,
  });
  try {
    await deleteDiscountActivity(row.id!);
    message.success({
      content: $t('ui.actionMessage.deleteSuccess', [row.name]),
    });
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
          return await getDiscountActivityPage({
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
  } as VxeTableGridOptions<MallDiscountActivityApi.DiscountActivity>,
});
</script>

<template>
  <Page auto-content-height>
    <template #doc>
      <DocAlert
        :title="$t('promotion.discountActivity.title')"
        url="https://doc.iocoder.cn/mall/promotion-discount/"
      />
    </template>

    <FormModal @success="handleRefresh" />

    <Grid :table-title="$t('promotion.discountActivity.list')">
      <template #toolbar-tools>
        <TableAction
          :actions="[
            {
              label: $t('ui.actionTitle.create', [
                $t('promotion.discountActivity.name'),
              ]),
              type: 'primary',
              icon: ACTION_ICON.ADD,
              auth: ['promotion:discount-activity:create'],
              onClick: handleCreate,
            },
          ]"
        />
      </template>
      <template #actions="{ row }">
        <TableAction
          :actions="[
            {
              label: $t('common.edit'),
              type: 'link',
              icon: ACTION_ICON.EDIT,
              auth: ['promotion:discount-activity:update'],
              onClick: handleEdit.bind(null, row),
            },
            {
              label: $t('promotion.discountActivity.close'),
              type: 'link',
              danger: true,
              icon: ACTION_ICON.DELETE,
              auth: ['promotion:discount-activity:close'],
              ifShow: row.status === 0,
              onClick: handleClose.bind(null, row),
            },
            {
              label: $t('common.delete'),
              type: 'link',
              danger: true,
              icon: ACTION_ICON.DELETE,
              auth: ['promotion:discount-activity:delete'],
              ifShow: row.status !== 0,
              popConfirm: {
                title: $t('ui.actionMessage.deleteConfirm', [row.name]),
                confirm: handleDelete.bind(null, row),
              },
            },
          ]"
        />
      </template>
    </Grid>
  </Page>
</template>
