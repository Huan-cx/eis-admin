import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

export namespace B2BRfqApi {
  export interface RfqItem {
    id: number;
    skuId: number;
    spuName: string;
    productId: number;
    productName: string;
    skuName: string;
    imageUrl: string;
    count: number;
    expectedPrice: number;
    specifications?: string;
    unit?: string;
    brand?: string;
    properties?: string;
  }

  export interface RfqDetail {
    id: number;
    no: string;
    userId: number;
    userName?: string;
    enterpriseId?: number;
    status: number;
    statusName: string;
    requirement?: string;
    validUntil?: string;
    supplierId?: number;
    supplierName?: string;
    deliveryPort?: string;
    addressId?: number;
    submittedAt?: string;
    createdAt: string;
    updatedAt?: string;
    items: RfqItem[];
    hasFinalQuotation?: boolean;
  }

  export interface RfqPageItem {
    items: RfqItem[] | undefined;
    id: number;
    no: string;
    userId: number;
    userName?: string;
    status: number;
    statusName: string;
    supplierId?: number;
    supplierName?: string;
    itemCount: number;
    incoterms?: string;
    deliveryPort?: string;
    expectedDeliveryDate?: string;
    contactName?: string;
    email?: string;
    submittedAt?: string;
    createdAt: string;
    hasFinalQuotation?: boolean;
  }

  export interface AssignSupplierReqVO {
    id: number;
    supplierId: number;
    supplierName: string;
  }

  export interface RfqPageReqVO {
    status?: number;
    supplierId?: number;
    contactName?: string;
    email?: string;
  }
}

export function getRfqPage(params: B2BRfqApi.RfqPageReqVO & PageParam) {
  return requestClient.get<PageResult<B2BRfqApi.RfqPageItem>>(
    '/trade/b2b/rfq/page',
    { params },
  );
}

export function getRfq(id: number) {
  return requestClient.get<B2BRfqApi.RfqDetail>(`/trade/b2b/rfq/get?id=${id}`);
}

export function assignSupplier(data: B2BRfqApi.AssignSupplierReqVO) {
  return requestClient.post(
    '/trade/b2b/rfq/assign-supplier',
    {},
    {
      params: data,
    },
  );
}
