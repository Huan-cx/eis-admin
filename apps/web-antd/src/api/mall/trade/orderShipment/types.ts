/**
 * 订单发货管理 API 类型定义
 */
export namespace OrderShipmentApi {
  /** 发货状态枚举 */
  export enum ShipmentStatus {
    /** 已取消 */
    CANCELED = 0,
    /** 已货好 */
    CARGO_READY = 30,
    /** 清关完成 */
    CUSTOMS_CLEARED = 70,
    /** 已收货 */
    DELIVERED = 80,
    /** 运输中 */
    IN_TRANSIT = 60,
    /** 待发货 */
    PENDING_SHIPMENT = 10,
    /** 验货失败 */
    QC_FAILED = 41,
    /** 验货通过 */
    QC_PASSED = 40,
    /** 已出货 */
    SHIPPED = 50,
    /** 生产中 */
    UNDER_PRODUCTION = 20,
  }

  /** 发货方式枚举 */
  export enum ShipmentType {
    /** 空运 */
    AIR = 3,
    /** 快递 */
    EXPRESS = 4,
    /** 海运整柜 */
    FCL = 1,
    /** 陆运 */
    LAND = 5,
    /** 海运拼箱 */
    LCL = 2,
  }

  /** 发货事件类型枚举 */
  export enum ShipmentEventType {
    /** 提单确认 */
    BL_CONFIRMED = 6002,
    /** 订舱确认 */
    BOOKING_CONFIRMED = 5001,
    /** 货物已装船 */
    CARGO_LOADED = 6001,
    /** 货物备好 */
    CARGO_READY = 3001,
    /** 自定义事件 */
    CUSTOM_EVENT = 9999,
    /** 客户签收 */
    CUSTOMER_SIGNED = 9002,
    /** 清关完成 */
    CUSTOMS_CLEARED = 8002,
    /** 生产进度更新 */
    PRODUCTION_PROGRESS = 2002,
    /** 验货失败 */
    QC_FAILED = 4003,
    /** 验货通过 */
    QC_PASSED = 4002,
    /** 达到发货条件 */
    REACHED_THRESHOLD = 1001,
    /** 发货取消 */
    SHIPMENT_CANCELED = 1,
    /** 开始清关 */
    START_CUSTOMS_CLEARANCE = 8001,
    /** 开始派送 */
    START_DELIVERY = 9001,
    /** 开始生产/备货 */
    START_PRODUCTION = 2001,
    /** 开始验货 */
    START_QC = 4001,
    /** 中途停靠 */
    TRANSIT_STOP = 7002,
    /** 拖柜安排 */
    TRUCKING_ARRANGED = 5002,
    /** 船舶到港 */
    VESSEL_ARRIVED = 7003,
    /** 船舶离港 */
    VESSEL_DEPARTED = 7001,
  }

  /** 分页查询参数 */
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

  /** 分页结果项 */
  export interface PageItem {
    id: number;
    orderId: number;
    orderNo: string;
    shipmentNo: string;
    status: number;
    statusName?: string;
    shipmentType?: number;
    shipmentTypeName?: string;
    loadingPort?: string;
    dischargePort?: string;
    carrier?: string;
    vesselFlight?: string;
    containerNo?: string;
    blNo?: string;
    etd?: string;
    eta?: string;
    atd?: string;
    ata?: string;
    totalCtns?: number;
    totalNw?: number;
    totalGw?: number;
    totalCbm?: number;
    remark?: string;
    creator?: string;
    createTime: string;
    updateTime?: string;
  }

  /** 分页结果 */
  export interface PageResult {
    list: PageItem[];
    total: number;
  }

  /** 发货明细项 */
  export interface ShipmentItem {
    id: number;
    shipmentId: number;
    orderItemId: number;
    skuId: number;
    skuCode?: string;
    productName?: string;
    productNameEn?: string;
    packagingWay?: string;
    pcsPerCtn?: number;
    quantity: number;
    ctns?: number;
    nwPerCtn?: number;
    gwPerCtn?: number;
    cbmPerCtn?: number;
    totalNw?: number;
    totalGw?: number;
    totalCbm?: number;
    unitPrice?: number;
    totalAmount?: number;
    remark?: string;
  }

  /** 发货单详情 */
  export interface Detail extends PageItem {
    items?: ShipmentItem[];
    events?: OrderShipmentEventApi.Detail[];
  }

  /** 更新发货单请求 */
  export interface UpdateRequest {
    id: number;
    shipmentType?: number;
    loadingPort?: string;
    dischargePort?: string;
    carrier?: string;
    vesselFlight?: string;
    containerNo?: string;
    blNo?: string;
    etd?: string;
    eta?: string;
    atd?: string;
    ata?: string;
    remark?: string;
  }

  /** 更新发货状态请求 */
  export interface UpdateStatusRequest {
    id: number;
    status: number;
    remark?: string;
  }

  /** 装箱清单计算结果 */
  export interface PackingListResult {
    orderId: number;
    orderNo: string;
    items: ShipmentItem[];
    totalCtns: number;
    totalNw: number;
    totalGw: number;
    totalCbm: number;
    totalAmount?: number;
  }
}

export namespace OrderShipmentEventApi {
  /** 创建事件请求 */
  export interface CreateRequest {
    shipmentId: number;
    eventType: number;
    eventTime: string;
    title: string;
    description?: string;
    attachments?: string;
  }

  /** 更新事件请求 */
  export interface UpdateRequest {
    id: number;
    eventType?: number;
    eventTime?: string;
    title?: string;
    description?: string;
    attachments?: string;
  }

  /** 事件详情 */
  export interface Detail {
    id: number;
    shipmentId: number;
    eventType: number;
    eventTypeName?: string;
    eventTime: string;
    title: string;
    description?: string;
    attachments?: string;
    attachmentList?: string[];
    operatorId?: number;
    operatorName?: string;
    createTime: string;
  }
}
