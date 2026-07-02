import type { VbenFormSchema } from '#/adapter/form';
import type { VxeGridPropTypes } from '#/adapter/vxe-table';

import { $t } from '#/locales';
import { getRangePickerDefaultProps } from '#/utils';

/** 发货状态配置 */
export function getShipmentStatusOptions() {
  return [
    { label: $t('trade.shipment.status.10'), value: 10 },
    { label: $t('trade.shipment.status.20'), value: 20 },
    { label: $t('trade.shipment.status.30'), value: 30 },
    { label: $t('trade.shipment.status.40'), value: 40 },
    { label: $t('trade.shipment.status.41'), value: 41 },
    { label: $t('trade.shipment.status.50'), value: 50 },
    { label: $t('trade.shipment.status.60'), value: 60 },
    { label: $t('trade.shipment.status.70'), value: 70 },
    { label: $t('trade.shipment.status.80'), value: 80 },
    { label: $t('trade.shipment.status.0'), value: 0 },
  ];
}

/** 发货方式配置 */
export function getShipmentTypeOptions() {
  return [
    { label: $t('trade.shipment.shipmentType.1'), value: 1 },
    { label: $t('trade.shipment.shipmentType.2'), value: 2 },
    { label: $t('trade.shipment.shipmentType.3'), value: 3 },
    { label: $t('trade.shipment.shipmentType.4'), value: 4 },
    { label: $t('trade.shipment.shipmentType.5'), value: 5 },
  ];
}

/**
 * 列表的搜索表单
 */
export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'orderNo',
      label: $t('trade.shipment.form.orderNo'),
      component: 'Input',
      componentProps: {
        placeholder: $t('trade.shipment.form.orderNoPlaceholder'),
        allowClear: true,
      },
    },
    {
      fieldName: 'shipmentNo',
      label: $t('trade.shipment.form.shipmentNo'),
      component: 'Input',
      componentProps: {
        placeholder: $t('trade.shipment.form.shipmentNoPlaceholder'),
        allowClear: true,
      },
    },
    {
      fieldName: 'customerName',
      label: $t('trade.shipment.form.customerName'),
      component: 'Input',
      componentProps: {
        placeholder: $t('trade.shipment.form.customerNamePlaceholder'),
        allowClear: true,
      },
    },
    {
      fieldName: 'status',
      label: $t('trade.shipment.form.status'),
      component: 'Select',
      componentProps: {
        options: getShipmentStatusOptions(),
        placeholder: $t('trade.shipment.form.statusPlaceholder'),
        allowClear: true,
      },
    },
    {
      fieldName: 'shipmentType',
      label: $t('trade.shipment.form.shipmentType'),
      component: 'Select',
      componentProps: {
        options: getShipmentTypeOptions(),
        placeholder: $t('trade.shipment.form.shipmentTypePlaceholder'),
        allowClear: true,
      },
    },
    {
      fieldName: 'createTime',
      label: $t('trade.shipment.form.createTime'),
      component: 'RangePicker',
      componentProps: {
        ...getRangePickerDefaultProps(),
        allowClear: true,
      },
    },
  ];
}

/**
 * 表格列配置
 */
export function useGridColumns(): VxeGridPropTypes.Columns {
  return [
    {
      type: 'seq',
      title: $t('trade.shipment.grid.index'),
      width: 60,
      fixed: 'left',
    },
    {
      field: 'shipmentNo',
      title: $t('trade.shipment.grid.shipmentNo'),
      fixed: 'left',
      minWidth: 160,
    },
    {
      field: 'orderNo',
      title: $t('trade.shipment.grid.orderNo'),
      minWidth: 160,
    },
    {
      field: 'customerName',
      title: $t('trade.shipment.grid.customerName'),
      minWidth: 150,
    },
    {
      field: 'status',
      title: $t('trade.shipment.grid.status'),
      width: 100,
      cellRender: {
        name: 'CellTag',
        options: getShipmentStatusOptions(),
      },
    },
    {
      field: 'shipmentType',
      title: $t('trade.shipment.grid.shipmentType'),
      width: 100,
      formatter: ({ cellValue }) => {
        const type = getShipmentTypeOptions().find(
          (item) => item.value === cellValue,
        );
        return type?.label || '-';
      },
    },
    {
      field: 'loadingPort',
      title: $t('trade.shipment.grid.loadingPort'),
      minWidth: 120,
    },
    {
      field: 'dischargePort',
      title: $t('trade.shipment.grid.dischargePort'),
      minWidth: 120,
    },
    {
      field: 'logisticsName',
      title: $t('trade.shipment.grid.logisticsName'),
      minWidth: 120,
    },
    {
      field: 'trackingNo',
      title: $t('trade.shipment.grid.trackingNo'),
      minWidth: 140,
    },
    {
      field: 'blNo',
      title: $t('trade.shipment.grid.blNo'),
      minWidth: 120,
    },
    {
      field: 'vesselFlight',
      title: $t('trade.shipment.grid.vesselFlight'),
      minWidth: 120,
    },
    {
      field: 'etd',
      title: $t('trade.shipment.grid.etd'),
      formatter: 'formatDate',
      minWidth: 100,
    },
    {
      field: 'atd',
      title: $t('trade.shipment.grid.atd'),
      formatter: 'formatDate',
      minWidth: 100,
    },
    {
      field: 'eta',
      title: $t('trade.shipment.grid.eta'),
      formatter: 'formatDate',
      minWidth: 100,
    },
    {
      field: 'ata',
      title: $t('trade.shipment.grid.ata'),
      formatter: 'formatDate',
      minWidth: 100,
    },
    {
      field: 'estimatedDeliveryDate',
      title: $t('trade.shipment.grid.estimatedDeliveryDate'),
      formatter: 'formatDate',
      minWidth: 120,
    },
    {
      field: 'finalDeliveryDate',
      title: $t('trade.shipment.grid.finalDeliveryDate'),
      formatter: 'formatDate',
      minWidth: 120,
    },
    {
      field: 'totalCtns',
      title: $t('trade.shipment.grid.totalCtns'),
      width: 80,
    },
    {
      field: 'totalNw',
      title: $t('trade.shipment.grid.totalNw'),
      width: 80,
    },
    {
      field: 'totalGw',
      title: $t('trade.shipment.grid.totalGw'),
      width: 80,
    },
    {
      field: 'createTime',
      title: $t('trade.shipment.grid.createTime'),
      formatter: 'formatDateTime',
      minWidth: 160,
    },
    {
      title: $t('trade.shipment.grid.actions'),
      width: 240,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}

/**
 * 创建发货单表单配置
 */
export function useCreateShipmentFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'orderId',
      label: $t('trade.shipment.form.orderId'),
      component: 'InputNumber',
      componentProps: {
        placeholder: $t('trade.shipment.form.orderIdPlaceholder'),
        min: 1,
      },
      rules: 'required',
    },
    {
      fieldName: 'shipmentType',
      label: $t('trade.shipment.form.shipmentType'),
      component: 'Select',
      componentProps: {
        options: getShipmentTypeOptions(),
        placeholder: $t('trade.shipment.form.shipmentTypePlaceholder'),
        allowClear: true,
      },
    },
    {
      fieldName: 'loadingPort',
      label: $t('trade.shipment.form.loadingPort'),
      component: 'Input',
      componentProps: {
        placeholder: $t('trade.shipment.form.loadingPortPlaceholder'),
        allowClear: true,
      },
    },
    {
      fieldName: 'dischargePort',
      label: $t('trade.shipment.form.dischargePort'),
      component: 'Input',
      componentProps: {
        placeholder: $t('trade.shipment.form.dischargePortPlaceholder'),
        allowClear: true,
      },
    },
    {
      fieldName: 'logisticsId',
      label: $t('trade.shipment.form.logisticsId'),
      component: 'ApiSelect',
      componentProps: {
        api: async () => {
          const { getSimpleDeliveryExpressList } =
            await import('#/api/mall/trade/delivery/express');
          return await getSimpleDeliveryExpressList();
        },
        labelField: 'name',
        valueField: 'id',
        placeholder: $t('trade.shipment.form.logisticsIdPlaceholder'),
        allowClear: true,
      },
    },
    {
      fieldName: 'trackingNo',
      label: $t('trade.shipment.form.trackingNo'),
      component: 'Input',
      componentProps: {
        placeholder: $t('trade.shipment.form.trackingNoPlaceholder'),
        allowClear: true,
      },
    },
    {
      fieldName: 'carrier',
      label: $t('trade.shipment.form.carrier'),
      component: 'Input',
      componentProps: {
        placeholder: $t('trade.shipment.form.carrierPlaceholder'),
        allowClear: true,
      },
    },
    {
      fieldName: 'vesselFlight',
      label: $t('trade.shipment.form.vesselFlight'),
      component: 'Input',
      componentProps: {
        placeholder: $t('trade.shipment.form.vesselFlightPlaceholder'),
        allowClear: true,
      },
    },
    {
      fieldName: 'containerNo',
      label: $t('trade.shipment.form.containerNo'),
      component: 'Input',
      componentProps: {
        placeholder: $t('trade.shipment.form.containerNoPlaceholder'),
        allowClear: true,
      },
    },
    {
      fieldName: 'blNo',
      label: $t('trade.shipment.form.blNo'),
      component: 'Input',
      componentProps: {
        placeholder: $t('trade.shipment.form.blNoPlaceholder'),
        allowClear: true,
      },
    },
    {
      fieldName: 'remark',
      label: $t('trade.shipment.form.remark'),
      component: 'Textarea',
      componentProps: {
        rows: 3,
        placeholder: $t('trade.shipment.form.remarkPlaceholder'),
        allowClear: true,
      },
    },
  ];
}

/**
 * 编辑发货单表单配置
 */
export function useShipmentFormSchema(): VbenFormSchema[] {
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
      fieldName: 'shipmentType',
      label: $t('trade.shipment.form.shipmentType'),
      component: 'Select',
      componentProps: {
        options: getShipmentTypeOptions(),
        allowClear: true,
      },
    },
    {
      fieldName: 'loadingPort',
      label: $t('trade.shipment.form.loadingPort'),
      component: 'Input',
      componentProps: {
        allowClear: true,
      },
    },
    {
      fieldName: 'dischargePort',
      label: $t('trade.shipment.form.dischargePort'),
      component: 'Input',
      componentProps: {
        allowClear: true,
      },
    },
    {
      fieldName: 'logisticsId',
      label: $t('trade.shipment.form.logisticsId'),
      component: 'ApiSelect',
      componentProps: {
        api: async () => {
          const { getSimpleDeliveryExpressList } =
            await import('#/api/mall/trade/delivery/express');
          return await getSimpleDeliveryExpressList();
        },
        labelField: 'name',
        valueField: 'id',
        allowClear: true,
      },
    },
    {
      fieldName: 'trackingNo',
      label: $t('trade.shipment.form.trackingNo'),
      component: 'Input',
      componentProps: {
        allowClear: true,
      },
    },
    {
      fieldName: 'carrier',
      label: $t('trade.shipment.form.carrier'),
      component: 'Input',
      componentProps: {
        allowClear: true,
      },
    },
    {
      fieldName: 'vesselFlight',
      label: $t('trade.shipment.form.vesselFlight'),
      component: 'Input',
      componentProps: {
        allowClear: true,
      },
    },
    {
      fieldName: 'containerNo',
      label: $t('trade.shipment.form.containerNo'),
      component: 'Input',
      componentProps: {
        allowClear: true,
      },
    },
    {
      fieldName: 'blNo',
      label: $t('trade.shipment.form.blNo'),
      component: 'Input',
      componentProps: {
        allowClear: true,
      },
    },
    {
      fieldName: 'remark',
      label: $t('trade.shipment.form.remark'),
      component: 'Textarea',
      componentProps: {
        rows: 3,
        allowClear: true,
      },
    },
  ];
}

/**
 * 状态更新表单配置
 */
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
      label: $t('trade.shipment.form.targetStatus'),
      component: 'Select',
      componentProps: {
        options: getShipmentStatusOptions(),
        allowClear: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'remark',
      label: $t('trade.shipment.form.remark'),
      component: 'Textarea',
      componentProps: {
        rows: 3,
        allowClear: true,
      },
    },
  ];
}

/**
 * 发货事件表单配置
 */
export function useEventFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'shipmentId',
      dependencies: {
        triggerFields: [''],
        show: () => false,
      },
    },
    {
      fieldName: 'eventType',
      label: $t('trade.shipment.form.eventType'),
      component: 'Select',
      componentProps: {
        options: [
          { label: $t('trade.shipment.eventType.1001'), value: 1001 },
          { label: $t('trade.shipment.eventType.2001'), value: 2001 },
          { label: $t('trade.shipment.eventType.2002'), value: 2002 },
          { label: $t('trade.shipment.eventType.3001'), value: 3001 },
          { label: $t('trade.shipment.eventType.4001'), value: 4001 },
          { label: $t('trade.shipment.eventType.4002'), value: 4002 },
          { label: $t('trade.shipment.eventType.4003'), value: 4003 },
          { label: $t('trade.shipment.eventType.5001'), value: 5001 },
          { label: $t('trade.shipment.eventType.5002'), value: 5002 },
          { label: $t('trade.shipment.eventType.6001'), value: 6001 },
          { label: $t('trade.shipment.eventType.6002'), value: 6002 },
          { label: $t('trade.shipment.eventType.7000'), value: 7000 },
          { label: $t('trade.shipment.eventType.7001'), value: 7001 },
          { label: $t('trade.shipment.eventType.7002'), value: 7002 },
          { label: $t('trade.shipment.eventType.7003'), value: 7003 },
          { label: $t('trade.shipment.eventType.7004'), value: 7004 },
          { label: $t('trade.shipment.eventType.8001'), value: 8001 },
          { label: $t('trade.shipment.eventType.8002'), value: 8002 },
          { label: $t('trade.shipment.eventType.9000'), value: 9000 },
          { label: $t('trade.shipment.eventType.9001'), value: 9001 },
          { label: $t('trade.shipment.eventType.9002'), value: 9002 },
          { label: $t('trade.shipment.eventType.1'), value: 1 },
          { label: $t('trade.shipment.eventType.9999'), value: 9999 },
        ],
        allowClear: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'eventTime',
      label: $t('trade.shipment.form.eventTime'),
      component: 'DatePicker',
      componentProps: {
        showTime: true,
        format: 'YYYY-MM-DD HH:mm:ss',
        allowClear: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'eventDate',
      label: $t('trade.shipment.form.eventDate'),
      component: 'DatePicker',
      componentProps: {
        showTime: true,
        format: 'YYYY-MM-DD HH:mm:ss',
        allowClear: true,
      },
    },
    {
      fieldName: 'title',
      label: $t('trade.shipment.form.title'),
      component: 'Input',
      componentProps: {
        allowClear: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'description',
      label: $t('trade.shipment.form.description'),
      component: 'Textarea',
      componentProps: {
        rows: 4,
        allowClear: true,
      },
    },
    {
      fieldName: 'attachments',
      label: $t('trade.shipment.form.attachments'),
      component: 'Input',
      componentProps: {
        allowClear: true,
      },
    },
  ];
}
