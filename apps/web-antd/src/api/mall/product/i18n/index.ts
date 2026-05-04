import { requestClient } from '#/api/request';

export namespace MallI18nApi {
  export interface TranslationItem {
    locale: string;
    [key: string]: string | undefined;
  }
}

export function getSpuI18nList(spuId: number) {
  return requestClient.get<MallI18nApi.TranslationItem[]>(
    `/i18n/product/spu/${spuId}`,
  );
}

export function saveSpuI18n(
  spuId: number,
  data: MallI18nApi.TranslationItem[],
) {
  return requestClient.post(`/i18n/product/spu/${spuId}`, data);
}

export function deleteSpuI18n(spuId: number, locale: string) {
  return requestClient.delete(`/i18n/product/spu/${spuId}`, {
    params: { locale },
  });
}

export function getBrandI18nList(brandId: number) {
  return requestClient.get<MallI18nApi.TranslationItem[]>(
    `/i18n/product/brand/${brandId}`,
  );
}

export function saveBrandI18n(
  brandId: number,
  data: MallI18nApi.TranslationItem[],
) {
  return requestClient.post(`/i18n/product/brand/${brandId}`, data);
}

export function deleteBrandI18n(brandId: number, locale: string) {
  return requestClient.delete(`/i18n/product/brand/${brandId}`, {
    params: { locale },
  });
}

export function getCategoryI18nList(categoryId: number) {
  return requestClient.get<MallI18nApi.TranslationItem[]>(
    `/i18n/product/category/${categoryId}`,
  );
}

export function saveCategoryI18n(
  categoryId: number,
  data: MallI18nApi.TranslationItem[],
) {
  return requestClient.post(`/i18n/product/category/${categoryId}`, data);
}

export function deleteCategoryI18n(categoryId: number, locale: string) {
  return requestClient.delete(`/i18n/product/category/${categoryId}`, {
    params: { locale },
  });
}

export function getPropertyI18nList(propertyId: number) {
  return requestClient.get<MallI18nApi.TranslationItem[]>(
    `/i18n/product/property/${propertyId}`,
  );
}

export function savePropertyI18n(
  propertyId: number,
  data: MallI18nApi.TranslationItem[],
) {
  return requestClient.post(`/i18n/product/property/${propertyId}`, data);
}

export function deletePropertyI18n(propertyId: number, locale: string) {
  return requestClient.delete(`/i18n/product/property/${propertyId}`, {
    params: { locale },
  });
}

export function getPropertyValueI18nList(propertyValueId: number) {
  return requestClient.get<MallI18nApi.TranslationItem[]>(
    `/i18n/product/property-value/${propertyValueId}`,
  );
}

export function savePropertyValueI18n(
  propertyValueId: number,
  data: MallI18nApi.TranslationItem[],
) {
  return requestClient.post(
    `/i18n/product/property-value/${propertyValueId}`,
    data,
  );
}

export function deletePropertyValueI18n(
  propertyValueId: number,
  locale: string,
) {
  return requestClient.delete(
    `/i18n/product/property-value/${propertyValueId}`,
    { params: { locale } },
  );
}
