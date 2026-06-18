import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

export namespace MallSupplierApi {
  /** 供应商 */
  export interface Supplier {
    id?: number; // 供应商编号
    cufCode?: string; // 供应商编号
    name: string; // 供应商公司名称
    category?: string; // 供应商类别
    address?: string; // 供应商地址
    postalCode?: string; // 邮政编码
    country?: string; // 国家
    province?: string; // 省份
    portOfLoading?: string; // 发货港口
    contactPerson?: string; // 联系人
    contactPosition?: string; // 联系人职位
    contactPhone?: string; // 联系人电话
    contactEmail?: string; // 联系人邮箱
    companyEmail?: string; // 公司邮箱
    remark?: string; // 备注
    sort?: number; // 排序
    status: number; // 状态：0-禁用，1-启用
  }
}

/** 创建供应商 */
export function createSupplier(data: MallSupplierApi.Supplier) {
  return requestClient.post('/product/supplier/create', data);
}

/** 更新供应商 */
export function updateSupplier(data: MallSupplierApi.Supplier) {
  return requestClient.put('/product/supplier/update', data);
}

/** 删除供应商 */
export function deleteSupplier(id: number) {
  return requestClient.delete(`/product/supplier/delete?id=${id}`);
}

/** 获得供应商 */
export function getSupplier(id: number) {
  return requestClient.get<MallSupplierApi.Supplier>(`/product/supplier/get?id=${id}`);
}

/** 获得供应商分页 */
export function getSupplierPage(params: PageParam) {
  return requestClient.get<PageResult<MallSupplierApi.Supplier>>(
    '/product/supplier/page',
    {
      params,
    },
  );
}

/** 获得供应商精简信息列表 */
export function getSimpleSupplierList() {
  return requestClient.get<MallSupplierApi.Supplier[]>(
    '/product/supplier/list-all-simple',
  );
}
