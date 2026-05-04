<script lang="ts" setup>
import type { Dayjs } from 'dayjs';

import type { EchartsUIType } from '@vben/plugins/echarts';

import { onMounted, ref } from 'vue';

import { EchartsUI, useEcharts } from '@vben/plugins/echarts';
import { fenToYuan } from '@vben/utils';

import { Card, Radio, RadioGroup, Spin } from 'ant-design-vue';
import dayjs from 'dayjs';

import { getOrderCountTrendComparison } from '#/api/mall/statistics/trade';
import { $t } from '#/locales';

import {
  getTradeTrendChartOptions,
  TimeRangeTypeEnum,
} from './trade-trend-chart-options';

/** 交易量趋势 */
defineOptions({ name: 'TradeTrendCard' });

const loading = ref(false);
const chartRef = ref<EchartsUIType>();
const { renderEcharts } = useEcharts(chartRef);

const timeRangeConfig = {
  [TimeRangeTypeEnum.DAY30]: {
    name: $t('mall-product.home.timeRange.day30'),
    seriesCount: 2,
  },
  [TimeRangeTypeEnum.WEEK]: {
    name: $t('mall-product.home.timeRange.week'),
    seriesCount: 4,
  },
  [TimeRangeTypeEnum.MONTH]: {
    name: $t('mall-product.home.timeRange.month'),
    seriesCount: 4,
  },
  [TimeRangeTypeEnum.YEAR]: {
    name: $t('mall-product.home.timeRange.year'),
    seriesCount: 4,
  },
}; // 时间范围 Map
const timeRangeType = ref(TimeRangeTypeEnum.DAY30); // 日期快捷选择按钮, 默认 30 天

/** 时间范围类型单选按钮选中 */
async function handleTimeRangeTypeChange() {
  // 设置时间范围
  let beginTime: Dayjs;
  let endTime: Dayjs;
  switch (timeRangeType.value) {
    case TimeRangeTypeEnum.DAY30: {
      beginTime = dayjs().subtract(30, 'day').startOf('d');
      endTime = dayjs().endOf('d');
      break;
    }
    case TimeRangeTypeEnum.MONTH: {
      beginTime = dayjs().startOf('month');
      endTime = dayjs().endOf('month');
      break;
    }
    case TimeRangeTypeEnum.WEEK: {
      beginTime = dayjs().startOf('week');
      endTime = dayjs().endOf('week');
      break;
    }
    case TimeRangeTypeEnum.YEAR: {
      beginTime = dayjs().startOf('year');
      endTime = dayjs().endOf('year');
      break;
    }
    default: {
      throw new Error(`未知的时间范围类型: ${timeRangeType.value}`);
    }
  }
  // 发送时间范围选中事件
  await loadOrderCountTrendComparison(beginTime, endTime);
}

/** 查询订单数量趋势对照数据 */
async function loadOrderCountTrendComparison(beginTime: Dayjs, endTime: Dayjs) {
  loading.value = true;
  try {
    // 1. 查询数据
    const list = await getOrderCountTrendComparison(
      timeRangeType.value,
      beginTime.toDate(),
      endTime.toDate(),
    );
    // 2. 处理数据
    const dates: string[] = [];
    const series: any[] = [];
    const config = timeRangeConfig[timeRangeType.value];
    // 情况一：seriesCount 为 2（近 30 天）
    if (config.seriesCount === 2) {
      const orderPayPriceData: string[] = [];
      const orderPayCountData: number[] = [];
      for (const item of list) {
        dates.push(item.value.date);
        orderPayPriceData.push(fenToYuan(item?.value?.orderPayPrice || 0));
        orderPayCountData.push(item?.value?.orderPayCount || 0);
      }
      series.push(
        {
          name: $t('mall-product.home.orderAmount'),
          type: 'bar',
          smooth: true,
          data: orderPayPriceData,
        },
        {
          name: $t('mall-product.home.orderQuantity'),
          type: 'line',
          smooth: true,
          data: orderPayCountData,
        },
      );
    } else {
      // 情况二：seriesCount 为 4
      const refPriceData: string[] = [];
      const curPriceData: string[] = [];
      const refCountData: number[] = [];
      const curCountData: number[] = [];
      for (const item of list) {
        dates.push(item.value.date);
        refPriceData.push(fenToYuan(item?.reference?.orderPayPrice || 0));
        curPriceData.push(fenToYuan(item?.value?.orderPayPrice || 0));
        refCountData.push(item?.reference?.orderPayCount || 0);
        curCountData.push(item?.value?.orderPayCount || 0);
      }
      // 根据时间范围类型确定对照数据的标签文本
      let timeLabel: string[];
      if (timeRangeType.value === TimeRangeTypeEnum.WEEK) {
        timeLabel = [
          $t('mall-product.home.lastWeek'),
          $t('mall-product.home.thisWeek'),
        ];
      } else if (timeRangeType.value === TimeRangeTypeEnum.MONTH) {
        timeLabel = [
          $t('mall-product.home.lastMonth'),
          $t('mall-product.home.thisMonth'),
        ];
      } else {
        timeLabel = [
          $t('mall-product.home.lastYear'),
          $t('mall-product.home.thisYear'),
        ];
      }
      series.push(
        {
          name: `${timeLabel[0]}${$t('mall-product.home.orderAmount')}`,
          type: 'bar',
          smooth: true,
          data: refPriceData,
        },
        {
          name: `${timeLabel[1]}${$t('mall-product.home.orderAmount')}`,
          type: 'bar',
          smooth: true,
          data: curPriceData,
        },
        {
          name: `${timeLabel[0]}${$t('mall-product.home.orderQuantity')}`,
          type: 'line',
          smooth: true,
          data: refCountData,
        },
        {
          name: `${timeLabel[1]}${$t('mall-product.home.orderQuantity')}`,
          type: 'line',
          smooth: true,
          data: curCountData,
        },
      );
    }

    // 3. 渲染 Echarts 界面
    await renderEcharts(
      getTradeTrendChartOptions(dates, series, timeRangeType.value),
    );
  } finally {
    loading.value = false;
  }
}

/** 初始化 */
onMounted(() => {
  handleTimeRangeTypeChange();
});
</script>

<template>
  <Card :bordered="false">
    <template #title>
      <div class="flex items-center justify-between">
        <span>{{ $t('mall-product.home.tradeTrend') }}</span>
        <RadioGroup
          v-model:value="timeRangeType"
          @change="handleTimeRangeTypeChange"
        >
          <Radio
            v-for="[key, value] in Object.entries(timeRangeConfig)"
            :key="key"
            :value="Number(key)"
          >
            {{ value.name }}
          </Radio>
        </RadioGroup>
      </div>
    </template>
    <Spin :spinning="loading">
      <EchartsUI ref="chartRef" class="w-full" />
    </Spin>
  </Card>
</template>
