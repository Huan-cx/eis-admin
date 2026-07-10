<script lang="ts" setup>
import type { LanguageOption } from './typing';

import { reactive, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import {
  Form as AntForm,
  FormItem as AntFormItem,
  Input,
  message,
  Spin,
  TabPane,
  Tabs,
} from 'ant-design-vue';

import { getLanguageList } from '#/api/mall/product/language';
import { Tinymce as RichTextarea } from '#/components/tinymce';
import { $t } from '#/locales';

import { PREDEFINED_LANGUAGES } from './typing';

defineOptions({ name: 'I18nEditor' });

const props = withDefaults(defineProps<I18nEditorProps>(), {
  title: '多语言编辑',
  defaultData: () => ({}),
  initialData: () => [],
});

const emit = defineEmits<{
  (e: 'save', data: TranslationItem[]): void;
  (e: 'close'): void;
}>();

export interface FieldConfig {
  key: string;
  label: string;
  type: 'input' | 'richText' | 'textarea';
  placeholder?: string;
}

export interface TranslationItem {
  locale: string;
  [key: string]: string | undefined;
}

export interface I18nEditorProps {
  title?: string;
  entityId: number | string;
  fields: FieldConfig[];
  defaultData?: Record<string, string>;
  initialData?: TranslationItem[];
  saveApi: (
    entityId: number | string,
    data: TranslationItem[],
  ) => Promise<void>;
}

const [Modal, modalApi] = useVbenModal({
  title: props.title ?? '',
  async onConfirm() {
    await handleConfirm();
  },
  async onOpenChange(isOpen: boolean) {
    if (!isOpen) {
      emit('close');
      return;
    }
    await loadData();
  },
});

const loading = ref(false);
const languages = ref<LanguageOption[]>([]);
const activeTabKey = ref<string>('');
const translations = reactive<Record<string, Record<string, string>>>({});
const autoFilledFields = ref<Set<string>>(new Set());

function initTranslations() {
  languages.value.forEach((lang) => {
    const langCode = lang.code;
    if (!translations[langCode]) {
      translations[langCode] = {};
    }
    props.fields.forEach((field) => {
      if (translations[langCode]?.[field.key] === undefined) {
        translations[langCode] ??= {};
        translations[langCode][field.key] =
          props.defaultData?.[field.key] ?? '';
      }
    });
  });
}

function resetTranslations() {
  Object.keys(translations).forEach((key) => {
    delete translations[key];
  });
  autoFilledFields.value = new Set();
  languages.value = [];
  activeTabKey.value = '';
}

async function loadData() {
  loading.value = true;
  try {
    await initLanguages();
    initTranslations();
    applyInitialData();
    activeTabKey.value = languages.value[0]?.code || '';
  } finally {
    loading.value = false;
  }
}

async function initLanguages() {
  const backendLanguages = await getLanguageList();
  const enabledCodes = new Set(
    backendLanguages
      .filter((lang) => lang.status === 1 && lang.isDefault !== true)
      .map((lang) => lang.code),
  );
  languages.value = PREDEFINED_LANGUAGES.filter((lang) =>
    enabledCodes.has(lang.code),
  );
}

function applyInitialData() {
  if (!props.initialData?.length) return;

  props.initialData.forEach((item) => {
    const langCode = item.locale;
    if (!translations[langCode]) return;

    props.fields.forEach((field) => {
      const value = item[field.key];
      if (value !== undefined) {
        translations[langCode] ??= {};
        translations[langCode][field.key] = String(value);
      }
    });
  });
}

function isAutoFilled(langCode: string, fieldKey: string): boolean {
  return autoFilledFields.value.has(`${langCode}-${fieldKey}`);
}

async function handleConfirm() {
  const data: TranslationItem[] = [];

  Object.keys(translations).forEach((langCode) => {
    const item: TranslationItem = { locale: langCode };
    let hasValue = false;

    props.fields.forEach((field) => {
      const value = translations[langCode]?.[field.key];
      if (value) {
        item[field.key] = value;
        hasValue = true;
      }
    });

    if (hasValue) {
      data.push(item);
    }
  });

  try {
    await props.saveApi(props.entityId, data);
    message.success($t('ui.actionMessage.operationSuccess'));
    resetTranslations();
    await modalApi.close();
  } catch {
    message.error($t('ui.actionMessage.operationFailed'));
  }
}

defineExpose({ modalApi });
</script>

<template>
  <Modal class="w-2/5">
    <Spin v-if="loading" :tip="$t('common.loading')">
      <div class="py-20"></div>
    </Spin>

    <div
      v-else-if="languages.length === 0"
      class="py-10 text-center text-gray-400"
    >
      {{ $t('mall-product.i18n.noLanguages') }}
    </div>

    <template v-else>
      <!--      <div class="mb-4 flex justify-end">
        <AutoTranslateButton
          :current-language="activeTabKey"
          :current-fields="fields.map((f) => f.key)"
          :current-translations="currentTranslations"
          @translate="handleAutoTranslate"
        />
      </div>-->

      <Tabs v-model:active-key="activeTabKey" type="card">
        <TabPane
          v-for="lang in languages"
          :key="lang.code"
          :tab="`${lang.flag} ${lang.name}`"
        >
          <AntForm layout="vertical">
            <AntFormItem
              v-for="field in fields"
              :key="field.key"
              :label="field.label"
            >
              <div class="relative">
                <RichTextarea
                  v-if="field.type === 'richText'"
                  v-model="translations[lang.code]![field.key]"
                  :height="400"
                />
                <Input.TextArea
                  v-else-if="field.type === 'textarea'"
                  v-model:value="translations[lang.code]![field.key]"
                  :placeholder="field.placeholder"
                  :rows="4"
                />
                <Input
                  v-else
                  v-model:value="translations[lang.code]![field.key]"
                  :placeholder="field.placeholder"
                />
                <span
                  v-if="isAutoFilled(lang.code, field.key)"
                  class="absolute right-2 top-2 rounded bg-yellow-100 px-2 py-0.5 text-xs text-yellow-700"
                >
                  AI {{ $t('translate.autoFilled') }}
                </span>
              </div>
            </AntFormItem>
          </AntForm>
        </TabPane>
      </Tabs>
    </template>
  </Modal>
</template>
