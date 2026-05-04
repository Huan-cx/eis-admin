<script lang="ts" setup>
import type { MallLanguageApi } from '#/api/mall/product/language';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import {
  createLanguage,
  getLanguage,
  updateLanguage,
} from '#/api/mall/product/language';
import { PREDEFINED_LANGUAGES } from '#/components/i18n-editor/typing';
import { $t } from '#/locales';

const emit = defineEmits(['success']);
const formData = ref<MallLanguageApi.Language>();
const getTitle = computed(() => {
  return formData.value?.id
    ? $t('ui.actionTitle.edit', [$t('language.title')])
    : $t('ui.actionTitle.create', [$t('language.title')]);
});

const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: { class: 'w-full' },
    formItemClass: 'col-span-2',
    labelWidth: 80,
  },
  layout: 'horizontal',
  schema: [
    {
      fieldName: 'id',
      component: 'Input',
      dependencies: { triggerFields: [''], show: () => false },
    },
    {
      fieldName: 'code',
      label: $t('language.code'),
      component: 'Select',
      componentProps: {
        placeholder: $t('ui.inputPlaceholder.select', [$t('language.code')]),
        options: PREDEFINED_LANGUAGES.map((lang) => ({
          label: `${lang.flag} ${lang.name} (${lang.code})`,
          value: lang.code,
        })),
        onChange: (value: string) => {
          const lang = PREDEFINED_LANGUAGES.find((l) => l.code === value);
          if (lang) {
            formApi.setValues({
              name: lang.name,
              nativeName: lang.nativeName,
              flag: lang.flag,
            });
          }
        },
      },
      rules: 'required',
    },
    {
      fieldName: 'name',
      label: $t('language.name'),
      component: 'Input',
      componentProps: {
        placeholder: $t('ui.inputPlaceholder.enter', [$t('language.name')]),
      },
      rules: 'required',
    },
    {
      fieldName: 'nativeName',
      label: $t('language.nativeName'),
      component: 'Input',
      componentProps: {
        placeholder: $t('ui.inputPlaceholder.enter', [
          $t('language.nativeName'),
        ]),
      },
    },
    {
      fieldName: 'flag',
      label: $t('language.flag'),
      component: 'Input',
      componentProps: {
        placeholder: $t('ui.inputPlaceholder.enter', [$t('language.flag')]),
      },
    },
    {
      fieldName: 'isDefault',
      label: $t('language.isDefault'),
      component: 'RadioGroup',
      componentProps: {
        options: [
          { label: $t('common.yes'), value: true },
          { label: $t('common.no'), value: false },
        ],
        buttonStyle: 'solid',
        optionType: 'button',
      },
      rules: 'required',
      defaultValue: false,
    },
    {
      fieldName: 'status',
      label: $t('common.status'),
      component: 'RadioGroup',
      componentProps: {
        options: [
          { label: $t('common.enable'), value: 1 },
          { label: $t('common.disable'), value: 0 },
        ],
        buttonStyle: 'solid',
        optionType: 'button',
      },
      rules: 'required',
      defaultValue: 1,
    },
    {
      fieldName: 'sort',
      label: $t('common.sort'),
      component: 'InputNumber',
      componentProps: {
        min: 0,
        max: 999,
        placeholder: $t('ui.inputPlaceholder.enter', [$t('common.sort')]),
      },
      defaultValue: 0,
    },
  ],
  showDefaultActions: false,
});

const [Modal, modalApi] = useVbenModal({
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) return;
    modalApi.lock();
    const data =
      (await formApi.getValues()) as MallLanguageApi.LanguageSaveReqVO;
    try {
      await (formData.value?.id ? updateLanguage(data) : createLanguage(data));
      await modalApi.close();
      emit('success');
      message.success($t('ui.actionMessage.operationSuccess'));
    } finally {
      modalApi.unlock();
    }
  },
  async onOpenChange(isOpen: boolean) {
    if (!isOpen) {
      formData.value = undefined;
      return;
    }
    const data = modalApi.getData<MallLanguageApi.Language>();
    if (!data || !data.id) return;
    modalApi.lock();
    try {
      formData.value = await getLanguage(data.id);
      await formApi.setValues(formData.value);
    } finally {
      modalApi.unlock();
    }
  },
});

defineExpose({ modalApi });
</script>

<template>
  <Modal :title="getTitle" class="w-1/3">
    <Form class="mx-4" />
  </Modal>
</template>
