import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

export namespace B2BQuotationApi {
  export interface QuotationItem {
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

  export interface FeeItem {
    id?: number;
    feeType: string;
    feeName: string;
    amount: number;
    description?: string;
    optional?: boolean;
  }

  export interface QuotationDetail {
    id: number;
    no: string;
    rfqId: number;
    rfqNo: string;
    supplierId: number;
    supplierName: string;
    status: number;
    statusName: string;
    totalPrice: number;
    currency: string;
    deliveryType?: number;
    incoterms?: string;
    validDays?: number;
    validUntil?: string;
    remark?: string;
    acceptedAt?: string;
    createdAt: string;
    updatedAt?: string;
    items: QuotationItem[];
    feeItems?: FeeItem[];
  }

  export interface QuotationPageItem {
    items: QuotationItem[] | undefined;
    id: number;
    no: string;
    rfqId: number;
    rfqNo: string;
    supplierId: number;
    supplierName: string;
    status: number;
    statusName: string;
    totalPrice: number;
    currency: string;
    incoterms?: string;
    createdAt: string;
  }

  export interface CreateQuotationReqVO {
    rfqId: number;
    supplierId: number;
    supplierName: string;
    items: {
      skuId: number;
      spuId: number;
      spuName: string;
      skuName: string;
      picUrl: string;
      count: number;
      unitPrice: number;
      totalPrice?: number;
      properties?: string;
    }[];
    feeItems?: {
      feeType: string;
      feeName: string;
      amount: number;
      description?: string;
      optional?: boolean;
    }[];
    currency?: string;
    deliveryType?: number;
    incoterms?: string;
    validDays?: number;
    remark?: string;
  }

  export interface QuotationPageReqVO {
    status?: number;
    supplierId?: number;
  }
}

export function getQuotationPage(
  params: PageParam & B2BQuotationApi.QuotationPageReqVO,
) {
  return requestClient.get<PageResult<B2BQuotationApi.QuotationPageItem>>(
    '/trade/b2b/quotation/page',
    { params },
  );
}

export function getQuotation(id: number) {
  return requestClient.get<B2BQuotationApi.QuotationDetail>(
    `/trade/b2b/quotation/get?id=${id}`,
  );
}

export function createQuotation(data: B2BQuotationApi.CreateQuotationReqVO) {
  return requestClient.post('/trade/b2b/quotation/create', data);
}

export function acceptQuotation(id: number) {
  return requestClient.post('/trade/b2b/quotation/accept', {}, {
    params: { id },
  });
}

export function rejectQuotation(id: number) {
  return requestClient.post('/trade/b2b/quotation/reject', {}, {
    params: { id },
  });
}
