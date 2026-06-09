import type { VbenFormSchema } from '#/adapter/form';
import type { VxeGridPropTypes } from '#/adapter/vxe-table';
import type { B2BQuotationApi } from '#/api/mall/trade/b2b/quotation';

import { DICT_TYPE } from '@vben/constants';

import { $t } from '#/locales';

export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'status',
      label: $t('trade.b2b.quotation.form.status'),
      component: 'Select',
      componentProps: {
        options: [
          { label: $t('trade.b2b.quotation.status.pending'), value: 0 },
          { label: $t('trade.b2b.quotation.status.quoted'), value: 10 },
          { label: $t('trade.b2b.quotation.status.accepted'), value: 20 },
          { label: $t('trade.b2b.quotation.status.rejected'), value: 30 },
          { label: $t('trade.b2b.quotation.status.expired'), value: 40 },
        ],
        placeholder: $t('trade.b2b.quotation.form.statusPlaceholder'),
        allowClear: true,
      },
    },
    {
      fieldName: 'supplierId',
      label: $t('trade.b2b.quotation.form.supplierId'),
      component: 'Input',
      componentProps: {
        placeholder: $t('trade.b2b.quotation.form.supplierIdPlaceholder'),
        allowClear: true,
      },
    },
  ];
}

export function useGridColumns(): VxeGridPropTypes.Columns {
  return [
    {
      type: 'expand',
      width: 80,
      slots: { content: 'expand_content' },
      fixed: 'left',
    },
    {
      field: 'no',
      title: $t('trade.b2b.quotation.grid.no'),
      fixed: 'left',
      minWidth: 180,
    },
    {
      field: 'rfqNo',
      title: $t('trade.b2b.quotation.grid.rfqNo'),
      minWidth: 180,
    },
    {
      field: 'supplierName',
      title: $t('trade.b2b.quotation.grid.supplierName'),
      minWidth: 120,
    },
    {
      field: 'status',
      title: $t('trade.b2b.quotation.grid.status'),
      minWidth: 100,
      cellRender: {
        name: 'CellDict',
        props: { type: DICT_TYPE.TRADE_B2B_QUOTATION_STATUS },
      },
    },
    {
      field: 'totalPrice',
      title: $t('trade.b2b.quotation.grid.totalPrice'),
      formatter: 'formatAmount2',
      minWidth: 120,
    },
    {
      field: 'currency',
      title: $t('trade.b2b.quotation.grid.currency'),
      minWidth: 80,
    },
    {
      field: 'incoterms',
      title: $t('trade.b2b.quotation.grid.incoterms'),
      minWidth: 120,
    },
    {
      field: 'createdAt',
      title: $t('trade.b2b.quotation.grid.createdAt'),
      formatter: 'formatDateTime',
      minWidth: 160,
    },
    {
      title: $t('common.action'),
      width: 180,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}

export function useDetailFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'no',
      label: $t('trade.b2b.quotation.detail.no'),
      component: 'Input',
      componentProps: {
        disabled: true,
      },
    },
    {
      fieldName: 'rfqNo',
      label: $t('trade.b2b.quotation.detail.rfqNo'),
      component: 'Input',
      componentProps: {
        disabled: true,
      },
    },
    {
      fieldName: 'status',
      label: $t('trade.b2b.quotation.detail.status'),
      component: 'DictTag',
      componentProps: {
        type: DICT_TYPE.TRADE_B2B_QUOTATION_STATUS,
      },
    },
    {
      fieldName: 'supplierName',
      label: $t('trade.b2b.quotation.detail.supplierName'),
      component: 'Input',
      componentProps: {
        disabled: true,
      },
    },
    {
      fieldName: 'totalPrice',
      label: $t('trade.b2b.quotation.detail.totalPrice'),
      component: 'Input',
      componentProps: {
        disabled: true,
      },
    },
    {
      fieldName: 'currency',
      label: $t('trade.b2b.quotation.detail.currency'),
      component: 'Input',
      componentProps: {
        disabled: true,
      },
    },
    {
      fieldName: 'incoterms',
      label: $t('trade.b2b.quotation.detail.incoterms'),
      component: 'Input',
      componentProps: {
        disabled: true,
      },
    },
    {
      fieldName: 'validUntil',
      label: $t('trade.b2b.quotation.detail.validUntil'),
      component: 'Input',
      componentProps: {
        disabled: true,
      },
    },
    {
      fieldName: 'remark',
      label: $t('trade.b2b.quotation.detail.remark'),
      component: 'Input',
      componentProps: {
        type: 'textarea',
        disabled: true,
        rows: 2,
      },
    },
    {
      fieldName: 'createdAt',
      label: $t('trade.b2b.quotation.detail.createdAt'),
      component: 'Input',
      componentProps: {
        disabled: true,
      },
    },
  ];
}

export function useCreateQuotationFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'rfqId',
      dependencies: {
        triggerFields: [''],
        show: () => false,
      },
    },
    {
      fieldName: 'supplierId',
      label: $t('trade.b2b.quotation.createForm.supplierId'),
      component: 'Input',
      componentProps: {
        placeholder: $t('trade.b2b.quotation.createForm.supplierIdPlaceholder'),
      },
      rules: 'required',
    },
    {
      fieldName: 'supplierName',
      label: $t('trade.b2b.quotation.createForm.supplierName'),
      component: 'Input',
      componentProps: {
        placeholder: $t(
          'trade.b2b.quotation.createForm.supplierNamePlaceholder',
        ),
      },
      rules: 'required',
    },
    {
      fieldName: 'currency',
      label: $t('trade.b2b.quotation.createForm.currency'),
      component: 'Select',
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
      fieldName: 'incoterms',
      label: $t('trade.b2b.quotation.createForm.incoterms'),
      component: 'Select',
      componentProps: {
        options: [
          { label: 'EXW', value: 'EXW' },
          { label: 'FOB', value: 'FOB' },
          { label: 'CIF', value: 'CIF' },
          { label: 'DDP', value: 'DDP' },
        ],
        placeholder: $t('trade.b2b.quotation.createForm.incotermsPlaceholder'),
      },
    },
    {
      fieldName: 'deliveryType',
      label: $t('trade.b2b.quotation.createForm.deliveryType'),
      component: 'Select',
      componentProps: {
        options: [
          { label: $t('trade.b2b.quotation.delivery.express'), value: 1 },
          { label: $t('trade.b2b.quotation.delivery.self'), value: 2 },
        ],
        placeholder: $t(
          'trade.b2b.quotation.createForm.deliveryTypePlaceholder',
        ),
      },
    },
    {
      fieldName: 'validDays',
      label: $t('trade.b2b.quotation.createForm.validDays'),
      component: 'InputNumber',
      componentProps: {
        placeholder: $t('trade.b2b.quotation.createForm.validDaysPlaceholder'),
        min: 1,
        max: 365,
      },
    },
    {
      fieldName: 'remark',
      label: $t('trade.b2b.quotation.createForm.remark'),
      component: 'Input',
      componentProps: {
        type: 'textarea',
        rows: 3,
        placeholder: $t('trade.b2b.quotation.createForm.remarkPlaceholder'),
      },
    },
  ];
}

export function useCreateQuotationItemsColumns(): VxeGridPropTypes.Columns {
  return [
    {
      field: 'spuName',
      title: $t('trade.b2b.quotation.detail.spuName'),
      minWidth: 150,
    },
    {
      field: 'skuName',
      title: $t('trade.b2b.quotation.detail.skuName'),
      minWidth: 150,
    },
    {
      field: 'count',
      title: $t('trade.b2b.quotation.detail.count'),
      width: 100,
    },
    {
      field: 'unitPrice',
      title: $t('trade.b2b.quotation.createForm.unitPrice'),
      width: 150,
      slots: { default: 'unitPrice' },
    },
    {
      field: 'subtotal',
      title: $t('trade.b2b.quotation.detail.subtotal'),
      width: 150,
      slots: { default: 'subtotal' },
    },
  ];
}

export function useQuickQuoteFormSchema(
  items: B2BQuotationApi.QuotationItem[],
): VbenFormSchema[] {
  const schema: VbenFormSchema[] = [
    {
      component: 'Input',
      fieldName: 'rfqId',
      dependencies: {
        triggerFields: [''],
        show: () => false,
      },
    },
    {
      fieldName: 'currency',
      label: $t('trade.b2b.quotation.createForm.currency'),
      component: 'Select',
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
      fieldName: 'incoterms',
      label: $t('trade.b2b.quotation.createForm.incoterms'),
      component: 'Select',
      componentProps: {
        options: [
          { label: 'EXW', value: 'EXW' },
          { label: 'FOB', value: 'FOB' },
          { label: 'CIF', value: 'CIF' },
          { label: 'DDP', value: 'DDP' },
        ],
        placeholder: $t('trade.b2b.quotation.createForm.incotermsPlaceholder'),
      },
    },
    {
      fieldName: 'deliveryType',
      label: $t('trade.b2b.quotation.createForm.deliveryType'),
      component: 'Select',
      componentProps: {
        options: [
          { label: $t('trade.b2b.quotation.delivery.express'), value: 1 },
          { label: $t('trade.b2b.quotation.delivery.self'), value: 2 },
        ],
        placeholder: $t(
          'trade.b2b.quotation.createForm.deliveryTypePlaceholder',
        ),
      },
    },
    {
      fieldName: 'validDays',
      label: $t('trade.b2b.quotation.createForm.validDays'),
      component: 'InputNumber',
      componentProps: {
        placeholder: $t('trade.b2b.quotation.createForm.validDaysPlaceholder'),
        min: 1,
        max: 365,
      },
    },
    {
      fieldName: 'remark',
      label: $t('trade.b2b.quotation.createForm.remark'),
      component: 'Input',
      componentProps: {
        type: 'textarea',
        rows: 3,
        placeholder: $t('trade.b2b.quotation.createForm.remarkPlaceholder'),
      },
    },
  ];

  items.forEach((item, index) => {
    schema.push({
      fieldName: `items[${index}].unitPrice`,
      label: `${item.spuName} - ${$t('trade.b2b.quotation.createForm.unitPrice')}`,
      component: 'InputNumber',
      componentProps: {
        placeholder: $t('trade.b2b.quotation.createForm.unitPricePlaceholder'),
        min: 0,
        step: 0.01,
        precision: 2,
      },
      rules: 'required',
    });
  });

  return schema;
}
