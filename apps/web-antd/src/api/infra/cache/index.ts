import { requestClient } from '#/api/request';

export namespace InfraCacheApi {
  export interface CacheInvalidateReqVO {
    cacheType?: string;
    cacheKeys?: string[];
    forceRefresh?: boolean;
    userType?: string;
  }
}

export function invalidateClientCache(
  data: InfraCacheApi.CacheInvalidateReqVO,
) {
  return requestClient.post('/infra/cache/invalidate', data);
}

export function invalidateAllClientCache() {
  return requestClient.post('/infra/cache/invalidate-all');
}

export function invalidateClientCacheByType(cacheType: string) {
  return requestClient.post(
    `/infra/cache/invalidate-by-type?cacheType=${cacheType}`,
  );
}
