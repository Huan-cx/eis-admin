import type { VbenFormSchema } from '#/adapter/form';
import type { VxeGridPropTypes } from '#/adapter/vxe-table';
import type { B2BRfqApi } from '#/api/mall/trade/b2b/rfq';

import { DICT_TYPE } from '@vben/constants';

import { $t } from '#/locales';

export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'status',
      label: $t('trade.b2b.rfq.form.status'),
      component: 'Select',
      componentProps: {
        options: [
          { label: $t('trade.b2b.rfq.status.pending'), value: 0 },
          { label: $t('trade.b2b.rfq.status.submitted'), value: 10 },
          { label: $t('trade.b2b.rfq.status.processing'), value: 20 },
          { label: $t('trade.b2b.rfq.status.completed'), value: 30 },
          { label: $t('trade.b2b.rfq.status.cancelled'), value: 40 },
        ],
        placeholder: $t('trade.b2b.rfq.form.statusPlaceholder'),
        allowClear: true,
      },
    },
    {
      fieldName: 'supplierId',
      label: $t('trade.b2b.rfq.form.supplierId'),
      component: 'Input',
      componentProps: {
        placeholder: $t('trade.b2b.rfq.form.supplierIdPlaceholder'),
        allowClear: true,
      },
    },
    {
      fieldName: 'contactName',
      label: $t('trade.b2b.rfq.form.contactName'),
      component: 'Input',
      componentProps: {
        placeholder: $t('trade.b2b.rfq.form.contactNamePlaceholder'),
        allowClear: true,
      },
    },
    {
      fieldName: 'email',
      label: $t('trade.b2b.rfq.form.email'),
      component: 'Input',
      componentProps: {
        placeholder: $t('trade.b2b.rfq.form.emailPlaceholder'),
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
      title: $t('trade.b2b.rfq.grid.no'),
      fixed: 'left',
      minWidth: 180,
    },
    {
      field: 'status',
      title: $t('trade.b2b.rfq.grid.status'),
      minWidth: 100,
      cellRender: {
        name: 'CellDict',
        props: { type: DICT_TYPE.TRADE_B2B_RFQ_STATUS },
      },
    },
    {
      field: 'userName',
      title: $t('trade.b2b.rfq.grid.userName'),
      minWidth: 120,
    },
    {
      field: 'supplierName',
      title: $t('trade.b2b.rfq.grid.supplierName'),
      minWidth: 120,
    },
    {
      field: 'itemCount',
      title: $t('trade.b2b.rfq.grid.itemCount'),
      minWidth: 80,
    },
    {
      field: 'submittedAt',
      title: $t('trade.b2b.rfq.grid.submittedAt'),
      formatter: 'formatDateTime',
      minWidth: 160,
    },
    {
      field: 'createdAt',
      title: $t('trade.b2b.rfq.grid.createdAt'),
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
      label: $t('trade.b2b.rfq.detail.no'),
      component: 'Input',
      componentProps: {
        disabled: true,
      },
    },
    {
      fieldName: 'status',
      label: $t('trade.b2b.rfq.detail.status'),
      component: 'DictTag',
      componentProps: {
        type: DICT_TYPE.TRADE_B2B_RFQ_STATUS,
      },
    },
    {
      fieldName: 'userName',
      label: $t('trade.b2b.rfq.detail.userName'),
      component: 'Input',
      componentProps: {
        disabled: true,
      },
    },
    {
      fieldName: 'supplierName',
      label: $t('trade.b2b.rfq.detail.supplierName'),
      component: 'Input',
      componentProps: {
        disabled: true,
      },
    },
    {
      fieldName: 'requirement',
      label: $t('trade.b2b.rfq.detail.requirement'),
      component: 'Input',
      componentProps: {
        type: 'textarea',
        disabled: true,
        rows: 2,
      },
    },
    {
      fieldName: 'validUntil',
      label: $t('trade.b2b.rfq.detail.validUntil'),
      component: 'Input',
      componentProps: {
        disabled: true,
      },
    },
    {
      fieldName: 'submittedAt',
      label: $t('trade.b2b.rfq.detail.submittedAt'),
      component: 'Input',
      componentProps: {
        disabled: true,
      },
    },
    {
      fieldName: 'createdAt',
      label: $t('trade.b2b.rfq.detail.createdAt'),
      component: 'Input',
      componentProps: {
        disabled: true,
      },
    },
  ];
}

export function useAssignSupplierFormSchema(): VbenFormSchema[] {
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
      fieldName: 'supplierId',
      label: $t('trade.b2b.rfq.assignSupplierForm.supplierId'),
      component: 'Input',
      componentProps: {
        placeholder: $t('trade.b2b.rfq.assignSupplierForm.supplierIdPlaceholder'),
      },
      rules: 'required',
    },
    {
      fieldName: 'supplierName',
      label: $t('trade.b2b.rfq.assignSupplierForm.supplierName'),
      component: 'Input',
      componentProps: {
        placeholder: $t('trade.b2b.rfq.assignSupplierForm.supplierNamePlaceholder'),
      },
      rules: 'required',
    },
  ];
}

export function useQuickQuoteItemsColumns(): VxeGridPropTypes.Columns {
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
      title: $t('trade.b2b.rfq.detail.count'),
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

export function useQuickQuoteFormSchema(items: B2BRfqApi.RfqItem[]): VbenFormSchema[] {
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
      label: `${item.productName} - ${$t('trade.b2b.quotation.createForm.unitPrice')}`,
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
