import type { VbenFormSchema } from '#/adapter/form';
import type { VxeGridPropTypes } from '#/adapter/vxe-table';
import type { MallDeliveryPickUpStoreApi } from '#/api/mall/trade/delivery/pickUpStore';

import { DeliveryTypeEnum, DICT_TYPE } from '@vben/constants';
import { getDictOptions } from '@vben/hooks';
import { convertToInteger, formatToFraction } from '@vben/utils';

import { getSimpleDeliveryExpressList } from '#/api/mall/trade/delivery/express';
import { getSimpleDeliveryPickUpStoreList } from '#/api/mall/trade/delivery/pickUpStore';
import { $t } from '#/locales';
import { getRangePickerDefaultProps } from '#/utils';

/** 关联数据 */
let pickUpStoreList: MallDeliveryPickUpStoreApi.DeliveryPickUpStore[] = [];
getSimpleDeliveryPickUpStoreList().then((data) => {
  pickUpStoreList = data;
});

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
      dependencies: {
        triggerFields: ['deliveryType'],
        show: (values) => values.deliveryType === DeliveryTypeEnum.PICK_UP.type,
      },
    },
    {
      fieldName: 'pickUpVerifyCode',
      label: $t('trade.order.form.pickUpVerifyCode'),
      component: 'Input',
      componentProps: {
        placeholder: $t('trade.order.form.pickUpVerifyCodePlaceholder'),
        allowClear: true,
      },
      dependencies: {
        triggerFields: ['deliveryType'],
        show: (values) => values.deliveryType === DeliveryTypeEnum.PICK_UP.type,
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
      field: 'user',
      title: $t('trade.order.grid.user'),
      formatter: ({ row }) => {
        if (row.deliveryType === DeliveryTypeEnum.EXPRESS.type) {
          let addressStr = `${$t('trade.order.grid.buyer')}：${row.user?.nickname}`;
          if (!row.receiveUseBilling) {
            addressStr += ` / ${$t('trade.order.grid.receiver')}： ${row.receiverAddress?.firstName} ${row.receiverAddress?.lastName} ${row.receiverAddress?.phone} ${row.receiverAddress?.country} ${row.receiverAddress?.state} ${row.receiverAddress?.city} ${row.receiverAddress?.street}`;
          }
          if (!row.businessUseBilling) {
            addressStr += ` / ${$t('trade.order.grid.businessAddress')}：${row.businessAddress?.companyName} ${row.businessAddress?.firstName} ${row.businessAddress?.lastName} ${row.businessAddress?.country} ${row.businessAddress?.state} ${row.businessAddress?.city} ${row.businessAddress?.street}`;
          }
          if (!row.receiveUseBilling && !row.businessUseBilling) {
            addressStr += ` / ${$t('trade.order.grid.billingAddress')}：${row.billingAddress?.firstName} ${row.billingAddress?.lastName} ${row.billingAddress?.country} ${row.billingAddress?.state} ${row.billingAddress?.city} ${row.billingAddress?.street}`;
          }
          return addressStr;
        }
        if (row.deliveryType === DeliveryTypeEnum.PICK_UP.type) {
          return `${$t('trade.order.grid.storeName')}：${pickUpStoreList.find((item) => item.id === row.pickUpStoreId)?.name} /
                    ${$t('trade.order.grid.storePhone')}：${pickUpStoreList.find((item) => item.id === row.pickUpStoreId)?.phone} /
                    ${$t('trade.order.grid.pickUpStore')}：${pickUpStoreList.find((item) => item.id === row.pickUpStoreId)?.detailAddress}
                    `;
        }
        return '';
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
      title: $t('common.action'),
      width: 180,
      fixed: 'right',
      slots: { default: 'actions' },
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
    {
      fieldName: 'receiveUseBilling',
      label: $t('trade.order.addressForm.receiveUseBilling'),
      component: 'Switch',
      componentProps: {
        checkedChildren: $t('common.yes'),
        unCheckedChildren: $t('common.no'),
      },
      defaultValue: false,
    },
    {
      fieldName: 'businessUseBilling',
      label: $t('trade.order.addressForm.businessUseBilling'),
      component: 'Switch',
      componentProps: {
        checkedChildren: $t('common.yes'),
        unCheckedChildren: $t('common.no'),
      },
      defaultValue: false,
    },
    {
      fieldName: 'receiverAddress.firstName',
      label: $t('trade.order.addressForm.receiverFirstName'),
      component: 'Input',
      rules: 'required',
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
      dependencies: {
        triggerFields: ['receiveUseBilling'],
        show: (values) => !values.receiveUseBilling,
      },
    },
    {
      fieldName: 'receiverAddress.postcode',
      label: $t('trade.order.addressForm.postcode'),
      component: 'Input',
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
      dependencies: {
        triggerFields: ['receiveUseBilling'],
        show: (values) => !values.receiveUseBilling,
      },
    },
    {
      fieldName: 'receiverAddress.email',
      label: $t('trade.order.addressForm.email'),
      component: 'Input',
      dependencies: {
        triggerFields: ['receiveUseBilling'],
        show: (values) => !values.receiveUseBilling,
      },
    },
    {
      fieldName: 'receiverAddress.vat',
      label: $t('trade.order.addressForm.vat'),
      component: 'Input',
      dependencies: {
        triggerFields: ['receiveUseBilling'],
        show: (values) => !values.receiveUseBilling,
      },
    },
    {
      fieldName: 'receiverAddress.eori',
      label: $t('trade.order.addressForm.eori'),
      component: 'Input',
      dependencies: {
        triggerFields: ['receiveUseBilling'],
        show: (values) => !values.receiveUseBilling,
      },
    },
    {
      fieldName: 'billingAddress.companyName',
      label: $t('trade.order.addressForm.billingCompanyName'),
      component: 'Input',
    },
    {
      fieldName: 'billingAddress.firstName',
      label: $t('trade.order.addressForm.billingFirstName'),
      component: 'Input',
      rules: 'required',
    },
    {
      fieldName: 'billingAddress.lastName',
      label: $t('trade.order.addressForm.billingLastName'),
      component: 'Input',
      rules: 'required',
    },
    {
      fieldName: 'billingAddress.street',
      label: $t('trade.order.addressForm.billingStreet'),
      component: 'Input',
      rules: 'required',
    },
    {
      fieldName: 'billingAddress.city',
      label: $t('trade.order.addressForm.billingCity'),
      component: 'Input',
      rules: 'required',
    },
    {
      fieldName: 'billingAddress.state',
      label: $t('trade.order.addressForm.billingState'),
      component: 'Input',
      rules: 'required',
    },
    {
      fieldName: 'billingAddress.country',
      label: $t('trade.order.addressForm.billingCountry'),
      component: 'Input',
      rules: 'required',
    },
    {
      fieldName: 'billingAddress.postcode',
      label: $t('trade.order.addressForm.billingPostcode'),
      component: 'Input',
    },
    {
      fieldName: 'billingAddress.phone',
      label: $t('trade.order.addressForm.billingPhone'),
      component: 'Input',
      rules: 'required',
    },
    {
      fieldName: 'billingAddress.email',
      label: $t('trade.order.addressForm.billingEmail'),
      component: 'Input',
    },
    {
      fieldName: 'billingAddress.vat',
      label: $t('trade.order.addressForm.billingVat'),
      component: 'Input',
    },
    {
      fieldName: 'billingAddress.eori',
      label: $t('trade.order.addressForm.billingEori'),
      component: 'Input',
    },
    {
      fieldName: 'businessAddress.companyName',
      label: $t('trade.order.addressForm.businessCompanyName'),
      component: 'Input',
      dependencies: {
        triggerFields: ['businessUseBilling'],
        show: (values) => !values.businessUseBilling,
      },
    },
    {
      fieldName: 'businessAddress.firstName',
      label: $t('trade.order.addressForm.businessFirstName'),
      component: 'Input',
      dependencies: {
        triggerFields: ['businessUseBilling'],
        show: (values) => !values.businessUseBilling,
      },
    },
    {
      fieldName: 'businessAddress.lastName',
      label: $t('trade.order.addressForm.businessLastName'),
      component: 'Input',
      dependencies: {
        triggerFields: ['businessUseBilling'],
        show: (values) => !values.businessUseBilling,
      },
    },
    {
      fieldName: 'businessAddress.street',
      label: $t('trade.order.addressForm.businessStreet'),
      component: 'Input',
      dependencies: {
        triggerFields: ['businessUseBilling'],
        show: (values) => !values.businessUseBilling,
      },
    },
    {
      fieldName: 'businessAddress.city',
      label: $t('trade.order.addressForm.businessCity'),
      component: 'Input',
      dependencies: {
        triggerFields: ['businessUseBilling'],
        show: (values) => !values.businessUseBilling,
      },
    },
    {
      fieldName: 'businessAddress.state',
      label: $t('trade.order.addressForm.businessState'),
      component: 'Input',
      dependencies: {
        triggerFields: ['businessUseBilling'],
        show: (values) => !values.businessUseBilling,
      },
    },
    {
      fieldName: 'businessAddress.country',
      label: $t('trade.order.addressForm.businessCountry'),
      component: 'Input',
      dependencies: {
        triggerFields: ['businessUseBilling'],
        show: (values) => !values.businessUseBilling,
      },
    },
    {
      fieldName: 'businessAddress.postcode',
      label: $t('trade.order.addressForm.businessPostcode'),
      component: 'Input',
      dependencies: {
        triggerFields: ['businessUseBilling'],
        show: (values) => !values.businessUseBilling,
      },
    },
    {
      fieldName: 'businessAddress.phone',
      label: $t('trade.order.addressForm.businessPhone'),
      component: 'Input',
      dependencies: {
        triggerFields: ['businessUseBilling'],
        show: (values) => !values.businessUseBilling,
      },
    },
    {
      fieldName: 'businessAddress.email',
      label: $t('trade.order.addressForm.businessEmail'),
      component: 'Input',
      dependencies: {
        triggerFields: ['businessUseBilling'],
        show: (values) => !values.businessUseBilling,
      },
    },
    {
      fieldName: 'businessAddress.vat',
      label: $t('trade.order.addressForm.businessVat'),
      component: 'Input',
      dependencies: {
        triggerFields: ['businessUseBilling'],
        show: (values) => !values.businessUseBilling,
      },
    },
    {
      fieldName: 'businessAddress.eori',
      label: $t('trade.order.addressForm.businessEori'),
      component: 'Input',
      dependencies: {
        triggerFields: ['businessUseBilling'],
        show: (values) => !values.businessUseBilling,
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
          { label: $t('trade.order.deliveryForm.express'), value: 'express' },
          { label: $t('trade.order.deliveryForm.none'), value: 'none' },
        ],
        buttonStyle: 'solid',
        optionType: 'button',
      },
      defaultValue: 'express',
    },
    {
      fieldName: 'logisticsId',
      label: $t('trade.order.deliveryForm.logisticsId'),
      component: 'ApiSelect',
      componentProps: {
        api: getSimpleDeliveryExpressList,
        labelField: 'name',
        valueField: 'id',
        placeholder: $t('trade.order.deliveryForm.logisticsIdPlaceholder'),
      },
      dependencies: {
        triggerFields: ['expressType'],
        show: (values) => values.expressType === 'express',
      },
      rules: 'required',
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
        show: (values) => values.expressType === 'express',
      },
      rules: 'required',
    },
  ];
}
