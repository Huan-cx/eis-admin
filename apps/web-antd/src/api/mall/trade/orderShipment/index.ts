import type {
  OrderShipmentApi,
  OrderShipmentEventApi,
} from '#/api/mall/trade/orderShipment/types';

import { requestClient } from '#/api/request';

/**
 * 获取发货单分页列表
 * @param params 分页参数
 * @returns 分页结果
 */
export async function getShipmentPage(params: OrderShipmentApi.PageParams) {
  return requestClient.get<OrderShipmentApi.PageResult>(
    '/trade/order-shipment/page',
    { params },
  );
}

/**
 * 获取发货单详情
 * @param id 发货单ID
 * @returns 发货单详情
 */
export async function getShipment(id: number) {
  return requestClient.get<OrderShipmentApi.Detail>(
    '/trade/order-shipment/get',
    { params: { id } },
  );
}

/**
 * 根据订单ID获取发货单
 * @param orderId 订单ID
 * @returns 发货单详情
 */
export async function getShipmentByOrderId(orderId: number) {
  return requestClient.get<OrderShipmentApi.Detail>(
    '/trade/order-shipment/get-by-order',
    { params: { orderId } },
  );
}

/**
 * 根据订单ID创建发货单
 * @param orderId 订单ID
 * @returns 发货单ID
 */
export async function createShipmentFromOrder(orderId: number) {
  return requestClient.get<number>('/trade/order-shipment/create-from-order', {
    params: { orderId },
  });
}

/**
 * 手动创建发货单
 * @param data 创建数据
 * @returns 发货单ID
 */
export async function createShipment(data: OrderShipmentApi.CreateRequest) {
  return requestClient.post<number>('/trade/order-shipment/create', data);
}

/**
 * 删除发货单
 * @param id 发货单ID
 */
export async function deleteShipment(id: number) {
  return requestClient.delete('/trade/order-shipment/delete', {
    params: { id },
  });
}

/**
 * 更新发货单
 * @param data 更新数据
 */
export async function updateShipment(data: OrderShipmentApi.UpdateRequest) {
  return requestClient.put('/trade/order-shipment/update', data);
}

/**
 * 更新发货单状态
 * @param data 状态更新数据
 */
export async function updateShipmentStatus(
  data: OrderShipmentApi.UpdateStatusRequest,
) {
  return requestClient.put('/trade/order-shipment/update-status', data);
}

/**
 * 计算订单装箱清单
 * @param orderId 订单ID
 * @returns 装箱清单
 */
export async function calculatePackingList(orderId: number) {
  return requestClient.get<OrderShipmentApi.PackingListResult>(
    '/trade/order-shipment/calculate-packing-list',
    { params: { orderId } },
  );
}

/**
 * 创建发货事件
 * @param data 事件数据
 */
export async function createShipmentEvent(
  data: OrderShipmentEventApi.CreateRequest,
) {
  return requestClient.post('/trade/order-shipment-event/create', data);
}

/**
 * 更新发货事件
 * @param data 更新数据
 */
export async function updateShipmentEvent(
  data: OrderShipmentEventApi.UpdateRequest,
) {
  return requestClient.put('/trade/order-shipment-event/update', data);
}

/**
 * 删除发货事件
 * @param id 事件ID
 */
export async function deleteShipmentEvent(id: number) {
  return requestClient.delete('/trade/order-shipment-event/delete', {
    params: { id },
  });
}

/**
 * 获取单个发货事件
 * @param id 事件ID
 * @returns 事件详情
 */
export async function getShipmentEvent(id: number) {
  return requestClient.get<OrderShipmentEventApi.Detail>(
    '/trade/order-shipment-event/get',
    { params: { id } },
  );
}

/**
 * 获取发货单的事件列表
 * @param shipmentId 发货单ID
 * @returns 事件列表
 */
export async function getShipmentEventList(shipmentId: number) {
  return requestClient.get<OrderShipmentEventApi.Detail[]>(
    '/trade/order-shipment-event/list-by-shipment',
    { params: { shipmentId } },
  );
}

/**
 * 获取发货状态配置（用于表格和表单选择）
 * @returns 发货状态配置
 */
export function getShipmentStatusOptions(): Array<{
  label: string;
  value: number;
}> {
  return [
    { label: '待发货', value: 10 },
    { label: '生产中', value: 20 },
    { label: '已货好', value: 30 },
    { label: '验货通过', value: 40 },
    { label: '验货失败', value: 41 },
    { label: '已出货', value: 50 },
    { label: '运输中', value: 60 },
    { label: '清关完成', value: 70 },
    { label: '已收货', value: 80 },
    { label: '已取消', value: 0 },
  ];
}

/**
 * 获取发货方式配置（用于表格和表单选择）
 * @returns 发货方式配置
 */
export function getShipmentTypeOptions(): Array<{
  label: string;
  value: number;
}> {
  return [
    { label: '海运整柜', value: 1 },
    { label: '海运拼箱', value: 2 },
    { label: '空运', value: 3 },
    { label: '快递', value: 4 },
    { label: '陆运', value: 5 },
  ];
}
