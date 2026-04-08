import { requestClient } from '#/api/request';

export namespace MemberAddressApi {
  /** 收件地址信息 */
  export interface Address {
    id?: number; // 编号
    firstName: string; // 收件人名字
    lastName: string; // 收件人姓氏
    companyName?: string; // 公司名称
    address: string; // 地址
    city: string; // 城市
    state: string; // 州/省
    country: string; // 国家代码
    postcode: string; // 邮政编码
    email?: string; // 邮箱
    phone: string; // 电话
    street: string; // 街道地址
    vat?: string; // 增值税号
    eori?: string; // 经济经营者注册和识别号
    type?: number; // 地址类型
    defaultStatus: boolean; // 是否默认地址
  }
}

/** 查询用户收件地址列表 */
export function getAddressList(params: any) {
  return requestClient.get<MemberAddressApi.Address[]>('/member/address/list', {
    params,
  });
}

/** 获得用户收件地址 */
export function getAddress(id: number) {
  return requestClient.get<MemberAddressApi.Address>(`/app-api/member/address/get?id=${id}`);
}
