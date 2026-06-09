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
    properties?: string;
  }

  export interface OrderDetail {
    id: number;
    no: string;
    quotationId: number;
    quotationNo: string;
    userId: number;
    userName?: string;
    status: number;
    statusName: string;
    totalPrice: number;
    currency: string;
    deliveryType?: number;
    incoterms?: string;
    remark?: string;
    addressId?: number;
    addressName?: string;
    addressPhone?: string;
    addressDetail?: string;
    approvedAt?: string;
    rejectedAt?: string;
    createdAt: string;
    updatedAt?: string;
    items: OrderItem[];
  }

  export interface OrderPageItem {
    id: number;
    no: string;
    quotationNo: string;
    userId: number;
    userName?: string;
    status: number;
    statusName: string;
    totalPrice: number;
    currency: string;
    createdAt: string;
  }

  export interface OrderPageReqVO {
    status?: number;
  }
}

export function getOrderPage(
  params: PageParam & B2BOrderApi.OrderPageReqVO,
) {
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
  return requestClient.post('/trade/b2b/order/approve', {}, {
    params: { id },
  });
}

export function rejectOrder(id: number) {
  return requestClient.post('/trade/b2b/order/reject', {}, {
    params: { id },
  });
}
