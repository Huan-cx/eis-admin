import { requestClient } from '#/api/request';

export namespace MallTranslateApi {
  export interface TranslateExecuteReqVO {
    provider?: string;
    textList: string[];
    targetLanguage: string;
  }

  export interface TranslateExecuteRespVO {
    results: string[];
    provider: string;
    targetLanguage: string;
  }
}

export function executeTranslate(data: MallTranslateApi.TranslateExecuteReqVO) {
  return requestClient.post<{
    provider: string;
    results: string[];
    targetLanguage: string;
  }>('/product/translate/execute', data);
}

export function getAvailableProviders() {
  return requestClient.get<string[]>('/product/translate/providers');
}

export * from './task';
