<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { MallSpuApi } from '#/api/mall/product/spu';

import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { confirm, DocAlert, Page } from '@vben/common-ui';
import { ProductSpuStatusEnum } from '@vben/constants';
import { downloadFileFromBlobPart } from '@vben/utils';

import { message, Tabs } from 'ant-design-vue';

import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  deleteSpu,
  exportSpu,
  getSpuPage,
  getTabsCount,
  updateStatus,
} from '#/api/mall/product/spu';
import { $t } from '#/locales';

import { useGridColumns, useGridFormSchema } from './data';

const { push } = useRouter();
const route = useRoute();
const tabType = ref(0);
const tabsData = ref([
  {
    name: $t('mall-product.spu.tabs.selling'),
    type: 0,
    count: 0,
  },
  {
    name: $t('mall-product.spu.tabs.warehouse'),
    type: 1,
    count: 0,
  },
  {
    name: $t('mall-product.spu.tabs.soldOut'),
    type: 2,
    count: 0,
  },
  {
    name: $t('mall-product.spu.tabs.warning'),
    type: 3,
    count: 0,
  },
  {
    name: $t('mall-product.spu.tabs.recycle'),
    type: 4,
    count: 0,
  },
]);

/** 刷新表格 */
async function handleRefresh() {
  await gridApi.query();
  await getTabCount();
}

/** 导出表格 */
async function handleExport() {
  const data = await exportSpu(await gridApi.formApi.getValues());
  downloadFileFromBlobPart({
    fileName: `${$t('mall-product.spu.name')}.xls`,
    source: data,
  });
}

/** 获得每个 Tab 的数量 */
async function getTabCount() {
  const res = await getTabsCount();
  for (const objName in res) {
    const index = Number(objName);
    if (tabsData.value[index]) {
      tabsData.value[index].count = res[objName]!;
    }
  }
}

/** 创建商品 */
function handleCreate() {
  push({ name: 'ProductSpuAdd' });
}

/** 编辑商品 */
function handleEdit(row: MallSpuApi.Spu) {
  push({ name: 'ProductSpuEdit', params: { id: row.id } });
}

/** 删除商品 */
async function handleDelete(row: MallSpuApi.Spu) {
  const hideLoading = message.loading({
    content: $t('ui.actionMessage.deleting', [row.name]),
    duration: 0,
  });
  try {
    await deleteSpu(row.id!);
    message.success($t('ui.actionMessage.deleteSuccess', [row.name]));
    await handleRefresh();
  } finally {
    hideLoading();
  }
}

/** 更新状态 */
async function handleStatusChange(
  newStatus: number,
  row: MallSpuApi.Spu,
): Promise<boolean | undefined> {
  return new Promise((resolve, reject) => {
    // 二次确认
    const text = newStatus
      ? $t('mall-product.spu.statusOptions.onSale')
      : $t('mall-product.spu.statusOptions.offSale');
    confirm({
      content: $t('common.confirmOperation', [text, row.name]),
    })
      .then(async () => {
        // 更新状态
        await updateStatus({
          id: row.id!,
          status: newStatus,
        });
        // 提示并返回成功
        message.success($t('common.operationSuccess', [text]));
        resolve(true);
      })
      .catch(() => {
        reject(new Error('取消操作'));
      });
  });
}

/** 添加到仓库 / 回收站的状态 */
async function handleStatus02Change(row: MallSpuApi.Spu, newStatus: number) {
  const text =
    newStatus === ProductSpuStatusEnum.RECYCLE.status
      ? $t('mall-product.spu.actions.recycle')
      : $t('mall-product.spu.actions.restore');
  await confirm({
    content: $t('common.confirmOperation', [text, row.name]),
  });
  const hideLoading = message.loading({
    content: `${$t('common.processing')}${text}${$t('common.processingEnd')}`,
    duration: 0,
  });
  try {
    await updateStatus({ id: row.id!, status: newStatus });
    message.success($t('common.operationSuccess', [text]));
    await handleRefresh();
  } finally {
    hideLoading();
  }
}

/** 查看商品详情 */
function handleDetail(row: MallSpuApi.Spu) {
  push({ name: 'ProductSpuDetail', params: { id: row.id } });
}

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    schema: useGridFormSchema(),
  },
  gridOptions: {
    columns: useGridColumns(handleStatusChange),
    height: 'auto',
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          return await getSpuPage({
            pageNo: page.currentPage,
            pageSize: page.pageSize,
            tabType: tabType.value,
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
  } as VxeTableGridOptions<MallSpuApi.Spu>,
});

function onChangeTab(key: any) {
  tabType.value = Number(key);
  gridApi.query();
}

onMounted(async () => {
  // 解析路由的 categoryId
  if (route.query.categoryId) {
    await gridApi.formApi.setValues({
      categoryId: Number(route.query.categoryId),
    });
  }
  // 获得每个 Tab 的数量
  await getTabCount();
});
</script>

<template>
  <Page auto-content-height>
    <template #doc>
      <DocAlert
        title="【商品】商品 SPU 与 SKU"
        url="https://doc.iocoder.cn/mall/product-spu-sku/"
      />
    </template>

    <Grid>
      <template #toolbar-actions>
        <Tabs @change="onChangeTab" class="w-full">
          <Tabs.TabPane
            v-for="item in tabsData"
            :key="item.type"
            :tab="`${item.name} (${item.count})`"
          />
        </Tabs>
      </template>
      <template #toolbar-tools>
        <TableAction
          :actions="[
            {
              label: $t('ui.actionTitle.create', [$t('mall-product.spu.name')]),
              type: 'primary',
              icon: ACTION_ICON.ADD,
              auth: ['product:spu:create'],
              onClick: handleCreate,
            },
            {
              label: $t('ui.actionTitle.export'),
              type: 'primary',
              icon: ACTION_ICON.DOWNLOAD,
              auth: ['product:spu:export'],
              onClick: handleExport,
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
              auth: ['product:spu:update'],
              onClick: handleEdit.bind(null, row),
            },
            {
              label: $t('common.detail'),
              type: 'link',
              icon: ACTION_ICON.VIEW,
              onClick: handleDetail.bind(null, row),
            },
            {
              label: $t('common.delete'),
              type: 'link',
              danger: true,
              icon: ACTION_ICON.DELETE,
              auth: ['product:spu:delete'],
              ifShow: () => tabType === 4,
              popConfirm: {
                title: $t('ui.actionMessage.deleteConfirm', [row.name]),
                confirm: handleDelete.bind(null, row),
              },
            },
            {
              label: $t('mall-product.spu.actions.restore'),
              type: 'link',
              icon: ACTION_ICON.EDIT,
              auth: ['product:spu:update'],
              onClick: handleStatus02Change.bind(
                null,
                row,
                ProductSpuStatusEnum.DISABLE.status,
              ),
            },
            {
              label: $t('mall-product.spu.actions.recycle'),
              type: 'link',
              icon: ACTION_ICON.EDIT,
              auth: ['product:spu:update'],
              onClick: handleStatus02Change.bind(
                null,
                row,
                ProductSpuStatusEnum.RECYCLE.status,
              ),
            },
          ]"
        />
      </template>
    </Grid>
  </Page>
</template>
