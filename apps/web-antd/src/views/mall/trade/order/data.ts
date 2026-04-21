import type { VbenFormSchema } from "#/adapter/form";
import type { VxeGridPropTypes } from "#/adapter/vxe-table";
import type { MallDeliveryPickUpStoreApi } from "#/api/mall/trade/delivery/pickUpStore";
import { getSimpleDeliveryPickUpStoreList } from "#/api/mall/trade/delivery/pickUpStore";

import { DeliveryTypeEnum, DICT_TYPE } from "@vben/constants";
import { getDictOptions } from "@vben/hooks";
import { convertToInteger, formatToFraction } from "@vben/utils";

import { getSimpleDeliveryExpressList } from "#/api/mall/trade/delivery/express";
import { getRangePickerDefaultProps } from "#/utils";

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
      label: '订单状态',
      component: 'Select',
      componentProps: {
        options: getDictOptions(DICT_TYPE.TRADE_ORDER_STATUS, 'number'),
        placeholder: '请选择订单状态',
        allowClear: true,
      },
    },
    {
      fieldName: 'payChannelCode',
      label: '支付方式',
      component: 'Select',
      componentProps: {
        options: getDictOptions(DICT_TYPE.PAY_CHANNEL_CODE, 'number'),
        placeholder: '请选择支付方式',
        allowClear: true,
      },
    },
    {
      fieldName: 'createTime',
      label: '创建时间',
      component: 'RangePicker',
      componentProps: {
        ...getRangePickerDefaultProps(),
        allowClear: true,
      },
    },
    {
      fieldName: 'terminal',
      label: '订单来源',
      component: 'Select',
      componentProps: {
        options: getDictOptions(DICT_TYPE.TERMINAL, 'number'),
        placeholder: '请选择订单来源',
        allowClear: true,
      },
    },
    {
      fieldName: 'deliveryType',
      label: '配送方式',
      component: 'Select',
      componentProps: {
        options: getDictOptions(DICT_TYPE.TRADE_DELIVERY_TYPE, 'number'),
        placeholder: '请选择配送方式',
        allowClear: true,
      },
    },
    {
      fieldName: 'logisticsId',
      label: '快递公司',
      component: 'ApiSelect',
      componentProps: {
        api: getSimpleDeliveryExpressList,
        labelField: 'name',
        valueField: 'id',
        placeholder: '请选择快递公司',
        allowClear: true,
      },
      dependencies: {
        triggerFields: ['deliveryType'],
        show: (values) => values.deliveryType === DeliveryTypeEnum.EXPRESS.type,
      },
    },
    {
      fieldName: 'pickUpStoreId',
      label: '自提门店',
      component: 'ApiSelect',
      componentProps: {
        api: getSimpleDeliveryPickUpStoreList,
        labelField: 'name',
        valueField: 'id',
        placeholder: '请选择自提门店',
        allowClear: true,
      },
      dependencies: {
        triggerFields: ['deliveryType'],
        show: (values) => values.deliveryType === DeliveryTypeEnum.PICK_UP.type,
      },
    },
    {
      fieldName: 'pickUpVerifyCode',
      label: '核销码',
      component: 'Input',
      componentProps: {
        placeholder: '请输入核销码',
        allowClear: true,
      },
      dependencies: {
        triggerFields: ['deliveryType'],
        show: (values) => values.deliveryType === DeliveryTypeEnum.PICK_UP.type,
      },
    },
    {
      fieldName: 'no',
      label: '订单号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入订单号',
        allowClear: true,
      },
    },
    {
      fieldName: 'userId',
      label: '用户 UID',
      component: 'Input',
      componentProps: {
        placeholder: '请输入用户 UID',
        allowClear: true,
      },
    },
    {
      fieldName: 'userNickname',
      label: '用户昵称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入用户昵称',
        allowClear: true,
      },
    },
    {
      fieldName: 'userMobile',
      label: '用户电话',
      component: 'Input',
      componentProps: {
        placeholder: '请输入用户电话',
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
      title: '订单号',
      fixed: 'left',
      minWidth: 180,
    },
    {
      field: 'createTime',
      title: '下单时间',
      formatter: 'formatDateTime',
      minWidth: 160,
    },
    {
      field: 'terminal',
      title: '订单来源',
      cellRender: {
        name: 'CellDict',
        props: { type: DICT_TYPE.TERMINAL },
      },
      minWidth: 120,
    },
    {
      field: 'payChannelCode',
      title: '支付方式',
      cellRender: {
        name: 'CellDict',
        props: { type: DICT_TYPE.PAY_CHANNEL_CODE },
      },
      minWidth: 120,
    },
    {
      field: 'payTime',
      title: '支付时间',
      formatter: 'formatDateTime',
      minWidth: 160,
    },
    {
      field: 'type',
      title: '订单类型',
      cellRender: {
        name: 'CellDict',
        props: { type: DICT_TYPE.TRADE_ORDER_TYPE },
      },
      minWidth: 80,
    },
    {
      field: 'payPrice',
      title: '实际支付',
      formatter: 'formatFenToYuanAmount',
      minWidth: 180,
    },
    {
      field: 'user',
      title: '买家/收货人',
      formatter: ({ row }) => {
        if (row.deliveryType === DeliveryTypeEnum.EXPRESS.type) {
          let addressStr = `买家：${row.user?.nickname}`;
          if (!row.receiveUseBilling) {
            addressStr += ` / 收货人： ${row.receiverAddress?.firstName} ${row.receiverAddress?.lastName} ${row.receiverAddress?.phone} ${row.receiverAddress?.country} ${row.receiverAddress?.state} ${row.receiverAddress?.city} ${row.receiverAddress?.street}`;
          }
          if (!row.businessUseBilling) {
            addressStr += ` / 商业地址：${row.businessAddress?.companyName} ${row.businessAddress?.firstName} ${row.businessAddress?.lastName} ${row.businessAddress?.country} ${row.businessAddress?.state} ${row.businessAddress?.city} ${row.businessAddress?.street}`;
          }
          if (!row.receiveUseBilling && !row.businessUseBilling) {
            addressStr += ` / 账单地址：${row.billingAddress?.firstName} ${row.billingAddress?.lastName} ${row.billingAddress?.country} ${row.billingAddress?.state} ${row.billingAddress?.city} ${row.billingAddress?.street}`;
          }
          return addressStr;
        }
        if (row.deliveryType === DeliveryTypeEnum.PICK_UP.type) {
          return `门店名称：${pickUpStoreList.find((item) => item.id === row.pickUpStoreId)?.name} /
                  门店手机：${pickUpStoreList.find((item) => item.id === row.pickUpStoreId)?.phone} /
                  自提门店：${pickUpStoreList.find((item) => item.id === row.pickUpStoreId)?.detailAddress}
                  `;
        }
        return '';
      },
      minWidth: 180,
    },
    {
      field: 'deliveryType',
      title: '配送方式',
      cellRender: {
        name: 'CellDict',
        props: { type: DICT_TYPE.TRADE_DELIVERY_TYPE },
      },
      minWidth: 80,
    },
    {
      field: 'status',
      title: '订单状态',
      cellRender: {
        name: 'CellDict',
        props: { type: DICT_TYPE.TRADE_ORDER_STATUS },
      },
      minWidth: 80,
    },
    {
      title: '操作',
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
      label: '备注',
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
      label: '应付金额(总)',
      component: 'Input',
      componentProps: {
        placeholder: '请输入应付金额(总)',
        disabled: true,
        formatter: (value: string) => `${value}元`,
      },
    },
    {
      fieldName: 'adjustPrice',
      label: '订单调价',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入订单调价',
        step: 0.1,
        precision: 2,
      },
      help: '订单调价。 正数，加价；负数，减价',
      rules: 'required',
    },
    {
      fieldName: 'newPayPrice',
      label: '调价后',
      component: 'Input',
      componentProps: {
        placeholder: '',
        formatter: (value: string) => `${value}元`,
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
      label: '收货地址与账单地址相同',
      component: 'Switch',
      componentProps: {
        checkedChildren: '是',
        unCheckedChildren: '否',
      },
      defaultValue: false,
    },
    {
      fieldName: 'businessUseBilling',
      label: '商业地址与账单地址相同',
      component: 'Switch',
      componentProps: {
        checkedChildren: '是',
        unCheckedChildren: '否',
      },
      defaultValue: false,
    },
    {
      fieldName: 'receiverAddress.firstName',
      label: '收件人名字',
      component: 'Input',
      rules: 'required',
      dependencies: {
        triggerFields: ['receiveUseBilling'],
        show: (values) => !values.receiveUseBilling,
      },
    },
    {
      fieldName: 'receiverAddress.lastName',
      label: '收件人姓氏',
      component: 'Input',
      rules: 'required',
      dependencies: {
        triggerFields: ['receiveUseBilling'],
        show: (values) => !values.receiveUseBilling,
      },
    },
    {
      fieldName: 'receiverAddress.companyName',
      label: '公司名称',
      component: 'Input',
      dependencies: {
        triggerFields: ['receiveUseBilling'],
        show: (values) => !values.receiveUseBilling,
      },
    },
    {
      fieldName: 'receiverAddress.street',
      label: '街道地址',
      component: 'Input',
      rules: 'required',
      dependencies: {
        triggerFields: ['receiveUseBilling'],
        show: (values) => !values.receiveUseBilling,
      },
    },
    {
      fieldName: 'receiverAddress.city',
      label: '城市',
      component: 'Input',
      rules: 'required',
      dependencies: {
        triggerFields: ['receiveUseBilling'],
        show: (values) => !values.receiveUseBilling,
      },
    },
    {
      fieldName: 'receiverAddress.state',
      label: '州/省',
      component: 'Input',
      rules: 'required',
      dependencies: {
        triggerFields: ['receiveUseBilling'],
        show: (values) => !values.receiveUseBilling,
      },
    },
    {
      fieldName: 'receiverAddress.country',
      label: '国家',
      component: 'Input',
      rules: 'required',
      dependencies: {
        triggerFields: ['receiveUseBilling'],
        show: (values) => !values.receiveUseBilling,
      },
    },
    {
      fieldName: 'receiverAddress.postcode',
      label: '邮政编码',
      component: 'Input',
      dependencies: {
        triggerFields: ['receiveUseBilling'],
        show: (values) => !values.receiveUseBilling,
      },
    },
    {
      fieldName: 'receiverAddress.phone',
      label: '电话',
      component: 'Input',
      rules: 'required',
      dependencies: {
        triggerFields: ['receiveUseBilling'],
        show: (values) => !values.receiveUseBilling,
      },
    },
    {
      fieldName: 'receiverAddress.email',
      label: '邮箱',
      component: 'Input',
      dependencies: {
        triggerFields: ['receiveUseBilling'],
        show: (values) => !values.receiveUseBilling,
      },
    },
    {
      fieldName: 'receiverAddress.vat',
      label: '增值税号',
      component: 'Input',
      dependencies: {
        triggerFields: ['receiveUseBilling'],
        show: (values) => !values.receiveUseBilling,
      },
    },
    {
      fieldName: 'receiverAddress.eori',
      label: 'EORI号',
      component: 'Input',
      dependencies: {
        triggerFields: ['receiveUseBilling'],
        show: (values) => !values.receiveUseBilling,
      },
    },
    {
      fieldName: 'billingAddress.companyName',
      label: '账单公司名称',
      component: 'Input',
    },
    {
      fieldName: 'billingAddress.firstName',
      label: '账单名',
      component: 'Input',
      rules: 'required',
    },
    {
      fieldName: 'billingAddress.lastName',
      label: '账单姓',
      component: 'Input',
      rules: 'required',
    },
    {
      fieldName: 'billingAddress.street',
      label: '账单街道地址',
      component: 'Input',
      rules: 'required',
    },
    {
      fieldName: 'billingAddress.city',
      label: '账单城市',
      component: 'Input',
      rules: 'required',
    },
    {
      fieldName: 'billingAddress.state',
      label: '账单州/省',
      component: 'Input',
      rules: 'required',
    },
    {
      fieldName: 'billingAddress.country',
      label: '账单国家',
      component: 'Input',
      rules: 'required',
    },
    {
      fieldName: 'billingAddress.postcode',
      label: '账单邮政编码',
      component: 'Input',
    },
    {
      fieldName: 'billingAddress.phone',
      label: '账单电话',
      component: 'Input',
      rules: 'required',
    },
    {
      fieldName: 'billingAddress.email',
      label: '账单邮箱',
      component: 'Input',
    },
    {
      fieldName: 'billingAddress.vat',
      label: '账单增值税号',
      component: 'Input',
    },
    {
      fieldName: 'billingAddress.eori',
      label: '账单EORI号',
      component: 'Input',
    },
    {
      fieldName: 'businessAddress.companyName',
      label: '商业公司名称',
      component: 'Input',
      dependencies: {
        triggerFields: ['businessUseBilling'],
        show: (values) => !values.businessUseBilling,
      },
    },
    {
      fieldName: 'businessAddress.firstName',
      label: '商业名',
      component: 'Input',
      dependencies: {
        triggerFields: ['businessUseBilling'],
        show: (values) => !values.businessUseBilling,
      },
    },
    {
      fieldName: 'businessAddress.lastName',
      label: '商业姓',
      component: 'Input',
      dependencies: {
        triggerFields: ['businessUseBilling'],
        show: (values) => !values.businessUseBilling,
      },
    },
    {
      fieldName: 'businessAddress.street',
      label: '商业街道地址',
      component: 'Input',
      dependencies: {
        triggerFields: ['businessUseBilling'],
        show: (values) => !values.businessUseBilling,
      },
    },
    {
      fieldName: 'businessAddress.city',
      label: '商业城市',
      component: 'Input',
      dependencies: {
        triggerFields: ['businessUseBilling'],
        show: (values) => !values.businessUseBilling,
      },
    },
    {
      fieldName: 'businessAddress.state',
      label: '商业州/省',
      component: 'Input',
      dependencies: {
        triggerFields: ['businessUseBilling'],
        show: (values) => !values.businessUseBilling,
      },
    },
    {
      fieldName: 'businessAddress.country',
      label: '商业国家',
      component: 'Input',
      dependencies: {
        triggerFields: ['businessUseBilling'],
        show: (values) => !values.businessUseBilling,
      },
    },
    {
      fieldName: 'businessAddress.postcode',
      label: '商业邮政编码',
      component: 'Input',
      dependencies: {
        triggerFields: ['businessUseBilling'],
        show: (values) => !values.businessUseBilling,
      },
    },
    {
      fieldName: 'businessAddress.phone',
      label: '商业电话',
      component: 'Input',
      dependencies: {
        triggerFields: ['businessUseBilling'],
        show: (values) => !values.businessUseBilling,
      },
    },
    {
      fieldName: 'businessAddress.email',
      label: '商业邮箱',
      component: 'Input',
      dependencies: {
        triggerFields: ['businessUseBilling'],
        show: (values) => !values.businessUseBilling,
      },
    },
    {
      fieldName: 'businessAddress.vat',
      label: '商业增值税号',
      component: 'Input',
      dependencies: {
        triggerFields: ['businessUseBilling'],
        show: (values) => !values.businessUseBilling,
      },
    },
    {
      fieldName: 'businessAddress.eori',
      label: '商业EORI号',
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
      label: '发货方式',
      component: 'RadioGroup',
      componentProps: {
        options: [
          { label: '快递', value: 'express' },
          { label: '无需发货', value: 'none' },
        ],
        buttonStyle: 'solid',
        optionType: 'button',
      },
      defaultValue: 'express',
    },
    {
      fieldName: 'logisticsId',
      label: '物流公司',
      component: 'ApiSelect',
      componentProps: {
        api: getSimpleDeliveryExpressList,
        labelField: 'name',
        valueField: 'id',
        placeholder: '请选择物流公司',
      },
      dependencies: {
        triggerFields: ['expressType'],
        show: (values) => values.expressType === 'express',
      },
      rules: 'required',
    },
    {
      fieldName: 'logisticsNo',
      label: '物流单号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入物流单号',
      },
      dependencies: {
        triggerFields: ['expressType'],
        show: (values) => values.expressType === 'express',
      },
      rules: 'required',
    },
  ];
}
