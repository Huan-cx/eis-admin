import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

export namespace B2BOrderApi {
  export interface OrderItem {
    id: number;
    skuId: number;
    spuId: number;
    spuName: string;
    skuName: string;
    picUrl: string;
    count: number;
    unitPrice: number;
    totalPrice: number;
    properties?: {
      propertyId?: number;
      propertyName?: string;
      valueId?: number;
      valueName?: string;
    }[];
    afterSaleStatus?: number;
  }

  export interface Payment {
    id: number;
    amount: number;
    paymentMethod: number;
    paymentMethodName?: string;
    payChannelCode?: string;
    status?: number;
    statusName?: string;
    paidAt: string;
    remark?: string;
    operatorName?: string;
  }

  export interface OrderLog {
    content?: string;
    createTime?: string;
    userType?: number;
    userId?: number;
  }

  export interface ExpressTrack {
    time?: string;
    content?: string;
  }

  export interface OrderDetail {
    id: number;
    no: string;
    quotationId: number;
    quotationNo?: string;
    userId: number;
    userName?: string;
    status: number;
    statusName: string;
    approvalStatus: number;
    approvalStatusName: string;
    payProgressStatus: number;
    payProgressStatusName: string;
    totalPrice: number;
    payPrice: number;
    paidPrice: number;
    currency: string;
    deliveryType?: number;
    incoterms?: string;
    paymentMethod?: number;
    contractNo?: string;
    logisticsId?: number;
    logisticsNo?: string;
    payTime?: string;
    deliveryTime?: string;
    receiveTime?: string;
    approvedAt?: string;
    rejectedAt?: string;
    createTime: string;
    updateTime?: string;
    remark?: string;
    items: OrderItem[];
    payments: Payment[];
    logs: OrderLog[];
  }

  export interface OrderPageItem {
    id: number;
    no: string;
    quotationNo: string;
    userId: number;
    userName?: string;
    status: number;
    statusName: string;
    approvalStatus: number;
    approvalStatusName: string;
    payProgressStatus: number;
    payProgressStatusName: string;
    totalPrice: number;
    payPrice: number;
    paidPrice: number;
    currency: string;
    createTime: string;
    deliveryType?: number;
    logisticsId?: number;
  }

  export interface OrderPageReqVO {
    status?: number;
    approvalStatus?: number;
    payProgressStatus?: number;
    no?: string;
    userId?: number;
  }

  export interface ManualPayReqVO {
    orderId: number;
    amount: number;
    paymentMethod: number;
    transactionId?: string;
    remark?: string;
  }
}

export function getOrderPage(params: B2BOrderApi.OrderPageReqVO & PageParam) {
  return requestClient.get<PageResult<B2BOrderApi.OrderPageItem>>(
    '/trade/b2b/order/page',
    { params },
  );
}

export function getOrder(id: number) {
  return requestClient.get<B2BOrderApi.OrderDetail>(
    `/trade/b2b/order/get?id=${id}`,
  );
}

export function approveOrder(id: number) {
  return requestClient.post(
    '/trade/b2b/order/approve',
    {},
    {
      params: { id },
    },
  );
}

export function rejectOrder(id: number, reason?: string) {
  return requestClient.post(
    '/trade/b2b/order/reject',
    {},
    {
      params: { id, reason },
    },
  );
}

export function manualPayOrder(data: B2BOrderApi.ManualPayReqVO) {
  return requestClient.post('/trade/b2b/order/payment/create', data);
}

export function getPaymentListByOrderId(orderId: number) {
  return requestClient.get<B2BOrderApi.Payment[]>(
    '/trade/b2b/order/payment/list-by-order',
    { params: { orderId } },
  );
}

export function getExpressTrackList(id: number) {
  return requestClient.get<B2BOrderApi.ExpressTrack[]>(
    `/trade/b2b/order/get-express-track-list?id=${id}`,
  );
}
