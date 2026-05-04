import type { MallCouponTemplateApi } from '#/api/mall/promotion/coupon/couponTemplate';

import {
  CouponTemplateValidityTypeEnum,
  PromotionDiscountTypeEnum,
} from '@vben/constants';
import { floatToFixed2, formatDate } from '@vben/utils';
import { $t } from '#/locales';

/** 格式化【优惠金额/折扣】 */
export function discountFormat(row: MallCouponTemplateApi.CouponTemplate) {
  if (row.discountType === PromotionDiscountTypeEnum.PRICE.type) {
    return `${$t('promotion.coupon.template.unit.yuan')}${floatToFixed2(row.discountPrice)}`;
  }
  if (row.discountType === PromotionDiscountTypeEnum.PERCENT.type) {
    return `${row.discountPercent}%`;
  }
  return `${$t('promotion.coupon.formatter.unknown')}【${row.discountType}】`;
}

/** 格式化【领取上限】 */
export function takeLimitCountFormat(
  row: MallCouponTemplateApi.CouponTemplate,
) {
  if (row.takeLimitCount) {
    if (row.takeLimitCount === -1) {
      return $t('promotion.coupon.formatter.unlimited');
    }
    return `${row.takeLimitCount} ${$t('promotion.coupon.formatter.perPerson')}`;
  } else {
    return ' ';
  }
}

/** 格式化【有效期限】 */
export function validityTypeFormat(row: MallCouponTemplateApi.CouponTemplate) {
  if (row.validityType === CouponTemplateValidityTypeEnum.DATE.type) {
    return `${formatDate(row.validStartTime)} ${$t('promotion.coupon.formatter.to')} ${formatDate(row.validEndTime)}`;
  }
  if (row.validityType === CouponTemplateValidityTypeEnum.TERM.type) {
    return `${$t('promotion.coupon.formatter.validAfterReceive')} ${row.fixedStartTerm} - ${row.fixedEndTerm} ${$t('promotion.coupon.formatter.daysValid')}`;
  }
  return `${$t('promotion.coupon.formatter.unknown')}【${row.validityType}】`;
}

/** 格式化【totalCount】 */
export function totalCountFormat(row: MallCouponTemplateApi.CouponTemplate) {
  if (row.totalCount === -1) {
    return $t('promotion.coupon.formatter.unlimited');
  }
  return row.totalCount;
}

/** 格式化【剩余数量】 */
export function remainedCountFormat(row: MallCouponTemplateApi.CouponTemplate) {
  if (row.totalCount === -1) {
    return $t('promotion.coupon.formatter.unlimited');
  }
  return row.totalCount - row.takeCount;
}

/** 格式化【最低消费】 */
export function usePriceFormat(row: MallCouponTemplateApi.CouponTemplate) {
  return `${$t('promotion.coupon.template.unit.yuan')}${floatToFixed2(row.usePrice)}`;
}
