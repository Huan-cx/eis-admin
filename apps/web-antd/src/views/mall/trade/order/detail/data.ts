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
      field: 'user.nickname',
      label: $t('trade.order.detail.orderInfoSchema.buyer'),
    },
    {
      field: 'type',
      label: $t('trade.order.detail.orderInfoSchema.type'),
      render: (val) =>
        h(DictTag, {
          type: DICT_TYPE.TRADE_ORDER_TYPE,
          value: val,
        }),
    },
    {
      field: 'terminal',
      label: $t('trade.order.detail.orderInfoSchema.terminal'),
      render: (val) =>
        h(DictTag, {
          type: DICT_TYPE.TERMINAL,
          value: val,
        }),
    },
    {
      field: 'userRemark',
      label: $t('trade.order.detail.orderInfoSchema.userRemark'),
    },
    {
      field: 'remark',
      label: $t('trade.order.detail.orderInfoSchema.remark'),
    },
    {
      field: 'payOrderId',
      label: $t('trade.order.detail.orderInfoSchema.payOrderId'),
    },
    {
      field: 'payChannelCode',
      label: $t('trade.order.detail.orderInfoSchema.payChannelCode'),
      render: (val) =>
        h(DictTag, {
          type: DICT_TYPE.PAY_CHANNEL_CODE,
          value: val,
        }),
    },
    {
      field: 'brokerageUser.nickname',
      label: $t('trade.order.detail.orderInfoSchema.brokerageUser'),
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
      field: 'reminder',
      label: $t('trade.order.detail.orderStatusSchema.reminder'),
      render: () =>
        h('div', { class: 'space-y-1' }, [
          h('div', $t('trade.order.detail.orderStatusSchema.reminder1')),
          h('div', $t('trade.order.detail.orderStatusSchema.reminder2')),
          h('div', $t('trade.order.detail.orderStatusSchema.reminder3')),
        ]),
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
      field: 'adjustPrice',
      label: $t('trade.order.detail.priceSchema.adjustPrice'),
      render: (val) => `${fenToYuan(val ?? 0)} ${$t('common.yuan')}`,
    },
    // {
    //   field: 'couponPrice',
    //   label: '优惠劵优惠',
    //   render: (val) =>
    //     h('span', { class: 'text-red-500' }, `${fenToYuan(val ?? 0)} 元`),
    // },
    // {
    //   field: 'vipPrice',
    //   label: 'VIP 优惠',
    //   render: (val) =>
    //     h('span', { class: 'text-red-500' }, `${fenToYuan(val ?? 0)} 元`),
    // },
    // {
    //   field: 'discountPrice',
    //   label: '活动优惠',
    //   render: (val) =>
    //     h('span', { class: 'text-red-500' }, `${fenToYuan(val ?? 0)} 元`),
    // },
    // {
    //   field: 'pointPrice',
    //   label: '积分抵扣',
    //   render: (val) =>
    //     h('span', { class: 'text-red-500' }, `${fenToYuan(val ?? 0)} 元`),
    // },
    {
      field: 'payPrice',
      label: $t('trade.order.detail.priceSchema.payPrice'),
      render: (val) => `${fenToYuan(val ?? 0)} ${$t('common.yuan')}`,
    },
  ];
}

/** 收货信息 schema */
export function useDeliveryInfoSchema(): DescriptionItemSchema[] {
  return [
    {
      field: 'deliveryType',
      label: $t('trade.order.detail.deliveryInfoSchema.deliveryType'),
      span: 3,
      render: (val) =>
        h(DictTag, {
          type: DICT_TYPE.TRADE_DELIVERY_TYPE,
          value: val,
        }),
    },
    {
      field: 'receiverAddress',
      label: $t('trade.order.detail.deliveryInfoSchema.receiverAddress'),
      render: (val) => {
        if (!val) return '';
        return h('div', [
          h(
            'div',
            `${$t('trade.order.detail.deliveryInfoSchema.receiver')}: ${val.firstName} ${val.lastName}`,
          ),
          val.companyName
            ? h(
                'div',
                `${$t('trade.order.detail.deliveryInfoSchema.company')}: ${val.companyName}`,
              )
            : null,
          h(
            'div',
            `${$t('trade.order.detail.deliveryInfoSchema.street')}: ${val.street}`,
          ),
          h('div', `${val.postcode} ${val.city}`),
          val.state
            ? h(
                'div',
                `${$t('trade.order.detail.deliveryInfoSchema.state')}: ${val.state}`,
              )
            : null,
          h(
            'div',
            `${$t('trade.order.detail.deliveryInfoSchema.country')}: ${val.country}`,
          ),
          h(
            'div',
            `${$t('trade.order.detail.deliveryInfoSchema.phone')}: ${val.phone}`,
          ),
          val.email
            ? h(
                'div',
                `${$t('trade.order.detail.deliveryInfoSchema.email')}: ${val.email}`,
              )
            : null,
          val.vat
            ? h(
                'div',
                `${$t('trade.order.detail.deliveryInfoSchema.vat')}: ${val.vat}`,
              )
            : null,
          val.eori
            ? h(
                'div',
                `${$t('trade.order.detail.deliveryInfoSchema.eori')}: ${val.eori}`,
              )
            : null,
        ]);
      },
    },
    {
      field: 'billingAddress',
      label: $t('trade.order.detail.deliveryInfoSchema.billingAddress'),
      render: (val) => {
        if (!val) return '';
        return h('div', [
          val.companyName
            ? h(
                'div',
                `${$t('trade.order.detail.deliveryInfoSchema.company')}: ${val.companyName}`,
              )
            : null,
          h(
            'div',
            `${$t('trade.order.detail.deliveryInfoSchema.name')}: ${val.firstName} ${val.lastName}`,
          ),
          h(
            'div',
            `${$t('trade.order.detail.deliveryInfoSchema.street')}: ${val.street}`,
          ),
          h('div', `${val.postcode} ${val.city}`),
          val.state
            ? h(
                'div',
                `${$t('trade.order.detail.deliveryInfoSchema.state')}: ${val.state}`,
              )
            : null,
          h(
            'div',
            `${$t('trade.order.detail.deliveryInfoSchema.country')}: ${val.country}`,
          ),
          h(
            'div',
            `${$t('trade.order.detail.deliveryInfoSchema.phone')}: ${val.phone}`,
          ),
          val.email
            ? h(
                'div',
                `${$t('trade.order.detail.deliveryInfoSchema.email')}: ${val.email}`,
              )
            : null,
          val.vat
            ? h(
                'div',
                `${$t('trade.order.detail.deliveryInfoSchema.vat')}: ${val.vat}`,
              )
            : null,
          val.eori
            ? h(
                'div',
                `${$t('trade.order.detail.deliveryInfoSchema.eori')}: ${val.eori}`,
              )
            : null,
        ]);
      },
    },
    {
      field: 'businessAddress',
      label: $t('trade.order.detail.deliveryInfoSchema.businessAddress'),
      render: (val) => {
        if (!val) return '';
        return h('div', [
          val.companyName
            ? h(
                'div',
                `${$t('trade.order.detail.deliveryInfoSchema.company')}: ${val.companyName}`,
              )
            : null,
          h(
            'div',
            `${$t('trade.order.detail.deliveryInfoSchema.name')}: ${val.firstName} ${val.lastName}`,
          ),
          h(
            'div',
            `${$t('trade.order.detail.deliveryInfoSchema.street')}: ${val.street}`,
          ),
          h('div', `${val.postcode} ${val.city}`),
          val.state
            ? h(
                'div',
                `${$t('trade.order.detail.deliveryInfoSchema.state')}: ${val.state}`,
              )
            : null,
          h(
            'div',
            `${$t('trade.order.detail.deliveryInfoSchema.country')}: ${val.country}`,
          ),
          h(
            'div',
            `${$t('trade.order.detail.deliveryInfoSchema.phone')}: ${val.phone}`,
          ),
          val.email
            ? h(
                'div',
                `${$t('trade.order.detail.deliveryInfoSchema.email')}: ${val.email}`,
              )
            : null,
          val.vat
            ? h(
                'div',
                `${$t('trade.order.detail.deliveryInfoSchema.vat')}: ${val.vat}`,
              )
            : null,
          val.eori
            ? h(
                'div',
                `${$t('trade.order.detail.deliveryInfoSchema.eori')}: ${val.eori}`,
              )
            : null,
        ]);
      },
    },
    {
      field: 'deliveryTime',
      label: $t('trade.order.detail.deliveryInfoSchema.deliveryTime'),
      render: (val) => formatDateTime(val) as string,
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
      field: 'price',
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
      field: 'payPrice',
      title: $t('trade.order.detail.productColumns.payPrice'),
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
