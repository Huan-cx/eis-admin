<script lang="ts" setup>
import type { OrderShipmentApi } from '#/api/mall/trade/orderShipment/types';

import { useVbenModal } from '@vben/common-ui';

import { message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { updateShipmentStatus } from '#/api/mall/trade/orderShipment';
import { $t } from '#/locales';

import { useStatusFormSchema } from '../data';

const emit = defineEmits(['success']);

const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 120,
  },
  layout: 'horizontal',
  schema: useStatusFormSchema(),
  showDefaultActions: false,
});

const [Modal, modalApi] = useVbenModal({
  title: $t('trade.shipment.modal.updateStatusTitle'),
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) {
      return;
    }
    modalApi.lock();
    const values = await formApi.getValues();
    try {
      await updateShipmentStatus(values as OrderShipmentApi.UpdateStatusRequest);
      await modalApi.close();
      emit('success');
      message.success($t('ui.actionMessage.operationSuccess'));
    } finally {
      modalApi.unlock();
    }
  },
  async onOpenChange(isOpen: boolean) {
    if (!isOpen) {
      return;
    }
    const data = modalApi.getData<OrderShipmentApi.PageItem>();
    if (data) {
      await formApi.setValues({
        id: data.id,
      });
    }
  },
});
</script>

<template>
  <Modal class="w-2/5">
    <Form class="mx-4" />
  </Modal>
</template>
