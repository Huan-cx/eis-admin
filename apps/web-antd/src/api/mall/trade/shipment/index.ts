import type {
  OrderShipmentApi,
  OrderShipmentEventApi,
} from '#/api/mall/trade/shipment/types';

import { requestClient } from '#/api/request';

export async function getShipmentPage(params: OrderShipmentApi.PageParams) {
  return requestClient.get<OrderShipmentApi.PageResult>(
    '/trade/shipment/page',
    { params },
  );
}

export async function getShipment(id: number) {
  return requestClient.get<OrderShipmentApi.Detail>('/trade/shipment/get', {
    params: { id },
  });
}

export async function getShipmentByOrderId(orderId: number) {
  return requestClient.get<OrderShipmentApi.Detail>(
    '/trade/shipment/get-by-order',
    { params: { orderId } },
  );
}

export async function createShipmentFromOrder(orderId: number) {
  return requestClient.get<number>('/trade/shipment/create-from-order', {
    params: { orderId },
  });
}

export async function createShipment(data: OrderShipmentApi.CreateRequest) {
  return requestClient.post<number>('/trade/shipment/create', data);
}

export async function deleteShipment(id: number) {
  return requestClient.delete('/trade/shipment/delete', {
    params: { id },
  });
}

export async function updateShipment(data: OrderShipmentApi.UpdateRequest) {
  return requestClient.put('/trade/shipment/update', data);
}

export async function updateShipmentStatus(
  data: OrderShipmentApi.UpdateStatusRequest,
) {
  return requestClient.put('/trade/shipment/update-status', data);
}

export async function updateShipmentItems(
  data: OrderShipmentApi.UpdateItemsRequest,
) {
  return requestClient.put('/trade/shipment/update-items', data);
}

export async function calculatePackingList(orderId: number) {
  return requestClient.get<OrderShipmentApi.PackingListResult>(
    '/trade/shipment/calculate-packing-list',
    { params: { orderId } },
  );
}

export async function calculatePackingListBatch(orderIds: number[]) {
  return requestClient.post<OrderShipmentApi.PackingListResult[]>(
    '/trade/shipment/calculate-packing-list-batch',
    orderIds,
  );
}

export async function searchOrders(keyword: string) {
  const url = keyword
    ? `/trade/shipment/search-order?keyword=${encodeURIComponent(keyword)}`
    : `/trade/shipment/search-order`;
  return requestClient.get<OrderShipmentApi.OrderSearchItem[]>(url);
}

export async function createShipmentEvent(
  data: OrderShipmentEventApi.CreateRequest,
) {
  return requestClient.post('/trade/shipment-event/create', data);
}

export async function updateShipmentEvent(
  data: OrderShipmentEventApi.UpdateRequest,
) {
  return requestClient.put('/trade/shipment-event/update', data);
}

export async function deleteShipmentEvent(id: number) {
  return requestClient.delete('/trade/shipment-event/delete', {
    params: { id },
  });
}

export async function getShipmentEvent(id: number) {
  return requestClient.get<OrderShipmentEventApi.Detail>(
    '/trade/shipment-event/get',
    { params: { id } },
  );
}

export async function getShipmentEventList(shipmentId: number) {
  return requestClient.get<OrderShipmentEventApi.Detail[]>(
    '/trade/shipment-event/list-by-shipment',
    { params: { shipmentId } },
  );
}

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
