import type {PageParam, PageResult} from '@vben/request';

import {requestClient} from '#/api/request';

/** ThemeCustomization 类型枚举（Banner 独立由 PromotionBanner 管理） */
export const THEME_CUSTOMIZATION_TYPE = {
  PRODUCT_CAROUSEL: 'product_carousel',
  CATEGORY_CAROUSEL: 'category_carousel',
  STATIC_CONTENT: 'static_content',
} as const;

export type ThemeCustomizationType =
  (typeof THEME_CUSTOMIZATION_TYPE)[keyof typeof THEME_CUSTOMIZATION_TYPE];

/** ThemeCustomization 详情（含翻译） */
export interface ThemeCustomizationTranslation {
  id: number;
  customizationId: number;
  locale: string;
  title?: string;
  subtitle?: string;
  content?: Record<string, unknown>;
}

export interface ThemeCustomization {
  id: number;
  pageCode: string;
  themeCode: string;
  type: ThemeCustomizationType;
  name: string;
  config: Record<string, unknown>;
  sort: number;
  status: number; // 0=开启, 1=关闭 (CommonStatusEnum)
  remark?: string;
  translations?: ThemeCustomizationTranslation[];
  createTime?: string;
}

/** ===== Admin API ===== */

/** 分页查询主题区块 */
export function getThemeCustomizationPage(params: PageParam & {
  pageCode?: string;
  themeCode?: string;
  type?: ThemeCustomizationType;
  name?: string;
  status?: number;
}) {
  return requestClient.get<PageResult<ThemeCustomization>>(
    '/promotion/theme-customization/page',
    {params},
  );
}

/** 查询主题区块详情（含 translations） */
export function getThemeCustomization(id: number) {
  return requestClient.get<ThemeCustomization>(
    `/promotion/theme-customization/get?id=${id}`,
  );
}

/** 新增主题区块 */
export function createThemeCustomization(data: Omit<ThemeCustomization, 'id' | 'createTime'>) {
  return requestClient.post('/promotion/theme-customization/create', data);
}

/** 修改主题区块 */
export function updateThemeCustomization(data: ThemeCustomization) {
  return requestClient.put('/promotion/theme-customization/update', data);
}

/** 删除主题区块 */
export function deleteThemeCustomization(id: number) {
  return requestClient.delete(`/promotion/theme-customization/delete?id=${id}`);
}

/** 批量排序：按数组下标赋连续 sort 值 */
export function batchUpdateThemeCustomizationSort(ids: number[]) {
  return requestClient.put('/promotion/theme-customization/batch-update-sort', {ids});
}
