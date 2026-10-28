import type { VbenFormSchema } from '#/adapter/form';
import type { VxeGridPropTypes } from '#/adapter/vxe-table';

import { $t } from '#/locales';

export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'email',
      label: $t('trade.b2b.inquiry.form.email'),
      component: 'Input',
      componentProps: {
        placeholder: $t('trade.b2b.inquiry.form.emailPlaceholder'),
        allowClear: true,
      },
    },
    {
      fieldName: 'company',
      label: $t('trade.b2b.inquiry.form.company'),
      component: 'Input',
      componentProps: {
        placeholder: $t('trade.b2b.inquiry.form.companyPlaceholder'),
        allowClear: true,
      },
    },
    {
      fieldName: 'country',
      label: $t('trade.b2b.inquiry.form.country'),
      component: 'Input',
      componentProps: {
        placeholder: $t('trade.b2b.inquiry.form.countryPlaceholder'),
        allowClear: true,
      },
    },
    {
      fieldName: 'status',
      label: $t('trade.b2b.inquiry.form.status'),
      component: 'Select',
      componentProps: {
        options: [
          { label: $t('trade.b2b.inquiry.status.pending'), value: 0 },
          { label: $t('trade.b2b.inquiry.status.contacted'), value: 1 },
          { label: $t('trade.b2b.inquiry.status.deal'), value: 2 },
        ],
        placeholder: $t('trade.b2b.inquiry.form.statusPlaceholder'),
        allowClear: true,
      },
    },
  ];
}

export function useGridColumns(): VxeGridPropTypes.Columns {
  return [
    {
      field: 'no',
      title: $t('trade.b2b.inquiry.grid.no'),
      fixed: 'left',
      minWidth: 160,
    },
    {
      field: 'email',
      title: $t('trade.b2b.inquiry.grid.email'),
      minWidth: 180,
    },
    {
      field: 'company',
      title: $t('trade.b2b.inquiry.grid.company'),
      minWidth: 180,
    },
    {
      field: 'country',
      title: $t('trade.b2b.inquiry.grid.country'),
      minWidth: 140,
    },
    {
      field: 'budgetAmount',
      title: $t('trade.b2b.inquiry.grid.budgetAmount'),
      minWidth: 130,
      formatter: ({ cellValue, row }) => {
        if (cellValue == null) {
          return '-';
        }
        return `${cellValue} ${row.budgetCurrency ?? ''}`.trim();
      },
    },
    {
      field: 'statusName',
      title: $t('trade.b2b.inquiry.grid.status'),
      minWidth: 100,
    },
    {
      field: 'createTime',
      title: $t('trade.b2b.inquiry.grid.createTime'),
      formatter: 'formatDateTime',
      minWidth: 160,
    },
    {
      field: 'actions',
      title: $t('common.actions'),
      width: 160,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}

export function useStatusFormSchema(): VbenFormSchema[] {
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
      fieldName: 'status',
      label: $t('trade.b2b.inquiry.form.status'),
      component: 'RadioGroup',
      componentProps: {
        options: [
          { label: $t('trade.b2b.inquiry.status.pending'), value: 0 },
          { label: $t('trade.b2b.inquiry.status.contacted'), value: 1 },
          { label: $t('trade.b2b.inquiry.status.deal'), value: 2 },
        ],
        buttonStyle: 'solid',
        optionType: 'button',
      },
      rules: 'required',
    },
    {
      fieldName: 'handleRemark',
      label: $t('trade.b2b.inquiry.form.handleRemark'),
      component: 'Input',
      componentProps: {
        type: 'textarea',
        rows: 3,
        placeholder: $t('trade.b2b.inquiry.form.handleRemarkPlaceholder'),
      },
    },
  ];
}
