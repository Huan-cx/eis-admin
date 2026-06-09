export interface QuotationItem {
  skuId: number;
  productId: number;
  productName: string;
  skuName: string;
  imageUrl: string;
  count: number;
  unitPrice: number;
  subtotalPrice: number;
}

export interface QuotationDetail {
  id: number;
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
  validUntil?: string;
  remark?: string;
  acceptedAt?: string;
  createdAt: string;
  items: QuotationItem[];
}

export interface QuotationPageItem {
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
