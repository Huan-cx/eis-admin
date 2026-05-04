import { requestClient } from '#/api/request';

export namespace MallLanguageApi {
  export interface Language {
    id?: number;
    code: string;
    name: string;
    nativeName?: string;
    flag?: string;
    isDefault?: boolean;
    status?: number;
    sort?: number;
    createTime?: Date;
  }

  export interface LanguageSaveReqVO {
    id?: number;
    code: string;
    name: string;
    nativeName?: string;
    flag?: string;
    isDefault?: boolean;
    status: number;
    sort?: number;
  }
}

export function getLanguageList() {
  return requestClient.get<MallLanguageApi.Language[]>('/i18n/language/list');
}

export function getLanguage(id: number) {
  return requestClient.get<MallLanguageApi.Language>(
    `/i18n/language/get?id=${id}`,
  );
}

export function createLanguage(data: MallLanguageApi.LanguageSaveReqVO) {
  return requestClient.post('/i18n/language/create', data);
}

export function updateLanguage(data: MallLanguageApi.LanguageSaveReqVO) {
  return requestClient.put('/i18n/language/update', data);
}

export function deleteLanguage(id: number) {
  return requestClient.delete(`/i18n/language/delete?id=${id}`);
}

export function updateLanguageStatus(id: number, status: number) {
  return requestClient.put(
    `/i18n/language/update-status?id=${id}&status=${status}`,
  );
}

export function setDefaultLanguage(id: number) {
  return requestClient.put(`/i18n/language/update-default?id=${id}`);
}
