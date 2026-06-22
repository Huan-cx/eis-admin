import type { VxeGridPropTypes } from '#/adapter/vxe-table';

import { $t } from '#/locales';

/**
 * 装箱清单表格列配置
 */
export function usePackingListColumns(): VxeGridPropTypes.Columns {
  return [
    { type: 'seq', title: $t('trade.shipment.grid.index'), width: 60 },
    {
      field: 'skuCode',
      title: $t('trade.shipment.detail.skuCode'),
      minWidth: 120,
    },
    {
      field: 'productName',
      title: $t('trade.shipment.detail.productName'),
      minWidth: 200,
    },
    {
      field: 'packagingWay',
      title: $t('trade.shipment.detail.packagingWay'),
      minWidth: 100,
    },
    {
      field: 'pcsPerCtn',
      title: $t('trade.shipment.detail.pcsPerCtn'),
      minWidth: 100,
    },
    {
      field: 'quantity',
      title: $t('trade.shipment.detail.quantity'),
      minWidth: 100,
    },
    {
      field: 'ctns',
      title: $t('trade.shipment.detail.ctns'),
      minWidth: 80,
    },
    {
      field: 'nwPerCtn',
      title: $t('trade.shipment.detail.nwPerCtn'),
      minWidth: 120,
    },
    {
      field: 'gwPerCtn',
      title: $t('trade.shipment.detail.gwPerCtn'),
      minWidth: 120,
    },
    {
      field: 'cbmPerCtn',
      title: $t('trade.shipment.detail.cbmPerCtn'),
      minWidth: 120,
    },
    {
      field: 'totalNw',
      title: $t('trade.shipment.detail.totalNw'),
      minWidth: 120,
    },
    {
      field: 'totalGw',
      title: $t('trade.shipment.detail.totalGw'),
      minWidth: 120,
    },
    {
      field: 'totalCbm',
      title: $t('trade.shipment.detail.totalCbm'),
      minWidth: 120,
    },
    {
      field: 'remark',
      title: $t('trade.shipment.form.remark'),
      minWidth: 150,
    },
  ];
}
