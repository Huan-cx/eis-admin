<script lang="ts" setup>
import type {VxeTableGridOptions} from '#/adapter/vxe-table';
import type {ThemeCustomization} from '#/api/mall/promotion/theme';

import {DocAlert, Page, useVbenModal} from '@vben/common-ui';

import {message, Modal} from 'ant-design-vue';

import {ACTION_ICON, TableAction, useVbenVxeGrid} from '#/adapter/vxe-table';
import {
  batchUpdateThemeCustomizationSort,
  deleteThemeCustomization,
  getThemeCustomizationPage,
} from '#/api/mall/promotion/theme';
import {$t} from '#/locales';

import {useGridColumns, useGridFormSchema} from './data';
import Form from './modules/form.vue';

const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: Form,
  destroyOnClose: true,
});

/** 刷新表格 */
function handleRefresh() {
  gridApi.query();
}

/** 新建 */
function handleCreate() {
  formModalApi.setData(null).open();
}

/** 编辑 */
function handleEdit(row: ThemeCustomization) {
  formModalApi.setData(row).open();
}

/** 删除 */
async function handleDelete(row: ThemeCustomization) {
  const hideLoading = message.loading({
    content: $t('ui.actionMessage.deleting', [row.name]),
    duration: 0,
  });
  try {
    await deleteThemeCustomization(row.id as number);
    message.success($t('ui.actionMessage.deleteSuccess', [row.name]));
    handleRefresh();
  } finally {
    hideLoading();
  }
}

/** 重置 sort 为连续值：取当前 pageCode+themeCode 下所有区块的 id，数组下标赋 sort */
async function handleResetSort() {
  // 直接调后端查第一页数据（后端已按 sort 排序）
  const res = await getThemeCustomizationPage({pageNo: 1, pageSize: 200});
  const list = (res?.list || []) as ThemeCustomization[];
  if (!list.length) {
    message.warning('当前无数据');
    return;
  }
  await Modal.confirm({
    content: `确认将当前 ${list.length} 条区块的排序重置为连续值（0, 1, 2, ...）？`,
    okText: '确认重置',
    cancelText: '取消',
    async onOk() {
      try {
        const ids = list.map((item) => item.id);
        await batchUpdateThemeCustomizationSort(ids);
        message.success('排序已重置');
        handleRefresh();
      } catch (err) {
        message.error('重置失败: ' + (err as Error).message);
      }
    },
  });
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
        query: async ({page}, formValues) => {
          return await getThemeCustomizationPage({
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
  } as VxeTableGridOptions<ThemeCustomization>,
});

/** 展开 remark 的 tooltip */
function truncateRemark(text?: string) {
  if (!text) return '-';
  return text.length > 20 ? text.slice(0, 20) + '...' : text;
}
</script>

<template>
  <Page auto-content-height>
    <template #doc>
      <DocAlert
        title="首页主题区块管理"
        url="https://doc.iocoder.cn/mall/promotion-content/"
      />
    </template>

    <FormModal @success="handleRefresh" />

    <Grid :table-title="'首页区块列表'">
      <template #toolbar-tools>
        <TableAction
          :actions="[
            {
              label: '新增区块',
              type: 'primary',
              icon: ACTION_ICON.ADD,
              auth: ['promotion:theme:create'],
              onClick: handleCreate,
            },
            {
              label: '重置排序为连续值',
              type: 'default',
              icon: ACTION_ICON.REFRESH,
              auth: ['promotion:theme:update'],
              onClick: handleResetSort,
            },
          ]"
        />
      </template>

      <template #remark="{row}">
        <span :title="row.remark">{{ truncateRemark(row.remark) }}</span>
      </template>

      <template #actions="{row}">
        <TableAction
          :actions="[
            {
              label: $t('common.edit'),
              type: 'link',
              icon: ACTION_ICON.EDIT,
              auth: ['promotion:theme:update'],
              onClick: handleEdit.bind(null, row),
            },
            {
              label: $t('common.delete'),
              type: 'link',
              danger: true,
              icon: ACTION_ICON.DELETE,
              auth: ['promotion:theme:delete'],
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
