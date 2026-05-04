import { requestClient } from '#/api/request';

export namespace TranslateTaskApi {
  export interface TranslateTaskCreateReqVO {
    translateType:
      | 'ALL'
      | 'ARTICLE'
      | 'BRAND'
      | 'CATEGORY'
      | 'PRODUCT'
      | 'PROPERTY';
    targetLanguages: string[];
    provider: 'alibaba' | 'google' | 'tencent';
    overwrite?: boolean;
    batchSize?: number;
    async?: boolean;
  }

  export interface TranslateTaskRespVO {
    taskId: number;
    translateType: string;
    targetLanguage: string;
    status: 'COMPLETED' | 'FAILED' | 'PENDING' | 'RUNNING' | 'NOT_FOUND';
    totalCount: number;
    translatedCount: number;
    skippedCount: number;
    failedCount: number;
    startTime?: string;
    endTime?: string;
    errorMessage?: string;
    progress: number;
  }

  export interface TranslateTypeOption {
    value: string;
    label: string;
  }
}

export function createTranslateTask(
  data: TranslateTaskApi.TranslateTaskCreateReqVO,
) {
  return requestClient.post<number>('/translate-task/create', data);
}

export function executeTranslateTaskSync(
  data: TranslateTaskApi.TranslateTaskCreateReqVO,
) {
  return requestClient.post<TranslateTaskApi.TranslateTaskRespVO>(
    '/translate-task/execute-sync',
    data,
  );
}

export function cancelTranslateTask(taskId: number) {
  return requestClient.post('/translate-task/cancel', null, {
    params: { taskId },
  });
}

export function getTranslateTaskStatus(taskId: number) {
  return requestClient.get<TranslateTaskApi.TranslateTaskRespVO>(
    '/translate-task/status',
    { params: { taskId } },
  );
}

export function getTranslateTaskList() {
  return requestClient.get<TranslateTaskApi.TranslateTaskRespVO[]>(
    '/translate-task/list',
  );
}

export function getTranslateTypes() {
  return requestClient.get<TranslateTaskApi.TranslateTypeOption[]>(
    '/translate-task/types',
  );
}

export function getTranslateProviders() {
  return requestClient.get<string[]>('/translate-task/providers');
}

export function deleteTranslateTask(taskId: number) {
  return requestClient.delete('/translate-task/delete', {
    params: { taskId },
  });
}
