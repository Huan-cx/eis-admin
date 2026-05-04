import { $t } from '#/locales';

/** 会员终端统计图配置 */
export function getTerminalChartOptions(data: any[]): any {
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
        name: $t('statistics.member.terminal.title'),
        type: 'pie',
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
