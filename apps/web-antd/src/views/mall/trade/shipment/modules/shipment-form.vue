<script lang="ts" setup>
import type { OrderShipmentApi } from '#/api/mall/trade/shipment/types';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { createShipment, updateShipment } from '#/api/mall/trade/shipment';
import { $t } from '#/locales';

import { useCreateShipmentFormSchema, useShipmentFormSchema } from '../data';

const emit = defineEmits(['success']);
const formData = ref<OrderShipmentApi.PageItem & { isCreate?: boolean }>();

const getTitle = computed(() => {
  return formData.value?.isCreate
    ? $t('trade.shipment.modal.createTitle')
    : $t('trade.shipment.modal.editTitle');
});

const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 120,
  },
  layout: 'horizontal',
  schema: useShipmentFormSchema(),
  showDefaultActions: false,
});

const [Modal, modalApi] = useVbenModal({
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) {
      return;
    }
    modalApi.lock();
    const values = await formApi.getValues();
    const data = modalApi.getData<{ isCreate?: boolean }>();
    try {
      await (data?.isCreate
        ? createShipment(values as OrderShipmentApi.CreateRequest)
        : updateShipment(values as OrderShipmentApi.UpdateRequest));
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
    const data = modalApi.getData<
      OrderShipmentApi.PageItem & { isCreate?: boolean }
    >();
    formData.value = data;
    if (data?.isCreate) {
      formApi.setState({ schema: useCreateShipmentFormSchema() });
      await formApi.resetForm();
    } else {
      formApi.setState({ schema: useShipmentFormSchema() });
      if (data) {
        await formApi.setValues(data);
      }
    }
  },
});
</script>

<template>
  <Modal :title="getTitle" class="w-2/5">
    <Form class="mx-4" />
  </Modal>
</template>
