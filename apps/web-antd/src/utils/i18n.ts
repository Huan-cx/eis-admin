import type { TranslationItem } from '#/components/i18n-editor/I18nEditor.vue';
import { message } from 'ant-design-vue';
import { $t } from '#/locales';

export async function handleI18nSave<T>(
  entityId: number | undefined,
  data: TranslationItem[],
  saveApi: (id: number, data: T[]) => Promise<void>,
): Promise<void> {
  if (!entityId) return;

  try {
    await saveApi(entityId, data as unknown as T[]);
    message.success($t('ui.actionMessage.operationSuccess'));
  } catch {
    message.error($t('ui.actionMessage.operationFailed'));
  }
}
