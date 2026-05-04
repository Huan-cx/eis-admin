<script lang="ts" setup>
import type { Dayjs } from 'dayjs';

import type { EchartsUIType } from '@vben/plugins/echarts';

import type { DataComparisonRespVO } from '#/api/mall/statistics/common';
import type { MallProductStatisticsApi } from '#/api/mall/statistics/product';

import { ref } from 'vue';

import { confirm, SummaryCard } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';
import { EchartsUI, useEcharts } from '@vben/plugins/echarts';
import {
  downloadFileFromBlobPart,
  fenToYuan,
  formatDateTime,
  isSameDay,
} from '@vben/utils';

import { Button, Card, Col, Row, Spin } from 'ant-design-vue';
import dayjs from 'dayjs';

import {
  exportProductStatisticsExcel,
  getProductStatisticsAnalyse,
  getProductStatisticsList,
} from '#/api/mall/statistics/product';
import ShortcutDateRangePicker from '#/components/shortcut-date-range-picker/shortcut-date-range-picker.vue';
import { $t } from '#/locales';

import { getProductSummaryChartOptions } from './summary-chart-options';

/** 商品概况 */
defineOptions({ name: 'ProductSummaryCard' });

const trendLoading = ref(true); // 商品状态加载中
const exportLoading = ref(false); // 导出的加载中
const trendSummary =
  ref<DataComparisonRespVO<MallProductStatisticsApi.ProductStatisticsRespVO>>(); // 商品状况统计数据
const searchTimes = ref<string[]>([]);

const chartRef = ref<EchartsUIType>();
const { renderEcharts } = useEcharts(chartRef);

/** 计算环比百分比 */
const calculateRelativeRate = (value?: number, reference?: number): string => {
  const refValue = Number(reference || 0);
  const curValue = Number(value || 0);
  if (!refValue || refValue === 0) {
    return '0.00';
  }
  return (((curValue - refValue) / refValue) * 100).toFixed(2);
};

/** 处理日期范围变化 */
const handleDateRangeChange = (times?: [Dayjs, Dayjs]) => {
  if (times?.length !== 2) {
    loadProductTrendData();
    return;
  }
  // 处理时间: 开始与截止在同一天的, 折线图出不来, 需要延长一天
  let adjustedTimes = times;
  if (isSameDay(times[0], times[1])) {
    adjustedTimes = [dayjs(times[0]).subtract(1, 'd'), times[1]];
  }
  searchTimes.value = [
    formatDateTime(adjustedTimes[0]) as string,
    formatDateTime(adjustedTimes[1]) as string,
  ];

  // 查询数据
  loadProductTrendData();
};

/** 处理商品状况查询 */
const loadProductTrendData = async () => {
  trendLoading.value = true;
  try {
    await Promise.all([loadProductTrendSummary(), loadProductStatisticsList()]);
  } finally {
    trendLoading.value = false;
  }
};

/** 查询商品状况数据统计 */
async function loadProductTrendSummary() {
  trendSummary.value = await getProductStatisticsAnalyse({
    times: searchTimes.value.length > 0 ? searchTimes.value : undefined,
  });
}

/** 查询商品状况数据列表 */
async function loadProductStatisticsList() {
  const list = await getProductStatisticsList({
    times: searchTimes.value.length > 0 ? searchTimes.value : undefined,
  });

  // 渲染图表
  await renderEcharts(getProductSummaryChartOptions(list));
}

/** 导出按钮操作 */
async function handleExport() {
  try {
    // 导出的二次确认
    await confirm({
      content: '确认导出商品状况数据吗？',
    });
    // 发起导出
    exportLoading.value = true;
    const data = await exportProductStatisticsExcel({
      times: searchTimes.value.length > 0 ? searchTimes.value : undefined,
    });
    // 处理下载
    downloadFileFromBlobPart({ fileName: '商品状况.xlsx', source: data });
  } finally {
    exportLoading.value = false;
  }
}
</script>

<template>
  <Card :bordered="false" :title="$t('statistics.product.summary.title')" class="h-full">
    <template #extra>
      <!-- 查询条件 -->
      <div class="flex items-center gap-2">
        <ShortcutDateRangePicker @change="handleDateRangeChange">
          <Button class="ml-4" @click="handleExport" :loading="exportLoading">
            <template #icon>
              <IconifyIcon icon="lucide:download" />
            </template>
            {{ $t('page.action.export') }}
          </Button>
        </ShortcutDateRangePicker>
      </div>
    </template>

    <!-- 统计值 -->
    <Row :gutter="16" class="mb-4">
      <Col :xl="8" :md="8" :sm="24" class="mb-4">
        <SummaryCard
          :title="$t('statistics.product.summary.browseCount')"
          :tooltip="$t('statistics.product.summary.browseCountTip')"
          icon="lucide:eye"
          icon-color="text-blue-500"
          icon-bg-color="bg-blue-100"
          :decimals="0"
          :value="trendSummary?.value?.browseCount || 0"
          :percent="
            calculateRelativeRate(
              trendSummary?.value?.browseCount,
              trendSummary?.reference?.browseCount,
            )
          "
        />
      </Col>
      <Col :xl="8" :md="8" :sm="24" class="mb-4">
        <SummaryCard
          :title="$t('statistics.product.summary.browseUserCount')"
          :tooltip="$t('statistics.product.summary.browseUserCountTip')"
          icon="lucide:users"
          icon-color="text-purple-500"
          icon-bg-color="bg-purple-100"
          :decimals="0"
          :value="trendSummary?.value?.browseUserCount || 0"
          :percent="
            calculateRelativeRate(
              trendSummary?.value?.browseUserCount,
              trendSummary?.reference?.browseUserCount,
            )
          "
        />
      </Col>
      <Col :xl="8" :md="8" :sm="24" class="mb-4">
        <SummaryCard
          :title="$t('statistics.product.summary.orderPayCount')"
          :tooltip="$t('statistics.product.summary.orderPayCountTip')"
          icon="lucide:credit-card"
          icon-color="text-yellow-500"
          icon-bg-color="bg-yellow-100"
          :decimals="0"
          :value="trendSummary?.value?.orderPayCount || 0"
          :percent="
            calculateRelativeRate(
              trendSummary?.value?.orderPayCount,
              trendSummary?.reference?.orderPayCount,
            )
          "
        />
      </Col>
      <Col :xl="8" :md="8" :sm="24" class="mb-4">
        <SummaryCard
          :title="$t('statistics.product.summary.orderPayPrice')"
          :tooltip="$t('statistics.product.summary.orderPayPriceTip')"
          icon="lucide:banknote"
          icon-color="text-green-500"
          icon-bg-color="bg-green-100"
          prefix="￥"
          :decimals="2"
          :value="Number(fenToYuan(trendSummary?.value?.orderPayPrice || 0))"
          :percent="
            calculateRelativeRate(
              trendSummary?.value?.orderPayPrice,
              trendSummary?.reference?.orderPayPrice,
            )
          "
        />
      </Col>
      <Col :xl="8" :md="8" :sm="24" class="mb-4">
        <SummaryCard
          :title="$t('statistics.product.summary.afterSaleCount')"
          :tooltip="$t('statistics.product.summary.afterSaleCountTip')"
          icon="lucide:wallet"
          icon-color="text-cyan-500"
          icon-bg-color="bg-cyan-100"
          :decimals="0"
          :value="trendSummary?.value?.afterSaleCount || 0"
          :percent="
            calculateRelativeRate(
              trendSummary?.value?.afterSaleCount,
              trendSummary?.reference?.afterSaleCount,
            )
          "
        />
      </Col>
      <Col :xl="8" :md="8" :sm="24" class="mb-4">
        <SummaryCard
          :title="$t('statistics.product.summary.afterSaleRefundPrice')"
          :tooltip="$t('statistics.product.summary.afterSaleRefundPriceTip')"
          icon="lucide:receipt"
          icon-color="text-orange-500"
          icon-bg-color="bg-orange-100"
          prefix="￥"
          :decimals="2"
          :value="
            Number(fenToYuan(trendSummary?.value?.afterSaleRefundPrice || 0))
          "
          :percent="
            calculateRelativeRate(
              trendSummary?.value?.afterSaleRefundPrice,
              trendSummary?.reference?.afterSaleRefundPrice,
            )
          "
        />
      </Col>
    </Row>

    <!-- 折线图 -->
    <Spin :spinning="trendLoading">
      <EchartsUI ref="chartRef" />
    </Spin>
  </Card>
</template>
