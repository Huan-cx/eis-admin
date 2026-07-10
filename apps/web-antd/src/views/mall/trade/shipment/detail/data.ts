import type { VxeGridPropTypes } from '#/adapter/vxe-table';

import { $t } from '#/locales';

export function usePackingListColumns(): VxeGridPropTypes.Columns {
  return [
    { type: 'seq', title: $t('trade.shipment.grid.index'), width: 60 },
    {
      field: 'skuCode',
      title: $t('trade.shipment.detail.skuCode'),
      minWidth: 120,
    },
    {
      field: 'spuName',
      title: $t('trade.shipment.detail.productName'),
      minWidth: 150,
    },
    {
      field: 'skuName',
      title: $t('trade.shipment.grid.description'),
      minWidth: 180,
    },
    {
      field: 'hsCode',
      title: $t('trade.shipment.grid.hsCode'),
      minWidth: 120,
    },
    {
      field: 'count',
      title: $t('trade.shipment.grid.quantity'),
      minWidth: 100,
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
      field: 'ctns',
      title: $t('trade.shipment.detail.ctns'),
      minWidth: 80,
    },
    {
      field: 'totalNw',
      title: $t('trade.shipment.grid.totalNw'),
      minWidth: 100,
    },
    {
      field: 'totalGw',
      title: $t('trade.shipment.grid.totalGw'),
      minWidth: 100,
    },
    {
      field: 'length',
      title: $t('trade.shipment.grid.length'),
      minWidth: 80,
    },
    {
      field: 'width',
      title: $t('trade.shipment.grid.width'),
      minWidth: 80,
    },
    {
      field: 'height',
      title: $t('trade.shipment.grid.height'),
      minWidth: 80,
    },
    {
      field: 'unit',
      title: $t('trade.shipment.grid.unit'),
      minWidth: 80,
    },
    {
      field: 'totalCbm',
      title: $t('trade.shipment.grid.totalCbm'),
      minWidth: 100,
    },
    {
      field: 'remark',
      title: $t('trade.shipment.form.remark'),
      minWidth: 150,
    },
  ];
}
