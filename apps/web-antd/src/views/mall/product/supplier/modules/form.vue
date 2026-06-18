<script lang="ts" setup>
import type { MallSupplierApi } from '#/api/mall/product/supplier';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { createSupplier, getSupplier, updateSupplier } from '#/api/mall/product/supplier';
import { $t } from '#/locales';

import { useFormSchema } from '../data';

const emit = defineEmits(['success']);

const formData = ref<any>();

const getTitle = computed(() => {
  return formData.value?.id ? '编辑供应商' : '创建供应商';
});

const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 120,
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
        ? updateSupplier(data as any)
        : createSupplier(data as any));
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
    const data = modalApi.getData<any>();
    if (!data) {
      return;
    }
    modalApi.lock();
    try {
      formData.value = data.id ? await getSupplier(data.id) : data;
      await formApi.setValues(formData.value);
    } finally {
      modalApi.unlock();
    }
  },
  title: getTitle.value,
});
</script>

<template>
  <Modal :title="getTitle" class="w-1/3">
    <Form class="mx-4" />
  </Modal>
</template>
