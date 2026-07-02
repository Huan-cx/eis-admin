import type { VbenFormSchema } from '#/adapter/form';
import type { VxeGridPropTypes } from '#/adapter/vxe-table';

import { DeliveryTypeEnum, DICT_TYPE } from '@vben/constants';
import { getDictOptions } from '@vben/hooks';
import { convertToInteger, formatToFraction } from '@vben/utils';

import { getSimpleDeliveryExpressList } from '#/api/mall/trade/delivery/express';
import { $t } from '#/locales';
import { getRangePickerDefaultProps } from '#/utils';
import { getSimpleDeliveryPickUpStoreList } from "#/api/mall/trade/delivery/pickUpStore";

/** 列表的搜索表单 */
export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'status',
      label: $t('trade.order.form.status'),
      component: 'Select',
      componentProps: {
        options: getDictOptions(DICT_TYPE.TRADE_ORDER_STATUS, 'number'),
        placeholder: $t('trade.order.form.statusPlaceholder'),
        allowClear: true,
      },
    },
    {
      fieldName: 'approvalStatus',
      label: $t('trade.order.form.approvalStatus'),
      component: 'Select',
      componentProps: {
        options: getDictOptions(
          DICT_TYPE.TRADE_ORDER_APPROVAL_STATUS,
          'number',
        ),
        placeholder: $t('trade.order.form.approvalStatusPlaceholder'),
        allowClear: true,
      },
    },
    {
      fieldName: 'payProgressStatus',
      label: $t('trade.order.form.payProgressStatus'),
      component: 'Select',
      componentProps: {
        options: getDictOptions(
          DICT_TYPE.TRADE_ORDER_PAY_PROGRESS_STATUS,
          'number',
        ),
        placeholder: $t('trade.order.form.payProgressStatusPlaceholder'),
        allowClear: true,
      },
    },
    {
      fieldName: 'payChannelCode',
      label: $t('trade.order.form.payChannelCode'),
      component: 'Select',
      componentProps: {
        options: getDictOptions(DICT_TYPE.PAY_CHANNEL_CODE, 'number'),
        placeholder: $t('trade.order.form.payChannelCodePlaceholder'),
        allowClear: true,
      },
    },
    {
      fieldName: 'createTime',
      label: $t('trade.order.form.createTime'),
      component: 'RangePicker',
      componentProps: {
        ...getRangePickerDefaultProps(),
        allowClear: true,
      },
    },
    {
      fieldName: 'terminal',
      label: $t('trade.order.form.terminal'),
      component: 'Select',
      componentProps: {
        options: getDictOptions(DICT_TYPE.TERMINAL, 'number'),
        placeholder: $t('trade.order.form.terminalPlaceholder'),
        allowClear: true,
      },
    },
    {
      fieldName: 'deliveryType',
      label: $t('trade.order.form.deliveryType'),
      component: 'Select',
      componentProps: {
        options: getDictOptions(DICT_TYPE.TRADE_DELIVERY_TYPE, 'number'),
        placeholder: $t('trade.order.form.deliveryTypePlaceholder'),
        allowClear: true,
      },
    },
    {
      fieldName: 'logisticsId',
      label: $t('trade.order.form.logisticsId'),
      component: 'ApiSelect',
      componentProps: {
        api: getSimpleDeliveryExpressList,
        labelField: 'name',
        valueField: 'id',
        placeholder: $t('trade.order.form.logisticsIdPlaceholder'),
        allowClear: true,
      },
      dependencies: {
        triggerFields: ['deliveryType'],
        show: (values) => values.deliveryType === DeliveryTypeEnum.EXPRESS.type,
      },
    },
    {
      fieldName: 'pickUpStoreId',
      label: $t('trade.order.form.pickUpStoreId'),
      component: 'ApiSelect',
      componentProps: {
        api: getSimpleDeliveryPickUpStoreList,
        labelField: 'name',
        valueField: 'id',
        placeholder: $t('trade.order.form.pickUpStoreIdPlaceholder'),
        allowClear: true,
      },
    },
    {
      fieldName: 'no',
      label: $t('trade.order.form.no'),
      component: 'Input',
      componentProps: {
        placeholder: $t('trade.order.form.noPlaceholder'),
        allowClear: true,
      },
    },
    {
      fieldName: 'userId',
      label: $t('trade.order.form.userId'),
      component: 'Input',
      componentProps: {
        placeholder: $t('trade.order.form.userIdPlaceholder'),
        allowClear: true,
      },
    },
    {
      fieldName: 'userNickname',
      label: $t('trade.order.form.userNickname'),
      component: 'Input',
      componentProps: {
        placeholder: $t('trade.order.form.userNicknamePlaceholder'),
        allowClear: true,
      },
    },
    {
      fieldName: 'userMobile',
      label: $t('trade.order.form.userMobile'),
      component: 'Input',
      componentProps: {
        placeholder: $t('trade.order.form.userMobilePlaceholder'),
        allowClear: true,
      },
    },
  ];
}

/** 表格列配置 */
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
      title: $t('trade.order.grid.no'),
      fixed: 'left',
      minWidth: 180,
    },
    {
      field: 'createTime',
      title: $t('trade.order.grid.createTime'),
      formatter: 'formatDateTime',
      minWidth: 160,
    },
    {
      field: 'terminal',
      title: $t('trade.order.grid.terminal'),
      cellRender: {
        name: 'CellDict',
        props: { type: DICT_TYPE.TERMINAL },
      },
      minWidth: 120,
    },
    {
      field: 'approvalStatus',
      title: $t('trade.order.detail.approvalStatus'),
      cellRender: {
        name: 'CellDict',
        props: { type: DICT_TYPE.TRADE_ORDER_APPROVAL_STATUS },
      },
      minWidth: 100,
    },
    {
      field: 'payProgressStatus',
      title: $t('trade.order.detail.payProgress'),
      cellRender: {
        name: 'CellDict',
        props: { type: DICT_TYPE.TRADE_ORDER_PAY_PROGRESS_STATUS },
      },
      minWidth: 100,
    },
    {
      field: 'payChannelCode',
      title: $t('trade.order.grid.payChannelCode'),
      cellRender: {
        name: 'CellDict',
        props: { type: DICT_TYPE.PAY_CHANNEL_CODE },
      },
      minWidth: 120,
    },
    {
      field: 'payTime',
      title: $t('trade.order.grid.payTime'),
      formatter: 'formatDateTime',
      minWidth: 160,
    },
    {
      field: 'type',
      title: $t('trade.order.grid.type'),
      cellRender: {
        name: 'CellDict',
        props: { type: DICT_TYPE.TRADE_ORDER_TYPE },
      },
      minWidth: 80,
    },
    {
      field: 'payPrice',
      title: $t('trade.order.grid.payPrice'),
      formatter: 'formatFenToYuanAmount',
      minWidth: 180,
    },
    {
      field: 'paidPrice',
      title: $t('trade.order.detail.paidAmount'),
      formatter: 'formatFenToYuanAmount',
      minWidth: 120,
    },
    {
      field: 'user',
      title: $t('trade.order.grid.user'),
      formatter: ({ row }) => {
        let addressStr = `${$t('trade.order.grid.buyer')}：${row.user?.nickname}`;
        if (!row.receiveUseBilling) {
          addressStr += ` / ${$t('trade.order.grid.receiver')}： ${row.receiverAddress?.firstName} ${row.receiverAddress?.lastName} ${row.receiverAddress?.phone} ${row.receiverAddress?.country} ${row.receiverAddress?.state} ${row.receiverAddress?.city} ${row.receiverAddress?.street}`;
        }
        if (!row.importerUseBilling) {
          addressStr += ` / ${$t('trade.order.grid.importerAddress')}：${row.importerAddress?.companyName} ${row.importerAddress?.firstName} ${row.importerAddress?.lastName} ${row.importerAddress?.country} ${row.importerAddress?.state} ${row.importerAddress?.city} ${row.importerAddress?.street}`;
        }
        if (!row.receiveUseBilling && !row.importerUseBilling) {
          addressStr += ` / ${$t('trade.order.grid.billingAddress')}：${row.billingAddress?.firstName} ${row.billingAddress?.lastName} ${row.billingAddress?.country} ${row.billingAddress?.state} ${row.billingAddress?.city} ${row.billingAddress?.street}`;
        }
        return addressStr;
      },
      minWidth: 180,
    },
    {
      field: 'deliveryType',
      title: $t('trade.order.grid.deliveryType'),
      cellRender: {
        name: 'CellDict',
        props: { type: DICT_TYPE.TRADE_DELIVERY_TYPE },
      },
      minWidth: 80,
    },
    {
      field: 'status',
      title: $t('trade.order.grid.status'),
      cellRender: {
        name: 'CellDict',
        props: { type: DICT_TYPE.TRADE_ORDER_STATUS },
      },
      minWidth: 80,
    },
    {
      title: $t('common.actions'),
      width: 240,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}

/** 付款记录表格列配置 */
export function usePaymentColumns(): VxeGridPropTypes.Columns {
  return [
    {
      field: 'paidAt',
      title: $t('trade.order.detail.payTime'),
      width: 180,
      formatter: 'formatDateTime',
    },
    {
      field: 'amount',
      title: $t('trade.order.form.payAmount'),
      width: 120,
      formatter: 'formatFenToYuanAmount',
    },
    {
      field: 'paymentMethod',
      title: $t('trade.order.detail.paymentMethod'),
      width: 120,
      cellRender: {
        name: 'CellDict',
        props: { type: DICT_TYPE.TRADE_ORDER_PAYMENT_METHOD },
      },
    },
    {
      field: 'transactionId',
      title: $t('trade.order.form.transactionNo'),
      minWidth: 200,
    },
    {
      field: 'operatorName',
      title: $t('trade.order.detail.operator'),
      width: 120,
    },
    {
      field: 'remark',
      title: $t('trade.order.form.remark'),
      minWidth: 200,
    },
  ];
}

/** 订单备注表单配置 */
export function useRemarkFormSchema(): VbenFormSchema[] {
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
      fieldName: 'remark',
      label: $t('trade.order.form.remark'),
      component: 'Input',
      componentProps: {
        type: 'textarea',
        rows: 3,
      },
    },
  ];
}

/** 订单调价表单配置 */
export function usePriceFormSchema(): VbenFormSchema[] {
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
      fieldName: 'payPrice',
      label: $t('trade.order.priceForm.payPrice'),
      component: 'Input',
      componentProps: {
        placeholder: $t('trade.order.priceForm.payPricePlaceholder'),
        disabled: true,
        formatter: (value: string) => `${value}${$t('common.yuan')}`,
      },
    },
    {
      fieldName: 'adjustPrice',
      label: $t('trade.order.priceForm.adjustPrice'),
      component: 'InputNumber',
      componentProps: {
        placeholder: $t('trade.order.priceForm.adjustPricePlaceholder'),
        step: 0.1,
        precision: 2,
      },
      help: $t('trade.order.priceForm.adjustPriceHelp'),
      rules: 'required',
    },
    {
      fieldName: 'newPayPrice',
      label: $t('trade.order.priceForm.newPayPrice'),
      component: 'Input',
      componentProps: {
        placeholder: '',
        formatter: (value: string) => `${value}${$t('common.yuan')}`,
      },
      dependencies: {
        triggerFields: ['payPrice', 'adjustPrice'],
        disabled: true,
        trigger(values, form) {
          const originalPrice = convertToInteger(values.payPrice);
          const adjustPrice = convertToInteger(values.adjustPrice);
          const newPrice = originalPrice + adjustPrice;
          form.setFieldValue('newPayPrice', formatToFraction(newPrice));
        },
      },
    },
  ];
}

/** 订单修改地址表单配置 */
export function useAddressFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'id',
      dependencies: {
        triggerFields: [''],
        show: () => false,
      },
    },
    // 快捷设置标题
    {
      fieldName: 'quickSettingsTitle',
      label: '',
      component: 'Divider',
      renderComponentContent: () => {
        return {
          default: () => [`⚙️ ${$t('trade.order.addressForm.quickSettings')}`],
        };
      },
      formItemClass: 'col-span-2 !mb-2 !mt-0',
    },
    // 收货地址标题
    {
      fieldName: 'receiverAddressTitle',
      label: '',
      component: 'Divider',
      formItemClass: 'col-span-2 !mb-2 !mt-4',
      renderComponentContent: () => {
        return {
          default: () => [
            `📍 ${$t('trade.order.addressForm.receiverAddress')}`,
          ],
        };
      },
    },
    {
      fieldName: 'receiveUseBilling',
      label: $t('trade.order.addressForm.receiveUseBilling'),
      component: 'Switch',
      componentProps: {
        checkedChildren: $t('common.yes'),
        unCheckedChildren: $t('common.no'),
      },
      defaultValue: false,
      formItemClass: 'col-span-1',
      wrapperClass: '!justify-start',
    },
    {
      fieldName: 'receiverAddress.firstName',
      label: $t('trade.order.addressForm.receiverFirstName'),
      component: 'Input',
      rules: 'required',
      formItemClass: 'col-span-1',
      dependencies: {
        triggerFields: ['receiveUseBilling'],
        show: (values) => !values.receiveUseBilling,
      },
    },
    {
      fieldName: 'receiverAddress.lastName',
      label: $t('trade.order.addressForm.receiverLastName'),
      component: 'Input',
      rules: 'required',
      formItemClass: 'col-span-1',
      dependencies: {
        triggerFields: ['receiveUseBilling'],
        show: (values) => !values.receiveUseBilling,
      },
    },
    {
      fieldName: 'receiverAddress.lastName',
      label: $t('trade.order.addressForm.receiverLastName'),
      component: 'Input',
      rules: 'required',
      dependencies: {
        triggerFields: ['receiveUseBilling'],
        show: (values) => !values.receiveUseBilling,
      },
    },
    {
      fieldName: 'receiverAddress.companyName',
      label: $t('trade.order.addressForm.companyName'),
      component: 'Input',
      formItemClass: 'col-span-2',
      dependencies: {
        triggerFields: ['receiveUseBilling'],
        show: (values) => !values.receiveUseBilling,
      },
    },
    {
      fieldName: 'receiverAddress.street',
      label: $t('trade.order.addressForm.street'),
      component: 'Input',
      rules: 'required',
      formItemClass: 'col-span-2',
      dependencies: {
        triggerFields: ['receiveUseBilling'],
        show: (values) => !values.receiveUseBilling,
      },
    },
    {
      fieldName: 'receiverAddress.city',
      label: $t('trade.order.addressForm.city'),
      component: 'Input',
      rules: 'required',
      formItemClass: 'col-span-1',
      dependencies: {
        triggerFields: ['receiveUseBilling'],
        show: (values) => !values.receiveUseBilling,
      },
    },
    {
      fieldName: 'receiverAddress.state',
      label: $t('trade.order.addressForm.state'),
      component: 'Input',
      rules: 'required',
      formItemClass: 'col-span-1',
      dependencies: {
        triggerFields: ['receiveUseBilling'],
        show: (values) => !values.receiveUseBilling,
      },
    },
    {
      fieldName: 'receiverAddress.country',
      label: $t('trade.order.addressForm.country'),
      component: 'Input',
      rules: 'required',
      formItemClass: 'col-span-1',
      dependencies: {
        triggerFields: ['receiveUseBilling'],
        show: (values) => !values.receiveUseBilling,
      },
    },
    {
      fieldName: 'receiverAddress.postcode',
      label: $t('trade.order.addressForm.postcode'),
      component: 'Input',
      formItemClass: 'col-span-1',
      dependencies: {
        triggerFields: ['receiveUseBilling'],
        show: (values) => !values.receiveUseBilling,
      },
    },
    {
      fieldName: 'receiverAddress.phone',
      label: $t('trade.order.addressForm.phone'),
      component: 'Input',
      rules: 'required',
      formItemClass: 'col-span-1',
      dependencies: {
        triggerFields: ['receiveUseBilling'],
        show: (values) => !values.receiveUseBilling,
      },
    },
    {
      fieldName: 'receiverAddress.email',
      label: $t('trade.order.addressForm.email'),
      component: 'Input',
      formItemClass: 'col-span-1',
      dependencies: {
        triggerFields: ['receiveUseBilling'],
        show: (values) => !values.receiveUseBilling,
      },
    },
    {
      fieldName: 'receiverAddress.vat',
      label: $t('trade.order.addressForm.vat'),
      component: 'Input',
      formItemClass: 'col-span-1',
      dependencies: {
        triggerFields: ['receiveUseBilling'],
        show: (values) => !values.receiveUseBilling,
      },
    },
    {
      fieldName: 'receiverAddress.eori',
      label: $t('trade.order.addressForm.eori'),
      component: 'Input',
      formItemClass: 'col-span-1',
      dependencies: {
        triggerFields: ['receiveUseBilling'],
        show: (values) => !values.receiveUseBilling,
      },
    },
    // 账单地址标题
    {
      fieldName: 'billingAddressTitle',
      label: '',
      component: 'Divider',
      formItemClass: 'col-span-2 !mb-2 !mt-4',
      renderComponentContent: () => {
        return {
          default: () => [`💰 ${$t('trade.order.addressForm.billingAddress')}`],
        };
      },
    },
    {
      fieldName: 'billingAddress.companyName',
      label: $t('trade.order.addressForm.billingCompanyName'),
      component: 'Input',
      formItemClass: 'col-span-2',
    },
    {
      fieldName: 'billingAddress.firstName',
      label: $t('trade.order.addressForm.billingFirstName'),
      component: 'Input',
      rules: 'required',
      formItemClass: 'col-span-1',
    },
    {
      fieldName: 'billingAddress.lastName',
      label: $t('trade.order.addressForm.billingLastName'),
      component: 'Input',
      rules: 'required',
      formItemClass: 'col-span-1',
    },
    {
      fieldName: 'billingAddress.street',
      label: $t('trade.order.addressForm.billingStreet'),
      component: 'Input',
      rules: 'required',
      formItemClass: 'col-span-2',
    },
    {
      fieldName: 'billingAddress.city',
      label: $t('trade.order.addressForm.billingCity'),
      component: 'Input',
      rules: 'required',
      formItemClass: 'col-span-1',
    },
    {
      fieldName: 'billingAddress.state',
      label: $t('trade.order.addressForm.billingState'),
      component: 'Input',
      rules: 'required',
      formItemClass: 'col-span-1',
    },
    {
      fieldName: 'billingAddress.country',
      label: $t('trade.order.addressForm.billingCountry'),
      component: 'Input',
      rules: 'required',
      formItemClass: 'col-span-1',
    },
    {
      fieldName: 'billingAddress.postcode',
      label: $t('trade.order.addressForm.billingPostcode'),
      component: 'Input',
      formItemClass: 'col-span-1',
    },
    {
      fieldName: 'billingAddress.phone',
      label: $t('trade.order.addressForm.billingPhone'),
      component: 'Input',
      rules: 'required',
      formItemClass: 'col-span-1',
    },
    {
      fieldName: 'billingAddress.email',
      label: $t('trade.order.addressForm.billingEmail'),
      component: 'Input',
      formItemClass: 'col-span-1',
    },
    {
      fieldName: 'billingAddress.vat',
      label: $t('trade.order.addressForm.billingVat'),
      component: 'Input',
      formItemClass: 'col-span-1',
    },
    {
      fieldName: 'billingAddress.eori',
      label: $t('trade.order.addressForm.billingEori'),
      component: 'Input',
      formItemClass: 'col-span-1',
    },
    // 进口商地址标题
    {
      fieldName: 'importerAddressTitle',
      label: '',
      component: 'Divider',
      formItemClass: 'col-span-2 !mb-2 !mt-4',
      renderComponentContent: () => {
        return {
          default: () => [
            `🏢 ${$t('trade.order.addressForm.importerAddress')}`,
          ],
        };
      },
    },
    {
      fieldName: 'importerUseBilling',
      label: $t('trade.order.addressForm.importerUseBilling'),
      component: 'Switch',
      componentProps: {
        checkedChildren: $t('common.yes'),
        unCheckedChildren: $t('common.no'),
      },
      defaultValue: false,
      formItemClass: 'col-span-1',
      wrapperClass: '!justify-start',
    },
    {
      fieldName: 'importerAddress.companyName',
      label: $t('trade.order.addressForm.importerCompanyName'),
      component: 'Input',
      formItemClass: 'col-span-2',
      dependencies: {
        triggerFields: ['importerUseBilling'],
        show: (values) => !values.importerUseBilling,
      },
    },
    {
      fieldName: 'importerAddress.firstName',
      label: $t('trade.order.addressForm.importerFirstName'),
      component: 'Input',
      formItemClass: 'col-span-1',
      dependencies: {
        triggerFields: ['importerUseBilling'],
        show: (values) => !values.importerUseBilling,
      },
    },
    {
      fieldName: 'importerAddress.lastName',
      label: $t('trade.order.addressForm.importerLastName'),
      component: 'Input',
      formItemClass: 'col-span-1',
      dependencies: {
        triggerFields: ['importerUseBilling'],
        show: (values) => !values.importerUseBilling,
      },
    },
    {
      fieldName: 'importerAddress.street',
      label: $t('trade.order.addressForm.importerStreet'),
      component: 'Input',
      formItemClass: 'col-span-2',
      dependencies: {
        triggerFields: ['importerUseBilling'],
        show: (values) => !values.importerUseBilling,
      },
    },
    {
      fieldName: 'importerAddress.city',
      label: $t('trade.order.addressForm.importerCity'),
      component: 'Input',
      formItemClass: 'col-span-1',
      dependencies: {
        triggerFields: ['importerUseBilling'],
        show: (values) => !values.importerUseBilling,
      },
    },
    {
      fieldName: 'importerAddress.state',
      label: $t('trade.order.addressForm.importerState'),
      component: 'Input',
      formItemClass: 'col-span-1',
      dependencies: {
        triggerFields: ['importerUseBilling'],
        show: (values) => !values.importerUseBilling,
      },
    },
    {
      fieldName: 'importerAddress.country',
      label: $t('trade.order.addressForm.importerCountry'),
      component: 'Input',
      formItemClass: 'col-span-1',
      dependencies: {
        triggerFields: ['importerUseBilling'],
        show: (values) => !values.importerUseBilling,
      },
    },
    {
      fieldName: 'importerAddress.postcode',
      label: $t('trade.order.addressForm.importerPostcode'),
      component: 'Input',
      formItemClass: 'col-span-1',
      dependencies: {
        triggerFields: ['importerUseBilling'],
        show: (values) => !values.importerUseBilling,
      },
    },
    {
      fieldName: 'importerAddress.phone',
      label: $t('trade.order.addressForm.importerPhone'),
      component: 'Input',
      formItemClass: 'col-span-1',
      dependencies: {
        triggerFields: ['importerUseBilling'],
        show: (values) => !values.importerUseBilling,
      },
    },
    {
      fieldName: 'importerAddress.email',
      label: $t('trade.order.addressForm.importerEmail'),
      component: 'Input',
      formItemClass: 'col-span-1',
      dependencies: {
        triggerFields: ['importerUseBilling'],
        show: (values) => !values.importerUseBilling,
      },
    },
    {
      fieldName: 'importerAddress.vat',
      label: $t('trade.order.addressForm.importerVat'),
      component: 'Input',
      formItemClass: 'col-span-1',
      dependencies: {
        triggerFields: ['importerUseBilling'],
        show: (values) => !values.importerUseBilling,
      },
    },
    {
      fieldName: 'importerAddress.eori',
      label: $t('trade.order.addressForm.importerEori'),
      component: 'Input',
      formItemClass: 'col-span-1',
      dependencies: {
        triggerFields: ['importerUseBilling'],
        show: (values) => !values.importerUseBilling,
      },
    },
  ];
}

/** 订单发货表单配置 */
export function useDeliveryFormSchema(): VbenFormSchema[] {
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
      fieldName: 'expressType',
      label: $t('trade.order.deliveryForm.expressType'),
      component: 'RadioGroup',
      componentProps: {
        options: [
          { label: $t('trade.order.deliveryForm.express'), value: 1 },
          { label: $t('trade.order.deliveryForm.logistics'), value: 2 },
        ],
      },
      defaultValue: 1,
    },
    {
      fieldName: 'logisticsId',
      label: $t('trade.order.deliveryForm.logisticsCompany'),
      component: 'ApiSelect',
      componentProps: {
        api: getSimpleDeliveryExpressList,
        labelField: 'name',
        valueField: 'id',
        placeholder: $t('trade.order.deliveryForm.logisticsCompanyPlaceholder'),
      },
      dependencies: {
        triggerFields: ['expressType'],
        show: (values) => values.expressType === 1,
      },
    },
    {
      fieldName: 'logisticsNo',
      label: $t('trade.order.deliveryForm.logisticsNo'),
      component: 'Input',
      componentProps: {
        placeholder: $t('trade.order.deliveryForm.logisticsNoPlaceholder'),
      },
      dependencies: {
        triggerFields: ['expressType'],
        show: (values) => values.expressType === 1,
      },
    },
  ];
}

/** 人工付款表单配置 */
export function usePaymentFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'amount',
      label: $t('trade.order.form.payAmount'),
      component: 'InputNumber',
      componentProps: {
        min: 0.01,
        step: 0.01,
        precision: 2,
        placeholder: $t('trade.order.form.payAmountPlaceholder'),
        style: { width: '100%' },
      },
      rules: 'required',
    },
    {
      fieldName: 'paymentMethod',
      label: $t('trade.order.form.payMethod'),
      component: 'Select',
      componentProps: {
        options: getDictOptions(DICT_TYPE.TRADE_ORDER_PAYMENT_METHOD, 'number'),
        placeholder: $t('trade.order.form.payMethodPlaceholder'),
        style: { width: '100%' },
      },
      rules: 'required',
    },
    {
      fieldName: 'transactionId',
      label: $t('trade.order.form.transactionNo'),
      component: 'Input',
      componentProps: {
        placeholder: `${$t('trade.order.form.transactionNo')}（${$t(
          'common.optional',
        )}）`,
      },
    },
    {
      fieldName: 'remark',
      label: $t('trade.order.form.remark'),
      component: 'InputTextArea',
      componentProps: {
        rows: 3,
        maxlength: 200,
        showCount: true,
        placeholder: `${$t('trade.order.form.remark')}（${$t('common.optional')}）`,
      },
    },
  ];
}

/** 审批驳回表单配置 */
export function useApprovalRejectFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'reason',
      label: $t('trade.order.form.rejectReason'),
      component: 'InputTextArea',
      componentProps: {
        rows: 4,
        maxlength: 200,
        showCount: true,
        placeholder: $t('trade.order.form.rejectReasonPlaceholder'),
      },
      rules: 'required',
    },
  ];
}
