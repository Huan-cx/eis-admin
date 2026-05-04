<script lang="ts" setup>
import type { MallI18nApi } from '#/api/mall/product/i18n';
import type { MallPropertyApi } from '#/api/mall/product/property';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { Button, message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import {
  getPropertyValueI18nList,
  savePropertyValueI18n,
} from '#/api/mall/product/i18n';
import {
  createPropertyValue,
  getPropertyValue,
  updatePropertyValue,
} from '#/api/mall/product/property';
import I18nEditor from '#/components/i18n-editor/I18nEditor.vue';
import { $t } from '#/locales';

import { useValueFormSchema } from '../data';

const emit = defineEmits(['success']);

const formData = ref<MallPropertyApi.PropertyValue>();
const i18nData = ref<MallI18nApi.TranslationItem[]>([]);
const i18nEditorRef = ref<InstanceType<typeof I18nEditor>>();

async function loadI18nData() {
  if (!formData.value?.id) {
    i18nData.value = [];
    return;
  }
  try {
    i18nData.value = await getPropertyValueI18nList(formData.value.id);
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
    ? $t('ui.actionTitle.edit', [$t('mall-product.property.propertyValue')])
    : $t('ui.actionTitle.create', [$t('mall-product.property.propertyValue')]);
});

const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 100,
  },
  schema: useValueFormSchema(),
});

const [Modal, modalApi] = useVbenModal({
  title: getTitle.value ?? '',
  async onConfirm() {
    modalApi.lock();
    try {
      const data = await formApi.getValues();
      await (formData.value?.id
        ? updatePropertyValue(data as MallPropertyApi.PropertyValue)
        : createPropertyValue(data as MallPropertyApi.PropertyValue));
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
    const data = modalApi.getData<MallPropertyApi.PropertyValue>();
    if (!data || !data.id) {
      return;
    }
    modalApi.lock();
    try {
      formData.value = await getPropertyValue(data.id);
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
    :entity-id="formData?.id"
    :fields="[
      {
        key: 'name',
        label: $t('mall-product.property.valueName'),
        type: 'input',
      },
    ]"
    :default-data="{
      name: formData?.name ?? '',
    }"
    :initial-data="i18nData"
    :save-api="savePropertyValueI18n"
  />
</template>
