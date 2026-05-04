<script lang="ts" setup>
import type { Dayjs } from 'dayjs';

import type { EchartsUIType } from '@vben/plugins/echarts';

import { onMounted, ref } from 'vue';

import { EchartsUI, useEcharts } from '@vben/plugins/echarts';

import { Card, Radio, RadioGroup, Spin } from 'ant-design-vue';
import dayjs from 'dayjs';

import { getMemberRegisterCountList } from '#/api/mall/statistics/member';
import { $t } from '#/locales';

import {
  getMemberStatisticsChartOptions,
  TimeRangeTypeEnum,
} from './member-statistics-chart-options';

/** 会员用户统计卡片 */
defineOptions({ name: 'MemberStatisticsCard' });

const loading = ref(false);
const chartRef = ref<EchartsUIType>();
const { renderEcharts } = useEcharts(chartRef);

const timeRangeConfig = {
  [TimeRangeTypeEnum.DAY30]: {
    name: $t('mall-product.home.timeRange.day30'),
  },
  [TimeRangeTypeEnum.WEEK]: {
    name: $t('mall-product.home.timeRange.week'),
  },
  [TimeRangeTypeEnum.MONTH]: {
    name: $t('mall-product.home.timeRange.month'),
  },
  [TimeRangeTypeEnum.YEAR]: {
    name: $t('mall-product.home.timeRange.year'),
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
  await loadMemberRegisterCountList(beginTime, endTime);
}

async function loadMemberRegisterCountList(beginTime: Dayjs, endTime: Dayjs) {
  loading.value = true;
  try {
    const list = await getMemberRegisterCountList(
      beginTime.toDate(),
      endTime.toDate(),
    );
    // 更新 Echarts 数据
    await renderEcharts(getMemberStatisticsChartOptions(list));
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
        <span>{{ $t('mall-product.home.memberStatistics') }}</span>
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
      <EchartsUI ref="chartRef" class="h-[300px] w-full" />
    </Spin>
  </Card>
</template>
