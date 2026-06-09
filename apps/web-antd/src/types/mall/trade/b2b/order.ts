export interface OrderItem {
  skuId: number;
  productId: number;
  productName: string;
  skuName: string;
  imageUrl: string;
  count: number;
  unitPrice: number;
  subtotalPrice: number;
}

export interface OrderDetail {
  id: number;
  no: string;
  rfqId: number;
  quotationId: number;
  userId: number;
  enterpriseId?: number;
  status: number;
  statusName: string;
  payStatus?: number;
  totalPrice: number;
  payPrice: number;
  currency: string;
  deliveryType?: number;
  incoterms?: string;
  addressId?: number;
  paymentMethod?: number;
  contractNo?: string;
  createdAt: string;
  items: OrderItem[];
}

export interface OrderPageItem {
  id: number;
  no: string;
  rfqId: number;
  quotationId: number;
  status: number;
  statusName: string;
  totalPrice: number;
  currency: string;
  createdAt: string;
}
