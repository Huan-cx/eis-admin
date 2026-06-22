import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { DescriptionItemSchema } from '#/components/description';

import { h } from 'vue';

import { DICT_TYPE } from '@vben/constants';
import { fenToYuan, formatDateTime } from '@vben/utils';

import { DictTag } from '#/components/dict-tag';
import { $t } from '#/locales';

/** 订单基础信息 schema */
export function useOrderInfoSchema(): DescriptionItemSchema[] {
  return [
    {
      field: 'no',
      label: $t('trade.order.detail.orderInfoSchema.no'),
    },
    {
      field: 'userName',
      label: $t('trade.order.detail.orderInfoSchema.buyer'),
    },
    {
      field: 'currency',
      label: $t('trade.order.detail.currency'),
    },
    {
      field: 'quotationNo',
      label: $t('trade.order.detail.noQuote'),
    },
    {
      field: 'contractNo',
      label: $t('trade.order.detail.contractNo'),
    },
    {
      field: 'payTime',
      label: $t('trade.order.detail.payTime'),
      render: (val) => (val ? (formatDateTime(val) as string) : '-'),
    },
    {
      field: 'deliveryTime',
      label: $t('trade.order.detail.deliveryTime'),
      render: (val) => (val ? (formatDateTime(val) as string) : '-'),
    },
    {
      field: 'createTime',
      label: $t('trade.order.detail.createdAt'),
      render: (val) => (val ? (formatDateTime(val) as string) : '-'),
    },
    {
      field: 'remark',
      label: $t('trade.order.detail.orderInfoSchema.remark'),
    },
  ];
}

/** 订单状态信息 schema */
export function useOrderStatusSchema(): DescriptionItemSchema[] {
  return [
    {
      field: 'status',
      label: $t('trade.order.detail.orderStatusSchema.status'),
      render: (val) =>
        h(DictTag, {
          type: DICT_TYPE.TRADE_ORDER_STATUS,
          value: val,
        }),
    },
    {
      field: 'approvalStatus',
      label: $t('trade.order.detail.approvalStatus'),
      render: (val) =>
        h(DictTag, {
          type: DICT_TYPE.TRADE_ORDER_APPROVAL_STATUS,
          value: val,
        }),
    },
    {
      field: 'payProgressStatus',
      label: $t('trade.order.detail.payProgress'),
      render: (val) =>
        h(DictTag, {
          type: DICT_TYPE.TRADE_ORDER_PAY_PROGRESS_STATUS,
          value: val,
        }),
    },
    {
      field: 'deliveryType',
      label: $t('trade.order.detail.deliveryType'),
      render: (val) =>
        h(DictTag, {
          type: DICT_TYPE.TRADE_DELIVERY_TYPE,
          value: val,
        }),
    },
  ];
}

/** 订单金额信息 schema */
export function useOrderPriceSchema(): DescriptionItemSchema[] {
  return [
    {
      field: 'totalPrice',
      label: $t('trade.order.detail.priceSchema.totalPrice'),
      render: (val) => `${fenToYuan(val ?? 0)} ${$t('common.yuan')}`,
    },
    {
      field: 'deliveryPrice',
      label: $t('trade.order.detail.priceSchema.deliveryPrice'),
      render: (val) => `${fenToYuan(val ?? 0)} ${$t('common.yuan')}`,
    },
    {
      field: 'payPrice',
      label: $t('trade.order.detail.priceSchema.payPrice'),
      render: (val) => `${fenToYuan(val ?? 0)} ${$t('common.yuan')}`,
    },
    {
      field: 'paidPrice',
      label: $t('trade.order.detail.paidAmount'),
      render: (val) =>
        h(
          'span',
          { class: 'text-green-500 font-medium' },
          `${fenToYuan(val ?? 0)} ${$t('common.yuan')}`,
        ),
    },
  ];
}

/** 收货信息 schema */
export function useDeliveryInfoSchema(): DescriptionItemSchema[] {
  return [
    {
      field: 'logisticsId',
      label: $t('trade.order.detail.logisticsNo'),
      span: 3,
    },
  ];
}

/** 商品信息 columns */
export function useProductColumns(): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'spuName',
      title: $t('trade.order.detail.productColumns.spuName'),
      minWidth: 300,
      slots: { default: 'spuName' },
    },
    {
      field: 'skuName',
      title: $t('trade.order.detail.productColumns.skuName'),
      minWidth: 150,
    },
    {
      field: 'skuCode',
      title: $t('trade.order.detail.productColumns.skuCode'),
      minWidth: 120,
    },
    {
      field: 'barCode',
      title: $t('trade.order.detail.productColumns.barCode'),
      minWidth: 120,
    },
    {
      field: 'minQty',
      title: $t('trade.order.detail.productColumns.minQty'),
      width: 100,
    },
    {
      field: 'unit',
      title: $t('trade.order.detail.productColumns.unit'),
      width: 80,
    },
    {
      field: 'weight',
      title: $t('trade.order.detail.productColumns.weight'),
      width: 100,
      formatter: ({ cellValue }) => {
        return cellValue ? `${cellValue} kg` : '-';
      },
    },
    {
      field: 'hsCode',
      title: $t('trade.order.detail.productColumns.hsCode'),
      minWidth: 120,
    },
    {
      field: 'packagingWay',
      title: $t('trade.order.detail.productColumns.packagingWay'),
      minWidth: 100,
    },
    {
      field: 'pcsPerCtn',
      title: $t('trade.order.detail.productColumns.pcsPerCtn'),
      width: 100,
    },
    {
      field: 'nwPerCtn',
      title: $t('trade.order.detail.productColumns.nwPerCtn'),
      width: 120,
      formatter: ({ cellValue }) => {
        return cellValue ? `${cellValue} kg` : '-';
      },
    },
    {
      field: 'gwPerCtn',
      title: $t('trade.order.detail.productColumns.gwPerCtn'),
      width: 120,
      formatter: ({ cellValue }) => {
        return cellValue ? `${cellValue} kg` : '-';
      },
    },
    {
      field: 'unitPrice',
      title: $t('trade.order.detail.productColumns.price'),
      width: 150,
      formatter: 'formatFenToYuanAmount',
    },
    {
      field: 'count',
      title: $t('trade.order.detail.productColumns.count'),
      width: 100,
    },
    {
      field: 'totalPrice',
      title: $t('trade.order.detail.subtotal'),
      width: 150,
      formatter: 'formatFenToYuanAmount',
    },
    {
      field: 'afterSaleStatus',
      title: $t('trade.order.detail.productColumns.afterSaleStatus'),
      width: 120,
      cellRender: {
        name: 'CellDict',
        props: { type: DICT_TYPE.TRADE_ORDER_ITEM_AFTER_SALE_STATUS },
      },
    },
  ];
}

/** 物流详情 columns */
export function useExpressTrackColumns(): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'time',
      title: $t('trade.order.detail.expressTrackColumns.time'),
      width: 180,
      formatter: 'formatDateTime',
    },
    {
      field: 'content',
      title: $t('trade.order.detail.expressTrackColumns.content'),
      minWidth: 300,
    },
  ];
}

/** 操作日志 columns */
export function useOperateLogColumns(): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'createTime',
      title: $t('trade.order.detail.operateLogColumns.createTime'),
      width: 180,
      formatter: 'formatDateTime',
    },
    {
      field: 'userType',
      title: $t('trade.order.detail.operateLogColumns.userType'),
      width: 100,
      slots: { default: 'userType' },
    },
    {
      field: 'content',
      title: $t('trade.order.detail.operateLogColumns.content'),
      minWidth: 200,
    },
  ];
}

/** 付款记录 columns */
export function usePaymentColumns(): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'paidAt',
      title: $t('trade.order.detail.payTime'),
      width: 180,
      formatter: 'formatDateTime',
    },
    {
      field: 'amount',
      title: $t('trade.order.form.payAmount'),
      width: 150,
      formatter: 'formatFenToYuanAmount',
    },
    {
      field: 'paymentMethod',
      title: $t('trade.order.detail.paymentMethod'),
      width: 120,
      cellRender: {
        name: 'CellDict',
        props: { type: DICT_TYPE.TRADE_ORDER_PAYMENT_METHOD },
      },
    },
    {
      field: 'payChannelCode',
      title: $t('trade.order.detail.paymentChannel'),
      width: 120,
      cellRender: {
        name: 'CellDict',
        props: { type: DICT_TYPE.PAY_CHANNEL_CODE },
      },
    },
    {
      field: 'remark',
      title: $t('trade.order.form.remark'),
      minWidth: 200,
    },
    {
      field: 'operatorName',
      title: $t('trade.order.detail.operator'),
      width: 120,
    },
  ];
}
