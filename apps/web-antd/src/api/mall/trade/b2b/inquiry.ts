import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

export namespace B2BInquiryApi {
  /** 采购询价详情 */
  export interface InquiryDetail {
    id: number;
    no: string;
    userId?: number;
    userName?: string;
    email: string;
    company: string;
    country: string;
    budgetAmount: number;
    budgetCurrency: string;
    description: string;
    status: number;
    statusName: string;
    handleRemark?: string;
    createTime?: string;
    // ===== 广告来源归因（来自 marketing_attribution 表） =====
    adPlatform?: string;
    adClickId?: string;
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
    landingPage?: string;
    capturedAt?: string;
  }

  /** 采购询价列表项 */
  export interface InquiryPageItem extends InquiryDetail {}

  /** 采购询价分页请求 */
  export interface InquiryPageReqVO {
    email?: string;
    company?: string;
    country?: string;
    status?: number;
  }

  /** 处理采购询价请求 */
  export interface UpdateStatusReqVO {
    id: number;
    status: number;
    handleRemark?: string;
  }
}

/** 获取采购询价分页 */
export function getInquiryPage(
  params: B2BInquiryApi.InquiryPageReqVO & PageParam,
) {
  return requestClient.get<PageResult<B2BInquiryApi.InquiryPageItem>>(
    '/trade/b2b/inquiry/page',
    { params },
  );
}

/** 获取采购询价详情 */
export function getInquiry(id: number) {
  return requestClient.get<B2BInquiryApi.InquiryDetail>(
    `/trade/b2b/inquiry/get?id=${id}`,
  );
}

/** 处理采购询价（更新状态与备注） */
export function updateInquiryStatus(data: B2BInquiryApi.UpdateStatusReqVO) {
  return requestClient.put('/trade/b2b/inquiry/update-status', data);
}

/** 删除采购询价 */
export function deleteInquiry(id: number) {
  return requestClient.delete(`/trade/b2b/inquiry/delete?id=${id}`);
}
