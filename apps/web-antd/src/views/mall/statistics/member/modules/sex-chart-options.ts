import { $t } from '#/locales';

/** 会员性别比例图表配置 */
export function getSexChartOptions(data: any[]): any {
  return {
    tooltip: {
      trigger: 'item',
      confine: true,
      formatter: '{a} <br/>{b} : {c} ({d}%)',
    },
    legend: {
      orient: 'vertical',
      left: 'right',
    },
    series: [
      {
        name: $t('statistics.member.sex.title'),
        type: 'pie',
        roseType: 'area',
        label: {
          show: false,
        },
        labelLine: {
          show: false,
        },
        data,
      },
    ],
  };
}
