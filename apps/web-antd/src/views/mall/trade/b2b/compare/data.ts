import type { Ref } from 'vue';

import type { B2BQuotationApi } from '#/api/mall/trade/b2b/quotation';

import { computed } from 'vue';

import { DeliveryTypeEnum } from '@vben/constants';

import { message } from 'ant-design-vue';

import { $t } from '#/locales';

export function useCompareTermsFormSchema() {
  return [
    {
      component: 'Select',
      fieldName: 'currency',
      label: $t('trade.b2b.quotation.createForm.currency'),
      componentProps: {
        options: [
          { label: 'CNY', value: 'CNY' },
          { label: 'USD', value: 'USD' },
          { label: 'EUR', value: 'EUR' },
        ],
        placeholder: $t('trade.b2b.quotation.createForm.currencyPlaceholder'),
      },
      rules: 'required',
    },
    {
      component: 'Select',
      fieldName: 'incoterms',
      label: $t('trade.b2b.quotation.createForm.incoterms'),
      componentProps: {
        options: [
          { label: $t('trade.b2b.quotation.incoterms.exw'), value: 'EXW' },
          { label: $t('trade.b2b.quotation.incoterms.fob'), value: 'FOB' },
          { label: $t('trade.b2b.quotation.incoterms.cif'), value: 'CIF' },
          { label: $t('trade.b2b.quotation.incoterms.ddp'), value: 'DDP' },
        ],
        placeholder: $t('trade.b2b.quotation.createForm.incotermsPlaceholder'),
      },
    },
    {
      component: 'Select',
      fieldName: 'deliveryType',
      label: $t('trade.b2b.quotation.createForm.deliveryType'),
      componentProps: {
        options: [
          {
            label: DeliveryTypeEnum.SEA.name,
            value: DeliveryTypeEnum.SEA.type,
          },
          {
            label: DeliveryTypeEnum.AIR.name,
            value: DeliveryTypeEnum.AIR.type,
          },
          {
            label: DeliveryTypeEnum.EXPRESS.name,
            value: DeliveryTypeEnum.EXPRESS.type,
          },
          {
            label: DeliveryTypeEnum.RAILWAY.name,
            value: DeliveryTypeEnum.RAILWAY.type,
          },
          {
            label: DeliveryTypeEnum.TRUCK.name,
            value: DeliveryTypeEnum.TRUCK.type,
          },
        ],
        placeholder: $t(
          'trade.b2b.quotation.createForm.deliveryTypePlaceholder',
        ),
        allowClear: true,
      },
    },
    {
      component: 'Input',
      fieldName: 'deliveryPort',
      label: $t('trade.b2b.quotation.detail.deliveryPort'),
      componentProps: {
        placeholder: $t('trade.b2b.quotation.form.deliveryPortPlaceholder'),
      },
    },
    {
      component: 'InputNumber',
      fieldName: 'validDays',
      label: $t('trade.b2b.quotation.createForm.validDays'),
      componentProps: {
        placeholder: $t('trade.b2b.quotation.createForm.validDaysPlaceholder'),
        min: 1,
        max: 365,
      },
    },
    // ========== 付款比例条款 ==========
    {
      component: 'InputNumber',
      fieldName: 'productionRatio',
      label: $t('trade.b2b.quotation.createForm.productionRatio'),
      componentProps: {
        placeholder: $t(
          'trade.b2b.quotation.createForm.productionRatioPlaceholder',
        ),
        min: 0,
        max: 100,
      },
    },
    {
      component: 'InputNumber',
      fieldName: 'preDelvRatio',
      label: $t('trade.b2b.quotation.createForm.preDelvRatio'),
      componentProps: {
        placeholder: $t(
          'trade.b2b.quotation.createForm.preDelvRatioPlaceholder',
        ),
        min: 0,
        max: 100,
      },
    },
    {
      component: 'InputNumber',
      fieldName: 'postDelvRatio',
      label: $t('trade.b2b.quotation.createForm.postDelvRatio'),
      componentProps: {
        placeholder: $t(
          'trade.b2b.quotation.createForm.postDelvRatioPlaceholder',
        ),
        min: 0,
        max: 100,
      },
    },
  ];
}

export function useCompareFeeItemsColumns() {
  return [
    { type: 'seq', title: $t('common.index'), width: 60 },
    {
      field: 'feeType',
      title: $t('trade.b2b.quotation.detail.feeType'),
      width: 120,
      slots: { default: 'feeType' },
    },
    {
      field: 'feeName',
      title: $t('trade.b2b.quotation.detail.feeName'),
      width: 150,
      slots: { default: 'feeName' },
    },
    {
      field: 'amount',
      title: $t('trade.b2b.quotation.detail.amount'),
      width: 120,
      slots: { default: 'amount' },
    },
    {
      field: 'description',
      title: $t('trade.b2b.quotation.detail.description'),
      width: 200,
      slots: { default: 'description' },
    },
    {
      field: 'actions',
      title: $t('common.actions'),
      width: 100,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}
export function useCompareSelection(
  skuItems: Ref<B2BQuotationApi.CompareSkuItem[]>,
) {
  const selectedCount = computed(() => {
    return skuItems.value.filter((item) => item.selectedQuotationId).length;
  });

  const totalCount = computed(() => skuItems.value.length);

  const isAllSelected = computed(
    () => selectedCount.value === totalCount.value,
  );

  const selectAllCheapest = () => {
    skuItems.value.forEach((item) => {
      const prices = Object.entries(item.quotationPrices || {});
      if (prices.length === 0) return;
      const firstPrice = prices[0];
      if (!firstPrice) return;
      let [cheapestQuotationId, cheapestPriceData] = firstPrice;

      for (const [quoteId, priceData] of prices) {
        if (priceData.supplierPrice < cheapestPriceData.supplierPrice) {
          cheapestQuotationId = quoteId;
          cheapestPriceData = priceData;
        }
      }

      item.selectedQuotationId = Number(cheapestQuotationId);
    });

    message.success(
      $t('trade.b2b.compare.selection.selectLowestPrice', [totalCount.value]),
    );
  };

  const clearSelection = () => {
    skuItems.value.forEach((item) => {
      item.selectedQuotationId = undefined;
    });
    message.info($t('trade.b2b.compare.actions.clear'));
  };

  return {
    selectedCount,
    totalCount,
    isAllSelected,
    selectAllCheapest,
    clearSelection,
  };
}
