<script lang="ts" setup>
import type { MallCategoryApi } from '#/api/mall/product/category';
import type { MallI18nApi } from '#/api/mall/product/i18n';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { Button, message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import {
  createCategory,
  getCategory,
  updateCategory,
} from '#/api/mall/product/category';
import { getCategoryI18nList, saveCategoryI18n } from '#/api/mall/product/i18n';
import I18nEditor from '#/components/i18n-editor/I18nEditor.vue';
import { $t } from '#/locales';

import { useFormSchema } from '../data';

const emit = defineEmits(['success']);

const formData = ref<MallCategoryApi.Category>();
const i18nData = ref<MallI18nApi.TranslationItem[]>([]);
const i18nEditorRef = ref<InstanceType<typeof I18nEditor>>();

async function loadI18nData() {
  if (!formData.value?.id) {
    i18nData.value = [];
    return;
  }
  try {
    i18nData.value = await getCategoryI18nList(formData.value.id);
  } catch (error) {
    console.error('加载国际化数据失败:', error);
    i18nData.value = [];
  }
}

function openI18nEditor() {
  loadI18nData().then(() => {
    i18nEditorRef.value?.modalApi.open();
  });
}

const getTitle = computed(() => {
  return formData.value?.id
    ? $t('ui.actionTitle.edit', [$t('mall-product.category.title')])
    : $t('ui.actionTitle.create', [$t('mall-product.category.title')]);
});

const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 100,
  },
  schema: useFormSchema(),
  showDefaultActions: false,
});

const [Modal, modalApi] = useVbenModal({
  title: getTitle.value ?? '',
  async onConfirm() {
    modalApi.lock();
    try {
      const data = await formApi.getValues();
      await (formData.value?.id
        ? updateCategory(data as MallCategoryApi.Category)
        : createCategory(data as MallCategoryApi.Category));
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
    const data = modalApi.getData<MallCategoryApi.Category>();
    if (!data || !data.id) {
      return;
    }
    modalApi.lock();
    try {
      formData.value = await getCategory(data.id);
      await formApi.setValues(formData.value);
    } finally {
      modalApi.unlock();
    }
  },
});
</script>

<template>
  <Modal :title="getTitle" class="w-1/4">
    <div v-if="formData?.id" class="mb-4">
      <Button type="default" @click="openI18nEditor">
        {{ $t('mall-product.i18n.title') }}
      </Button>
    </div>
    <Form class="mx-4" />
  </Modal>

  <I18nEditor
    ref="i18nEditorRef"
    :title="$t('mall-product.i18n.title')"
    v-if="formData?.id"
    :entity-id="formData?.id"
    :fields="[
      { key: 'name', label: $t('mall-product.category.name'), type: 'input' },
      {
        key: 'metaTitle',
        label: $t('mall-product.category.metaTitle.label'),
        type: 'input',
        placeholder: $t('mall-product.category.metaTitle.placeholder'),
      },
      {
        key: 'metaDescription',
        label: $t('mall-product.category.metaDescription.label'),
        type: 'textarea',
        placeholder: $t('mall-product.category.metaDescription.placeholder'),
      },
    ]"
    :default-data="{
      name: formData?.name ?? '',
      metaTitle: formData?.metaTitle ?? '',
      metaDescription: formData?.metaDescription ?? '',
    }"
    :initial-data="i18nData"
    :save-api="saveCategoryI18n"
  />
</template>
