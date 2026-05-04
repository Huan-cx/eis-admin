/** APP 链接分组 */
export interface AppLinkGroup {
  name: string; // 分组名称
  links: AppLink[]; // 链接列表
}

/** APP 链接 */
export interface AppLink {
  name: string; // 链接名称
  path: string; // 链接地址
  type?: APP_LINK_TYPE_ENUM; // 链接的类型
}

/** APP 链接类型（需要特殊处理，例如商品详情） */
export enum APP_LINK_TYPE_ENUM {
  ACTIVITY_COMBINATION, // 拼团活动
  ACTIVITY_POINT, // 积分商城活动
  ACTIVITY_SECKILL, // 秒杀活动
  ARTICLE_DETAIL, // 文章详情
  COUPON_DETAIL, // 优惠券详情
  DIY_PAGE_DETAIL, // 自定义页面详情
  PRODUCT_CATEGORY_LIST, // 品类列表
  PRODUCT_DETAIL_COMBINATION, // 拼团商品详情
  PRODUCT_DETAIL_NORMAL, // 商品详情
  PRODUCT_DETAIL_SECKILL, // 秒杀商品详情
  PRODUCT_LIST, // 商品列表
}

import { $t } from '#/locales';

/** APP 链接列表（做一下持久化？） */
export const APP_LINK_GROUP_LIST = [
  {
    name: $t('promotion.appLink.mall'),
    links: [
      {
        name: $t('promotion.appLink.home'),
        path: '/pages/index/index',
      },
      {
        name: $t('promotion.appLink.productCategory'),
        path: '/pages/index/category',
        type: APP_LINK_TYPE_ENUM.PRODUCT_CATEGORY_LIST,
      },
      {
        name: $t('promotion.appLink.cart'),
        path: '/pages/index/cart',
      },
      {
        name: $t('promotion.appLink.userCenter'),
        path: '/pages/index/user',
      },
      {
        name: $t('promotion.appLink.productSearch'),
        path: '/pages/index/search',
      },
      {
        name: $t('promotion.appLink.customPage'),
        path: '/pages/index/page',
        type: APP_LINK_TYPE_ENUM.DIY_PAGE_DETAIL,
      },
      {
        name: $t('promotion.appLink.customerService'),
        path: '/pages/chat/index',
      },
      {
        name: $t('promotion.appLink.systemSettings'),
        path: '/pages/public/setting',
      },
      {
        name: $t('promotion.appLink.faq'),
        path: '/pages/public/faq',
      },
    ],
  },
  {
    name: $t('promotion.appLink.product'),
    links: [
      {
        name: $t('promotion.appLink.productList'),
        path: '/pages/goods/list',
        type: APP_LINK_TYPE_ENUM.PRODUCT_LIST,
      },
      {
        name: $t('promotion.appLink.productDetail'),
        path: '/pages/goods/index',
        type: APP_LINK_TYPE_ENUM.PRODUCT_DETAIL_NORMAL,
      },
      {
        name: $t('promotion.appLink.groupProductDetail'),
        path: '/pages/goods/groupon',
        type: APP_LINK_TYPE_ENUM.PRODUCT_DETAIL_COMBINATION,
      },
      {
        name: $t('promotion.appLink.seckillProductDetail'),
        path: '/pages/goods/seckill',
        type: APP_LINK_TYPE_ENUM.PRODUCT_DETAIL_SECKILL,
      },
    ],
  },
  {
    name: $t('promotion.appLink.marketing'),
    links: [
      {
        name: $t('promotion.appLink.groupOrder'),
        path: '/pages/activity/groupon/order',
      },
      {
        name: $t('promotion.appLink.marketingProduct'),
        path: '/pages/activity/index',
      },
      {
        name: $t('promotion.appLink.groupActivity'),
        path: '/pages/activity/groupon/list',
        type: APP_LINK_TYPE_ENUM.ACTIVITY_COMBINATION,
      },
      {
        name: $t('promotion.appLink.seckillActivity'),
        path: '/pages/activity/seckill/list',
        type: APP_LINK_TYPE_ENUM.ACTIVITY_SECKILL,
      },
      {
        name: $t('promotion.appLink.pointActivity'),
        path: '/pages/activity/point/list',
        type: APP_LINK_TYPE_ENUM.ACTIVITY_POINT,
      },
      {
        name: $t('promotion.appLink.signIn'),
        path: '/pages/app/sign',
      },
      {
        name: $t('promotion.appLink.couponCenter'),
        path: '/pages/coupon/list',
      },
      {
        name: $t('promotion.appLink.couponDetail'),
        path: '/pages/coupon/detail',
        type: APP_LINK_TYPE_ENUM.COUPON_DETAIL,
      },
      {
        name: $t('promotion.appLink.articleDetail'),
        path: '/pages/public/richtext',
        type: APP_LINK_TYPE_ENUM.ARTICLE_DETAIL,
      },
    ],
  },
  {
    name: $t('promotion.appLink.distribution'),
    links: [
      {
        name: $t('promotion.appLink.distributionCenter'),
        path: '/pages/commission/index',
      },
      {
        name: $t('promotion.appLink.promotionProduct'),
        path: '/pages/commission/goods',
      },
      {
        name: $t('promotion.appLink.distributionOrder'),
        path: '/pages/commission/order',
      },
      {
        name: $t('promotion.appLink.myTeam'),
        path: '/pages/commission/team',
      },
    ],
  },
  {
    name: $t('promotion.appLink.payment'),
    links: [
      {
        name: $t('promotion.appLink.recharge'),
        path: '/pages/pay/recharge',
      },
      {
        name: $t('promotion.appLink.rechargeLog'),
        path: '/pages/pay/recharge-log',
      },
    ],
  },
  {
    name: $t('promotion.appLink.user'),
    links: [
      {
        name: $t('promotion.appLink.userInfo'),
        path: '/pages/user/info',
      },
      {
        name: $t('promotion.appLink.userOrder'),
        path: '/pages/order/list',
      },
      {
        name: $t('promotion.appLink.afterSaleOrder'),
        path: '/pages/order/aftersale/list',
      },
      {
        name: $t('promotion.appLink.productCollect'),
        path: '/pages/user/goods-collect',
      },
      {
        name: $t('promotion.appLink.browseHistory'),
        path: '/pages/user/goods-log',
      },
      {
        name: $t('promotion.appLink.addressManage'),
        path: '/pages/user/address/list',
      },
      {
        name: $t('promotion.appLink.userCommission'),
        path: '/pages/user/wallet/commission',
      },
      {
        name: $t('promotion.appLink.userBalance'),
        path: '/pages/user/wallet/money',
      },
      {
        name: $t('promotion.appLink.userPoint'),
        path: '/pages/user/wallet/score',
      },
    ],
  },
] as AppLinkGroup[];
