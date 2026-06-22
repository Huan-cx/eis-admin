import type { VbenFormSchema } from '#/adapter/form';

import { getSimpleSupplierList } from '#/api/mall/product/supplier';
import { $t } from '#/locales';

// 报价编辑表单 - 基本信息 Schema
export function useQuotationFormSchema(): VbenFormSchema[] {
  return [
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
      fieldName: 'no',
      label: $t('trade.b2b.quotation.detail.no'),
      componentProps: {
        disabled: true,
        placeholder: '-',
      },
      dependencies: {
        triggerFields: ['id'],
        disabled: (values) => !values.id,
        show: (values) => !!values.id,
      },
    },
    {
      component: 'Input',
      fieldName: 'rfqId',
      dependencies: {
        triggerFields: [''],
        show: () => false,
      },
    },
    {
      fieldName: 'rfqNo',
      label: $t('trade.b2b.quotation.form.rfqNo'),
      component: 'Input',
      componentProps: {
        disabled: true,
      },
    },
    {
      fieldName: 'supplierId',
      label: $t('trade.b2b.quotation.form.supplier'),
      component: 'ApiSelect',
      componentProps: {
        api: getSimpleSupplierList,
        labelField: 'name',
        valueField: 'id',
        placeholder: $t('trade.b2b.quotation.form.supplierPlaceholder'),
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

// 商品报价表格列配置
export function useQuotationItemsColumns(): any[] {
  return [
    { type: 'seq', title: $t('common.index'), width: 60 },
    {
      field: 'spuName',
      title: $t('trade.b2b.quotation.detail.spuName'),
      width: 200,
    },
    {
      field: 'skuName',
      title: $t('trade.b2b.quotation.detail.skuName'),
      width: 150,
    },
    {
      field: 'picUrl',
      title: $t('trade.b2b.quotation.formPage.picUrl'),
      width: 80,
      slots: { default: 'picUrl' },
    },
    {
      field: 'count',
      title: $t('trade.b2b.rfq.detail.count'),
      width: 100,
    },
    {
      field: 'supplierId',
      title: $t('trade.b2b.quotation.formPage.supplier'),
      width: 150,
      slots: { default: 'supplierId' },
    },
    {
      field: 'supplierPrice',
      title: $t('trade.b2b.quotation.form.supplierPrice'),
      width: 150,
      slots: { default: 'supplierPrice' },
    },
    {
      field: 'subtotal',
      title: $t('trade.b2b.quotation.detail.subtotal'),
      width: 150,
      slots: { default: 'subtotal' },
    },
  ];
}

// 费用项目表格列配置
export function useFeeItemsColumns(): any[] {
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
