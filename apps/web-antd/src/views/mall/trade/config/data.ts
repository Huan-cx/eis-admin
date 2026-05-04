import type { VbenFormSchema } from '#/adapter/form';

import { DICT_TYPE } from '@vben/constants';
import { getDictOptions } from '@vben/hooks';

import { $t } from '#/locales';

export const schema: VbenFormSchema[] = [
  {
    component: 'Input',
    fieldName: 'id',
    dependencies: {
      triggerFields: [''],
      show: () => false,
    },
  },
  {
    component: 'Input',
    fieldName: 'type',
    dependencies: {
      triggerFields: [''],
      show: () => false,
    },
  },
  {
    fieldName: 'afterSaleRefundReasons',
    label: $t('trade.config.form.afterSaleRefundReasons'),
    component: 'Select',
    componentProps: {
      mode: 'tags',
      placeholder: $t('trade.config.form.afterSaleRefundReasonsPlaceholder'),
      class: 'w-full',
    },
    dependencies: {
      triggerFields: ['type'],
      show: (values) => values.type === 'afterSale',
    },
  },
  {
    fieldName: 'afterSaleReturnReasons',
    label: $t('trade.config.form.afterSaleReturnReasons'),
    component: 'Select',
    componentProps: {
      mode: 'tags',
      placeholder: $t('trade.config.form.afterSaleReturnReasonsPlaceholder'),
    },
    dependencies: {
      triggerFields: ['type'],
      show: (values) => values.type === 'afterSale',
    },
  },
  {
    fieldName: 'deliveryExpressFreeEnabled',
    label: $t('trade.config.form.deliveryExpressFreeEnabled'),
    component: 'Switch',
    rules: 'required',
    dependencies: {
      triggerFields: ['type'],
      show: (values) => values.type === 'delivery',
    },
    help: $t('trade.config.form.deliveryExpressFreeEnabledHelp'),
  },
  {
    fieldName: 'deliveryExpressFreePrice',
    label: $t('trade.config.form.deliveryExpressFreePrice'),
    component: 'InputNumber',
    componentProps: {
      min: 0,
      precision: 2,
      placeholder: $t('trade.config.form.deliveryExpressFreePricePlaceholder'),
      class: 'w-full',
    },
    rules: 'required',
    dependencies: {
      triggerFields: ['type'],
      show: (values) => values.type === 'delivery',
    },
    help: $t('trade.config.form.deliveryExpressFreePriceHelp'),
  },
  {
    fieldName: 'deliveryPickUpEnabled',
    label: $t('trade.config.form.deliveryPickUpEnabled'),
    component: 'Switch',
    rules: 'required',
    dependencies: {
      triggerFields: ['type'],
      show: (values) => values.type === 'delivery',
    },
  },
  {
    fieldName: 'brokerageEnabled',
    label: $t('trade.config.form.brokerageEnabled'),
    component: 'Switch',
    help: $t('trade.config.form.brokerageEnabledHelp'),
    dependencies: {
      triggerFields: ['type'],
      show: (values) => values.type === 'brokerage',
    },
  },
  {
    fieldName: 'brokerageEnabledCondition',
    label: $t('trade.config.form.brokerageEnabledCondition'),
    component: 'RadioGroup',
    componentProps: {
      options: getDictOptions(DICT_TYPE.BROKERAGE_ENABLED_CONDITION, 'number'),
      buttonStyle: 'solid',
      optionType: 'button',
    },
    rules: 'required',
    dependencies: {
      triggerFields: ['type'],
      show: (values) => values.type === 'brokerage',
    },
    help: $t('trade.config.form.brokerageEnabledConditionHelp'),
  },
  {
    fieldName: 'brokerageBindMode',
    label: $t('trade.config.form.brokerageBindMode'),
    component: 'RadioGroup',
    componentProps: {
      options: getDictOptions(DICT_TYPE.BROKERAGE_BIND_MODE, 'number'),
      buttonStyle: 'solid',
      optionType: 'button',
    },
    rules: 'required',
    dependencies: {
      triggerFields: ['type'],
      show: (values) => values.type === 'brokerage',
    },
    help: $t('trade.config.form.brokerageBindModeHelp'),
  },
  {
    fieldName: 'brokeragePosterUrls',
    label: $t('trade.config.form.brokeragePosterUrls'),
    component: 'ImageUpload',
    componentProps: {
      maxNumber: 9,
    },
    dependencies: {
      triggerFields: ['type'],
      show: (values) => values.type === 'brokerage',
    },
    help: $t('trade.config.form.brokeragePosterUrlsHelp'),
  },
  {
    fieldName: 'brokerageFirstPercent',
    label: $t('trade.config.form.brokerageFirstPercent'),
    component: 'InputNumber',
    componentProps: {
      min: 0,
      max: 100,
      placeholder: $t('trade.config.form.brokerageFirstPercentPlaceholder'),
      class: 'w-full',
    },
    rules: 'required',
    dependencies: {
      triggerFields: ['type'],
      show: (values) => values.type === 'brokerage',
    },
    help: $t('trade.config.form.brokerageFirstPercentHelp'),
  },
  {
    fieldName: 'brokerageSecondPercent',
    label: $t('trade.config.form.brokerageSecondPercent'),
    component: 'InputNumber',
    componentProps: {
      min: 0,
      max: 100,
      placeholder: $t('trade.config.form.brokerageSecondPercentPlaceholder'),
      class: 'w-full',
    },
    rules: 'required',
    dependencies: {
      triggerFields: ['type'],
      show: (values) => values.type === 'brokerage',
    },
    help: $t('trade.config.form.brokerageSecondPercentHelp'),
  },
  {
    fieldName: 'brokerageFrozenDays',
    label: $t('trade.config.form.brokerageFrozenDays'),
    component: 'InputNumber',
    componentProps: {
      min: 0,
      placeholder: $t('trade.config.form.brokerageFrozenDaysPlaceholder'),
      class: 'w-full',
    },
    rules: 'required',
    dependencies: {
      triggerFields: ['type'],
      show: (values) => values.type === 'brokerage',
    },
    help: $t('trade.config.form.brokerageFrozenDaysHelp'),
  },
  {
    fieldName: 'brokerageWithdrawMinPrice',
    label: $t('trade.config.form.brokerageWithdrawMinPrice'),
    component: 'InputNumber',
    componentProps: {
      min: 0,
      precision: 2,
      placeholder: $t('trade.config.form.brokerageWithdrawMinPricePlaceholder'),
      class: 'w-full',
    },
    rules: 'required',
    dependencies: {
      triggerFields: ['type'],
      show: (values) => values.type === 'brokerage',
    },
    help: $t('trade.config.form.brokerageWithdrawMinPriceHelp'),
  },
  {
    fieldName: 'brokerageWithdrawFeePercent',
    label: $t('trade.config.form.brokerageWithdrawFeePercent'),
    component: 'InputNumber',
    componentProps: {
      min: 0,
      max: 100,
      precision: 2,
      placeholder: $t(
        'trade.config.form.brokerageWithdrawFeePercentPlaceholder',
      ),
      class: 'w-full',
    },
    rules: 'required',
    dependencies: {
      triggerFields: ['type'],
      show: (values) => values.type === 'brokerage',
    },
    help: $t('trade.config.form.brokerageWithdrawFeePercentHelp'),
  },
  {
    fieldName: 'brokerageWithdrawTypes',
    label: $t('trade.config.form.brokerageWithdrawTypes'),
    component: 'CheckboxGroup',
    componentProps: {
      options: getDictOptions(DICT_TYPE.BROKERAGE_WITHDRAW_TYPE, 'number'),
    },
    rules: 'required',
    dependencies: {
      triggerFields: ['type'],
      show: (values) => values.type === 'brokerage',
    },
    help: $t('trade.config.form.brokerageWithdrawTypesHelp'),
  },
];
