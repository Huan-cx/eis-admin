/**
 * 发货单事件 API 类型定义
 */
export namespace OrderShipmentEventApi {
  export interface CreateRequest {
    shipmentId: number;
    eventType: number;
    eventTime: number;
    title: string;
    description?: string;
    attachments?: string;
  }

  export interface UpdateRequest {
    id: number;
    eventType?: number;
    eventTime?: number;
    title?: string;
    description?: string;
    attachments?: string;
  }

  export interface Detail {
    id: number;
    shipmentId: number;
    eventType: number;
    eventTypeName?: string;
    eventTime: string | number;
    title: string;
    description?: string;
    attachments?: string;
    attachmentList?: string[];
    operatorId?: number;
    operatorName?: string;
    createTime: string | number;
  }
}

/**
 * 发货单管理 API 类型定义
 */
export namespace OrderShipmentApi {
  export enum ShipmentStatus {
    CANCELED = 0,
    CARGO_READY = 30,
    CUSTOMS_CLEARED = 70,
    DELIVERED = 80,
    IN_TRANSIT = 60,
    PENDING_SHIPMENT = 10,
    QC_FAILED = 41,
    QC_PASSED = 40,
    SHIPPED = 50,
    UNDER_PRODUCTION = 20,
  }

  export enum ShipmentType {
    AIR = 3,
    EXPRESS = 4,
    FCL = 1,
    LAND = 5,
    LCL = 2,
  }

  export enum ShipmentEventType {
    BL_CONFIRMED = 6002,
    BOOKING_CONFIRMED = 5001,
    CARGO_LOADED = 6001,
    CARGO_READY = 3001,
    CUSTOM_EVENT = 9999,
    CUSTOMER_SIGNED = 9002,
    CUSTOMS_CLEARED = 8002,
    ESTIMATED_ARRIVAL = 7004,
    ESTIMATED_DELIVERY = 9000,
    ESTIMATED_DEPARTURE = 7000,
    PRODUCTION_PROGRESS = 2002,
    QC_FAILED = 4003,
    QC_PASSED = 4002,
    REACHED_THRESHOLD = 1001,
    SHIPMENT_CANCELED = 1,
    START_CUSTOMS_CLEARANCE = 8001,
    START_DELIVERY = 9001,
    START_PRODUCTION = 2001,
    START_QC = 4001,
    TRANSIT_STOP = 7002,
    TRUCKING_ARRANGED = 5002,
    VESSEL_ARRIVED = 7003,
    VESSEL_DEPARTED = 7001,
  }

  export interface PageParams {
    pageNo?: number;
    pageSize?: number;
    orderNo?: string;
    shipmentNo?: string;
    status?: number;
    shipmentType?: number;
    loadingPort?: string;
    dischargePort?: string;
    createTime?: [string, string];
  }

  export interface PageItem {
    id: number;
    orderIds: number[];
    orderNos: string[];
    customerNames: string[];
    shipmentNo: string;
    status: number;
    statusName?: string;
    shipmentType?: number;
    shipmentTypeName?: string;
    loadingPort?: string;
    dischargePort?: string;
    carrier?: string;
    logisticsId?: number;
    logisticsName?: string;
    trackingNo?: string;
    vesselFlight?: string;
    containerNo?: string;
    blNo?: string;
    etd?: string;
    eta?: string;
    atd?: string;
    ata?: string;
    estimatedDeliveryDate?: string;
    finalDeliveryDate?: string;
    totalCtns?: number;
    totalNw?: number;
    totalGw?: number;
    totalCbm?: number;
    remark?: string;
    creator?: string;
    createTime: string;
    updateTime?: string;
  }

  export interface PageResult {
    list: PageItem[];
    total: number;
  }

  export interface ShipmentItem {
    id: number;
    shipmentId: number;
    orderItemId: number;
    skuId: number;
    skuCode?: string;
    spuName?: string;
    skuName?: string;
    hsCode?: string;
    packagingWay?: string;
    pcsPerCtn?: number;
    nwPerCtn?: number;
    gwPerCtn?: number;
    cbmPerCtn?: number;
    length?: number;
    width?: number;
    height?: number;
    unit?: string;
    count: number;
    ctns?: number;
    totalNw?: number;
    totalGw?: number;
    totalCbm?: number;
    price?: number;
    payPrice?: number;
    remark?: string;
  }

  export interface Detail extends PageItem {
    items?: ShipmentItem[];
    events?: OrderShipmentEventApi.Detail[];
  }

  export interface CreateRequest {
    orderIds: number[];
    shipmentType?: number;
    loadingPort?: string;
    dischargePort?: string;
    carrier?: string;
    logisticsId?: number;
    trackingNo?: string;
    vesselFlight?: string;
    containerNo?: string;
    blNo?: string;
    remark?: string;
  }

  export interface UpdateRequest {
    id: number;
    shipmentType?: number;
    loadingPort?: string;
    dischargePort?: string;
    carrier?: string;
    logisticsId?: number;
    trackingNo?: string;
    vesselFlight?: string;
    containerNo?: string;
    blNo?: string;
    totalCtns?: number;
    totalNw?: number;
    totalGw?: number;
    totalCbm?: number;
    remark?: string;
  }

  export interface UpdateStatusRequest {
    id: number;
    status: number;
    remark?: string;
  }

  export interface PackingListResult {
    orderId: number;
    orderNo: string;
    items: ShipmentItem[];
    totalCtns: number;
    totalNw: number;
    totalGw: number;
    totalCbm: number;
    totalPayPrice?: number;
  }

  export interface OrderSearchItem {
    id: number;
    no: string;
    customerName: string;
    totalAmount: number;
    status: number;
    statusName: string;
  }

  export interface UpdateItemsRequest {
    shipmentId: number;
    items: ShipmentItemUpdateRequest[];
  }

  export interface ShipmentItemUpdateRequest {
    orderItemId: number;
    hsCode?: string;
    packagingWay?: string;
    pcsPerCtn?: number;
    nwPerCtn?: number;
    gwPerCtn?: number;
    cbmPerCtn?: number;
    length?: number;
    width?: number;
    height?: number;
    unit?: string;
    ctns?: number;
    totalNw?: number;
    totalGw?: number;
    totalCbm?: number;
    remark?: string;
  }
}
