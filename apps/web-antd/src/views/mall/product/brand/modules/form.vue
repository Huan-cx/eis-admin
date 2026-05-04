<script lang="ts" setup>
import type { MallBrandApi } from '#/api/mall/product/brand';
import type { MallI18nApi } from '#/api/mall/product/i18n';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { Button, message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { createBrand, getBrand, updateBrand } from '#/api/mall/product/brand';
import { getBrandI18nList, saveBrandI18n } from '#/api/mall/product/i18n';
import I18nEditor from '#/components/i18n-editor/I18nEditor.vue';
import { $t } from '#/locales';

import { useFormSchema } from '../data';

const emit = defineEmits(['success']);

const formData = ref<MallBrandApi.Brand>();
const i18nData = ref<MallI18nApi.TranslationItem[]>([]);
const i18nEditorRef = ref<InstanceType<typeof I18nEditor>>();

async function loadI18nData() {
  if (!formData.value?.id) {
    i18nData.value = [];
    return;
  }
  try {
    i18nData.value = await getBrandI18nList(formData.value.id);
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
    ? $t('ui.actionTitle.edit', [$t('mall-product.brand.title')])
    : $t('ui.actionTitle.create', [$t('mall-product.brand.title')]);
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
  async onConfirm() {
    modalApi.lock();
    try {
      const data = await formApi.getValues();
      await (formData.value?.id
        ? updateBrand(data as MallBrandApi.Brand)
        : createBrand(data as MallBrandApi.Brand));
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
    const data = modalApi.getData<MallBrandApi.Brand>();
    if (!data) {
      return;
    }
    modalApi.lock();
    try {
      formData.value = data.id ? await getBrand(data.id) : data;
      await formApi.setValues(formData.value);
    } finally {
      modalApi.unlock();
    }
  },
  title: getTitle.value,
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
    v-if="formData?.id"
    :title="$t('mall-product.i18n.title')"
    :entity-id="formData?.id"
    :fields="[
      { key: 'name', label: $t('mall-product.brand.name'), type: 'input' },
      {
        key: 'description',
        label: $t('mall-product.brand.description'),
        type: 'richText',
      },
      {
        key: 'metaTitle',
        label: $t('mall-product.brand.metaTitle'),
        type: 'input',
        placeholder: $t('mall-product.brand.metaTitle.placeholder'),
      },
      {
        key: 'metaDescription',
        label: $t('mall-product.brand.metaDescription'),
        type: 'textarea',
        placeholder: $t('mall-product.brand.metaDescription.placeholder'),
      },
    ]"
    :default-data="{
      name: formData?.name ?? '',
      description: formData?.description ?? '',
      metaTitle: formData?.metaTitle ?? '',
      metaDescription: formData?.metaDescription ?? '',
    }"
    :initial-data="i18nData"
    :save-api="saveBrandI18n"
  />
</template>
