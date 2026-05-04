<script lang="ts" setup>
import type { Dayjs } from 'dayjs';

import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { ref } from 'vue';

import { buildSortingField } from '@vben/request';
import { formatDateTime } from '@vben/utils';

import { Card } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getProductStatisticsRankPage } from '#/api/mall/statistics/product';
import ShortcutDateRangePicker from '#/components/shortcut-date-range-picker/shortcut-date-range-picker.vue';
import { $t } from '#/locales';

/** 商品排行 */
defineOptions({ name: 'ProductRankCard' });

const searchTimes = ref<string[]>([]);

/** 处理日期范围变化 */
const handleDateRangeChange = (times?: [Dayjs, Dayjs]) => {
  if (times?.length !== 2) {
    return;
  }
  searchTimes.value = [
    formatDateTime(times[0]) as string,
    formatDateTime(times[1]) as string,
  ];
  gridApi.query();
};

const columns: VxeTableGridOptions['columns'] = [
  { field: 'spuId', title: $t('statistics.product.rank.spuId'), minWidth: 100 },
  {
    field: 'picUrl',
    title: $t('statistics.product.rank.picUrl'),
    minWidth: 100,
    cellRender: { name: 'CellImage' },
  },
  {
    field: 'name',
    title: $t('statistics.product.rank.name'),
    minWidth: 200,
  },
  {
    field: 'browseCount',
    title: $t('statistics.product.rank.browseCount'),
    minWidth: 100,
    sortable: true,
  },
  {
    field: 'browseUserCount',
    title: $t('statistics.product.rank.browseUserCount'),
    minWidth: 100,
    sortable: true,
  },
  {
    field: 'cartCount',
    title: $t('statistics.product.rank.cartCount'),
    minWidth: 110,
    sortable: true,
  },
  {
    field: 'orderCount',
    title: $t('statistics.product.rank.orderCount'),
    minWidth: 110,
    sortable: true,
  },
  {
    field: 'orderPayCount',
    title: $t('statistics.product.rank.orderPayCount'),
    minWidth: 110,
    sortable: true,
  },
  {
    field: 'orderPayPrice',
    title: $t('statistics.product.rank.orderPayPrice'),
    minWidth: 120,
    formatter: 'formatFenToYuanAmount',
    sortable: true,
  },
  {
    field: 'favoriteCount',
    title: $t('statistics.product.rank.favoriteCount'),
    minWidth: 100,
    sortable: true,
  },
  {
    field: 'browseConvertPercent',
    title: $t('statistics.product.rank.browseConvertPercent'),
    minWidth: 160,
    sortable: true,
    formatter: ({ cellValue }) => `${cellValue || 0}%`,
  },
];

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns,
    height: 400,
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page, sorts }) => {
          return await getProductStatisticsRankPage({
            pageNo: page.currentPage,
            pageSize: page.pageSize,
            times: searchTimes.value.length > 0 ? searchTimes.value : undefined,
            ...buildSortingField(sorts),
          });
        },
      },
      sort: true,
    },
    sortConfig: {
      remote: true,
      multiple: false,
    },
    toolbarConfig: {
      enabled: false,
    },
  } as VxeTableGridOptions,
});
</script>

<template>
  <Card :bordered="false" :title="$t('statistics.product.rank.title')">
    <template #extra>
      <ShortcutDateRangePicker @change="handleDateRangeChange" />
    </template>
    <Grid />
  </Card>
</template>
