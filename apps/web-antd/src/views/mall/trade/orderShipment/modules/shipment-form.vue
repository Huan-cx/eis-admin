<script lang="ts" setup>
import type { OrderShipmentApi } from '#/api/mall/trade/orderShipment/types';

import { useVbenForm, useVbenModal } from '@vben/common-ui';

import { message } from 'ant-design-vue';

import { updateShipment } from '#/api/mall/trade/orderShipment';
import { $t } from '#/locales';

import { useShipmentFormSchema } from '../data';

defineOptions({
  name: 'TradeOrderShipmentForm',
});

const emit = defineEmits<{
  success: [];
}>();

const [Form, formApi] = useVbenForm({
  schema: useShipmentFormSchema(),
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
  },
});

const [Modal, modalApi] = useVbenModal({
  class: 'w-[600px]',
  title: $t('trade.shipment.modal.editTitle'),
  async onConfirm() {
    const values = await formApi.submitForm();
    await updateShipment(values as OrderShipmentApi.UpdateRequest);
    message.success($t('trade.shipment.message.updateSuccess'));
    modalApi.close();
    emit('success');
  },
  onClosed() {
    formApi.resetForm();
  },
  async onOpenChange(isOpen: boolean) {
    if (!isOpen) {
      return;
    }
    const data = modalApi.getData<OrderShipmentApi.PageItem>();
    if (data) {
      formApi.setValues(data);
    }
  },
});
</script>

<template>
  <Modal>
    <Form />
  </Modal>
</template>
