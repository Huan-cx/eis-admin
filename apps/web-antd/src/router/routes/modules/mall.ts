import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    path: '/mall/product',
    name: 'ProductCenter',
    meta: {
      title: $t('page.mall.product.center'),
      icon: 'lucide:shopping-bag',
      keepAlive: true,
      hideInMenu: true,
    },
    children: [
      {
        path: 'spu/add',
        name: 'ProductSpuAdd',
        meta: {
          title: $t('page.mall.product.add'),
          activePath: '/mall/product/spu',
        },
        component: () => import('#/views/mall/product/spu/form/index.vue'),
      },
      {
        path: String.raw`spu/edit/:id(\d+)`,
        name: 'ProductSpuEdit',
        meta: {
          title: $t('page.mall.product.edit'),
          activePath: '/mall/product/spu',
        },
        component: () => import('#/views/mall/product/spu/form/index.vue'),
      },
      {
        path: String.raw`spu/detail/:id(\d+)`,
        name: 'ProductSpuDetail',
        meta: {
          title: $t('page.mall.product.detail'),
          activePath: '/mall/product/spu',
        },
        component: () => import('#/views/mall/product/spu/form/index.vue'),
      },
    ],
  },
  {
    path: '/mall/trade',
    name: 'TradeCenter',
    meta: {
      title: $t('page.mall.trade.center'),
      icon: 'lucide:shopping-cart',
      keepAlive: true,
      hideInMenu: true,
    },
    children: [
      {
        path: String.raw`order/detail/:id(\d+)`,
        name: 'TradeOrderDetail',
        meta: {
          title: $t('page.mall.trade.order.detail'),
          activePath: '/mall/trade/order',
        },
        component: () => import('#/views/mall/trade/order/detail/index.vue'),
      },
      {
        path: String.raw`order-shipment/detail/:id(\d+)`,
        name: 'TradeOrderShipmentDetail',
        meta: {
          title: $t('page.mall.trade.shipment.detail'),
          activePath: '/mall/trade/order-shipment',
        },
        component: () =>
          import('#/views/mall/trade/orderShipment/detail/index.vue'),
      },
      {
        path: String.raw`after-sale/detail/:id(\d+)`,
        name: 'TradeAfterSaleDetail',
        meta: {
          title: $t('page.mall.trade.afterSale.detail'),
          activePath: '/mall/trade/after-sale',
        },
        component: () =>
          import('#/views/mall/trade/afterSale/detail/index.vue'),
      },
      {
        path: 'b2b/rfq/detail/:id',
        name: 'TradeB2BRfqDetailPage',
        meta: {
          title: $t('page.mall.trade.b2b.rfq.detail'),
          activePath: '/mall/trade/b2b/rfq',
        },
        component: () => import('#/views/mall/trade/b2b/rfq/detail/index.vue'),
      },
      {
        path: 'b2b/quotation/detail/:id',
        name: 'TradeB2BQuotationDetailPage',
        meta: {
          title: $t('page.mall.trade.b2b.quotation.detail'),
          activePath: '/mall/trade/b2b/quotation',
        },
        component: () =>
          import('#/views/mall/trade/b2b/quotation/detail/index.vue'),
      },
      {
        path: 'b2b/quotation/form',
        name: 'TradeB2BQuotationFormPage',
        meta: {
          title: $t('page.mall.trade.b2b.quotation.edit'),
          activePath: '/mall/trade/b2b/quotation',
        },
        component: () =>
          import('#/views/mall/trade/b2b/quotation/form/index.vue'),
      },
      {
        path: 'b2b/quotation/form/:id',
        name: 'TradeB2BQuotationEditPage',
        meta: {
          title: $t('page.mall.trade.b2b.quotation.edit'),
          activePath: '/mall/trade/b2b/quotation',
        },
        component: () =>
          import('#/views/mall/trade/b2b/quotation/form/index.vue'),
      },
      {
        path: 'b2b/compare',
        name: 'TradeB2BCompare',
        meta: {
          title: $t('page.mall.trade.b2b.compare'),
          activePath: '/mall/trade/b2b/rfq',
        },
        component: () => import('#/views/mall/trade/b2b/compare/index.vue'),
      },
    ],
  },
  {
    path: '/diy',
    name: 'DiyCenter',
    meta: {
      title: $t('page.mall.promotion.center'),
      icon: 'lucide:shopping-bag',
      keepAlive: true,
      hideInMenu: true,
    },
    children: [
      {
        path: String.raw`template/decorate/:id(\d+)`,
        name: 'DiyTemplateDecorate',
        meta: {
          title: $t('page.mall.promotion.diy.decorate'),
          activePath: '/mall/promotion/diy-template/diy-template',
        },
        component: () =>
          import('#/views/mall/promotion/diy/template/decorate/index.vue'),
      },
      {
        path: 'page/decorate/:id',
        name: 'DiyPageDecorate',
        meta: {
          title: '页面装修',
          noCache: false,
          hidden: true,
          activePath: '/mall/promotion/diy-template/diy-page',
        },
        component: () =>
          import('#/views/mall/promotion/diy/page/decorate/index.vue'),
      },
    ],
  },
];

export default routes;
