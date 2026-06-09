export interface RfqItem {
  skuId: number;
  productId: number;
  productName: string;
  skuName: string;
  imageUrl: string;
  count: number;
  expectedPrice: number;
  specifications?: string;
  unit?: string;
  brand?: string;
}

export interface RfqDetail {
  id: number;
  no: string;
  userId: number;
  enterpriseId?: number;
  status: number;
  statusName: string;
  requirement?: string;
  validUntil?: string;
  supplierId?: number;
  supplierName?: string;
  addressId?: number;
  submittedAt?: string;
  createdAt: string;
  items: RfqItem[];
}

export interface RfqPageItem {
  id: number;
  no: string;
  userId: number;
  status: number;
  statusName: string;
  supplierName?: string;
  submittedAt?: string;
  createdAt: string;
  itemCount: number;
}
