import { requestClient } from '#/api/request';

export namespace MallArticleI18nApi {
  export interface TranslationItem {
    locale: string;
    title?: string;
    introduction?: string;
    content?: string;
    metaTitle?: string;
    metaDescription?: string;
    slug?: string;
    [key: string]: string | undefined;
  }

  export interface CategoryTranslationItem {
    locale: string;
    name?: string;
    metaTitle?: string;
    metaDescription?: string;
    slug?: string;
    [key: string]: string | undefined;
  }
}

export function getArticleI18nList(articleId: number) {
  return requestClient.get<MallArticleI18nApi.TranslationItem[]>(
    `/i18n/article/${articleId}`,
  );
}

export function saveArticleI18n(
  articleId: number,
  data: MallArticleI18nApi.TranslationItem[],
) {
  return requestClient.post(`/i18n/article/${articleId}`, data);
}

export function deleteArticleI18n(articleId: number, locale: string) {
  return requestClient.delete(`/i18n/article/${articleId}`, {
    params: { locale },
  });
}

export function getArticleCategoryI18nList(categoryId: number) {
  return requestClient.get<MallArticleI18nApi.CategoryTranslationItem[]>(
    `/i18n/article-category/${categoryId}`,
  );
}

export function saveArticleCategoryI18n(
  categoryId: number,
  data: MallArticleI18nApi.CategoryTranslationItem[],
) {
  return requestClient.post(`/i18n/article-category/${categoryId}`, data);
}

export function deleteArticleCategoryI18n(categoryId: number, locale: string) {
  return requestClient.delete(`/i18n/article-category/${categoryId}`, {
    params: { locale },
  });
}
