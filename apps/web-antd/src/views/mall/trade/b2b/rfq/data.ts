import type { VbenFormSchema } from '#/adapter/form';
import type { VxeGridPropTypes } from '#/adapter/vxe-table';

import { getSimpleSupplierList } from '#/api/mall/product/supplier';
import { $t } from '#/locales';

export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'status',
      label: $t('trade.b2b.rfq.form.status'),
      component: 'Select',
      componentProps: {
        options: [
          { label: $t('trade.b2b.rfq.status.draft'), value: 0 },
          { label: $t('trade.b2b.rfq.status.submitted'), value: 10 },
          { label: $t('trade.b2b.rfq.status.processing'), value: 15 },
          { label: $t('trade.b2b.rfq.status.quotationReceived'), value: 16 },
          { label: $t('trade.b2b.rfq.status.pendingComparison'), value: 17 },
          { label: $t('trade.b2b.rfq.status.quoted'), value: 20 },
          { label: $t('trade.b2b.rfq.status.accepted'), value: 30 },
          { label: $t('trade.b2b.rfq.status.ordered'), value: 35 },
          { label: $t('trade.b2b.rfq.status.rejected'), value: 40 },
          { label: $t('trade.b2b.rfq.status.expired'), value: 45 },
          { label: $t('trade.b2b.rfq.status.cancelled'), value: 50 },
        ],
        placeholder: $t('trade.b2b.rfq.form.statusPlaceholder'),
        allowClear: true,
      },
    },
    {
      fieldName: 'supplierId',
      label: $t('trade.b2b.rfq.form.supplier'),
      component: 'ApiSelect',
      componentProps: {
        api: getSimpleSupplierList,
        labelField: 'name',
        valueField: 'id',
        placeholder: $t('trade.b2b.rfq.form.supplierPlaceholder'),
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
      field: 'statusName',
      title: $t('trade.b2b.rfq.grid.status'),
      minWidth: 100,
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
      field: 'incoterms',
      title: $t('trade.b2b.rfq.grid.incoterms'),
      minWidth: 100,
    },
    {
      field: 'deliveryPort',
      title: $t('trade.b2b.rfq.grid.deliveryPort'),
      minWidth: 120,
    },
    {
      field: 'expectedDeliveryDate',
      title: $t('trade.b2b.rfq.grid.expectedDeliveryDate'),
      formatter: 'formatDate',
      minWidth: 140,
    },
    {
      field: 'submittedAt',
      title: $t('trade.b2b.rfq.grid.submittedAt'),
      formatter: 'formatDateTime',
      minWidth: 160,
    },
    {
      field: 'actions',
      title: $t('common.actions'),
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
      fieldName: 'statusName',
      label: $t('trade.b2b.rfq.detail.status'),
      component: 'Input',
      componentProps: {
        disabled: true,
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
      component: 'ApiSelect',
      componentProps: {
        api: getSimpleSupplierList,
        labelField: 'name',
        valueField: 'id',
        placeholder: $t('trade.b2b.quotation.form.supplierPlaceholder'),
      },
      rules: 'required',
    },
  ];
}
