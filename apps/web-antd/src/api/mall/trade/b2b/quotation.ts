import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

export namespace B2BQuotationApi {
  export interface QuotationItem {
    id?: number;
    skuId: number;
    spuId: number;
    spuName: string;
    skuName: string;
    picUrl: string;
    count: number;
    supplierPrice: number;
    totalPrice: number;
    properties?: string;
    supplierId?: number;
    supplierName?: string;
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
    validDays?: number;
    validUntil?: number;
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
    createdAt: string;
  }

  export interface CreateQuotationReqVO {
    id?: number;
    rfqId: number;
    supplierId: number;
    supplierName: string;
    items: {
      count: number;
      picUrl: string;
      properties?: string;
      skuId: number;
      skuName: string;
      spuId: number;
      spuName: string;
      supplierId?: number;
      supplierName?: string;
      supplierPrice: number;
      totalPrice?: number;
    }[];
    feeItems?: {
      amount: number;
      description?: string;
      feeName: string;
      feeType: string;
      optional?: boolean;
    }[];
    currency?: string;
    validDays?: number;
    remark?: string;
  }

  export interface QuotationPageReqVO {
    status?: number;
    supplierId?: number;
  }

  // ==================== 比价相关类型 ====================

  export interface CompareQuotationBase {
    quotationId: number;
    supplierId: number;
    supplierName: string;
    currency?: string;
    totalPrice?: number;
    remark?: string;
    validUntil?: string;
    createdAt: string;
  }

  export interface CompareSkuItem {
    skuId: number;
    spuId: number;
    spuName: string;
    skuName: string;
    picUrl: string;
    inquiryCount: number;
    quotationPrices: Record<number, QuotationItemPrice>;
    selectedQuotationId?: number;
  }

  export interface QuotationItemPrice {
    count: number;
    supplierPrice: number;
    sellingPrice: number;
    totalPrice: number;
    remark?: string;
  }

  export interface CompareResult {
    rfqId: number;
    rfqRemark?: string;
    skuItems: CompareSkuItem[];
    quotations: CompareQuotationBase[];
    savedTerms?: SavedTerms;
  }

  export interface SavedTerms {
    currency?: string;
    incoterms?: string;
    deliveryType?: number;
    deliveryPort?: string;
    validDays?: number;
    feeItems?: FeeItem[];
    productionRatio?: number;
    preDelvRatio?: number;
    postDelvRatio?: number;
  }

  export interface ItemSelect {
    skuId: number;
    quotationId: number;
    sellingPrice?: number;
    remark?: string;
  }

  export interface SelectQuotationItemsReqVO {
    rfqId: number;
    items: ItemSelect[];
    currency?: string;
    incoterms?: string;
    deliveryType?: number;
    deliveryPort?: string;
    validDays?: number;
    feeItems?: FeeItem[];
    productionRatio?: number;
    preDelvRatio?: number;
    postDelvRatio?: number;
  }

  export interface QuotationSelectionDO {
    id: number;
    rfqId: number;
    status: number;
    items: ItemSelect[];
    createdAt: string;
  }
}

export function getQuotationPage(
  params: B2BQuotationApi.QuotationPageReqVO & PageParam,
) {
  return requestClient.get<PageResult<B2BQuotationApi.QuotationPageItem>>(
    '/trade/b2b/quotation/page',
    { params },
  );
}

export function getQuotation(id: number) {
  return requestClient.get<B2BQuotationApi.QuotationDetail>(
    '/trade/b2b/quotation/get',
    { params: { id } },
  );
}

export function createQuotation(data: B2BQuotationApi.CreateQuotationReqVO) {
  return requestClient.post<B2BQuotationApi.QuotationDetail>(
    '/trade/b2b/quotation/create',
    data,
  );
}

export function updateQuotation(
  id: number,
  data: B2BQuotationApi.CreateQuotationReqVO,
) {
  return requestClient.post<B2BQuotationApi.QuotationDetail>(
    '/trade/b2b/quotation/update',
    { ...data, id },
  );
}

export function acceptQuotation(id: number) {
  return requestClient.post(
    '/trade/b2b/quotation/accept',
    {},
    {
      params: { id },
    },
  );
}

export function rejectQuotation(id: number) {
  return requestClient.post(
    '/trade/b2b/quotation/reject',
    {},
    {
      params: { id },
    },
  );
}

// ==================== 报价审核相关 ====================

export function submitQuotationForReview(id: number) {
  return requestClient.post(
    '/trade/b2b/quotation/submit-review',
    {},
    {
      params: { id },
    },
  );
}

export function approveQuotation(id: number, remark?: string) {
  return requestClient.post('/trade/b2b/quotation/approve', { id, remark });
}

export function rejectQuotationByAdmin(id: number, remark?: string) {
  return requestClient.post(
    '/trade/b2b/quotation/reject',
    {},
    {
      params: { id, remark },
    },
  );
}

// ==================== 比价相关 ====================

export function compareQuotations(rfqId: number) {
  return requestClient.get<B2BQuotationApi.CompareResult>(
    '/trade/b2b/quotation/compare',
    { params: { rfqId } },
  );
}

export function selectQuotationItems(
  data: B2BQuotationApi.SelectQuotationItemsReqVO,
) {
  return requestClient.post<number>('/trade/b2b/quotation/select-items', data);
}

export function confirmQuotationSelection(rfqId: number) {
  return requestClient.post<number>(
    '/trade/b2b/quotation/confirm-selection',
    {},
    {
      params: { rfqId },
    },
  );
}

// ==================== 最终报价相关（客户视角） ====================

export interface FinalQuotationItem {
  skuId: number;
  spuId?: number;
  spuName?: string;
  skuName?: string;
  picUrl?: string;
  count: number;
  sellingPrice: number;
  totalPrice: number;
  remark?: string;
}

export interface FinalQuotationResult {
  rfqId: number;
  rfqNo?: string;
  statusName?: string;
  totalPrice: number;
  currency?: string;
  incoterms?: string;
  deliveryPort?: string;
  validUntil?: string;
  confirmedAt?: string;
  productionRatio?: number;
  preDelvRatio?: number;
  postDelvRatio?: number;
  items: FinalQuotationItem[];
}

export function getFinalQuotation(rfqId: number) {
  return requestClient.get<FinalQuotationResult>(
    '/trade/b2b/quotation/get-final',
    { params: { rfqId } },
  );
}

// ==================== 供应商下拉选择 ====================

export function getSimpleSupplierList() {
  return requestClient.get<Array<{ id: number; name: string }>>(
    '/product/supplier/list-all-simple',
  );
}
