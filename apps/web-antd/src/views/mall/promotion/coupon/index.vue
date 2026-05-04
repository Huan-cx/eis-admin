<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { MallCouponApi } from '#/api/mall/promotion/coupon/coupon';

import { ref } from 'vue';

import { DocAlert, Page } from '@vben/common-ui';
import { DICT_TYPE } from '@vben/constants';
import { getDictOptions } from '@vben/hooks';
import { $t } from '@vben/locales';

import { message, TabPane, Tabs } from 'ant-design-vue';

import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  deleteCoupon,
  getCouponPage,
} from '#/api/mall/promotion/coupon/coupon';

import { useGridColumns, useGridFormSchema } from './data';

defineOptions({ name: 'PromotionCoupon' });

const activeTab = ref('all');
const statusTabs = ref(getStatusTabs());

/** 刷新表格 */
function handleRefresh() {
  gridApi.query();
}

/** 删除优惠券 */
async function handleDelete(row: MallCouponApi.Coupon) {
  const hideLoading = message.loading({
    content: $t('promotion.coupon.recycling'),
    duration: 0,
  });
  try {
    await deleteCoupon(row.id!);
    message.success($t('promotion.coupon.recycleSuccess'));
    handleRefresh();
  } finally {
    hideLoading();
  }
}

/** 获取状态选项卡配置 */
function getStatusTabs() {
  const tabs = [
    {
      label: $t('promotion.coupon.all'),
      value: 'all',
    },
  ];
  const statusOptions = getDictOptions(DICT_TYPE.PROMOTION_COUPON_STATUS);
  for (const option of statusOptions) {
    tabs.push({
      label: option.label,
      value: String(option.value),
    });
  }
  return tabs;
}

/** Tab 切换 */
function handleTabChange(tabName: any) {
  activeTab.value = tabName;
  gridApi.query();
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
          const params = {
            pageNo: page.currentPage,
            pageSize: page.pageSize,
            ...formValues,
            // Tab状态过滤
            status:
              activeTab.value === 'all' ? undefined : Number(activeTab.value),
          };
          return await getCouponPage(params);
        },
      },
    },
    rowConfig: {
      /** 行键字段 */
      keyField: 'id',
      isHover: true,
    },
    toolbarConfig: {
      refresh: true,
      search: true,
    },
  } as VxeTableGridOptions<MallCouponApi.Coupon>,
});
</script>

<template>
  <Page auto-content-height>
    <template #doc>
      <DocAlert
        :title="$t('promotion.coupon.title')"
        url="https://doc.iocoder.cn/mall/promotion-coupon/"
      />
    </template>

    <Grid>
      <template #toolbar-actions>
        <Tabs class="w-full" @change="handleTabChange">
          <TabPane
            v-for="tab in statusTabs"
            :key="tab.value"
            :tab="tab.label"
          />
        </Tabs>
      </template>
      <template #actions="{ row }">
        <TableAction
          :actions="[
            {
              label: $t('promotion.coupon.recycle'),
              type: 'link',
              danger: true,
              icon: ACTION_ICON.DELETE,
              auth: ['promotion:coupon:delete'],
              popConfirm: {
                title: $t('promotion.coupon.confirmRecycle'),
                confirm: handleDelete.bind(null, row),
              },
            },
          ]"
        />
      </template>
    </Grid>
  </Page>
</template>
