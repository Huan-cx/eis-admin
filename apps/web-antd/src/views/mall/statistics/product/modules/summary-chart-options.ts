import { $t } from '@vben/locales';

/** 商品统计折线图配置 */
export function getProductSummaryChartOptions(data: any[]): any {
  // 处理数据：将金额从分转换为元
  const processedData = data.map((item) => ({
    ...item,
    orderPayPrice: Number((item.orderPayPrice / 100).toFixed(2)),
    afterSaleRefundPrice: Number((item.afterSaleRefundPrice / 100).toFixed(2)),
  }));

  return {
    dataset: {
      dimensions: [
        'time',
        'browseCount',
        'browseUserCount',
        'orderPayPrice',
        'afterSaleRefundPrice',
      ],
      source: processedData,
    },
    grid: {
      left: 20,
      right: 20,
      bottom: 20,
      top: 80,
      containLabel: true,
    },
    legend: {
      top: 50,
    },
    series: [
      {
        name: $t('statistics.product.summary.browseCount'),
        type: 'line',
        smooth: true,
        itemStyle: { color: '#B37FEB' },
      },
      {
        name: $t('statistics.product.summary.browseUserCount'),
        type: 'line',
        smooth: true,
        itemStyle: { color: '#FFAB2B' },
      },
      {
        name: $t('statistics.product.summary.orderPayPrice'),
        type: 'bar',
        smooth: true,
        yAxisIndex: 1,
        itemStyle: { color: '#1890FF' },
      },
      {
        name: $t('statistics.product.summary.afterSaleRefundPrice'),
        type: 'bar',
        smooth: true,
        yAxisIndex: 1,
        itemStyle: { color: '#00C050' },
      },
    ],
    toolbox: {
      feature: {
        // 数据区域缩放
        dataZoom: {
          yAxisIndex: false, // Y轴不缩放
        },
        brush: {
          type: ['lineX', 'clear'], // 区域缩放按钮、还原按钮
        },
        saveAsImage: {
          show: true,
          name: $t('statistics.product.summary.title'),
        }, // 保存为图片
      },
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
      },
      padding: [5, 10],
    },
    xAxis: {
      type: 'category',
      boundaryGap: true,
      axisTick: {
        show: false,
      },
    },
    yAxis: [
      {
        type: 'value',
        name: $t('statistics.product.summary.amount'),
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          color: '#7F8B9C',
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: '#F5F7F9',
          },
        },
      },
      {
        type: 'value',
        name: $t('statistics.product.summary.count'),
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          color: '#7F8B9C',
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: '#F5F7F9',
          },
        },
      },
    ],
  };
}
