<script lang="ts" setup>
import type { OrderShipmentApi } from '#/api/mall/trade/orderShipment/types';

import { useVbenForm, useVbenModal } from '@vben/common-ui';

import { message } from 'ant-design-vue';

import { updateShipmentStatus } from '#/api/mall/trade/orderShipment';
import { $t } from '#/locales';

import { useStatusFormSchema } from '../data';

defineOptions({
  name: 'TradeOrderShipmentStatusForm',
});

const emit = defineEmits<{
  success: [];
}>();

const [Form, formApi] = useVbenForm({
  schema: useStatusFormSchema(),
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
  },
});

const [Modal, modalApi] = useVbenModal({
  class: 'w-[500px]',
  title: $t('trade.shipment.modal.updateStatusTitle'),
  async onConfirm() {
    const values = await formApi.submitForm();
    await updateShipmentStatus(values as OrderShipmentApi.UpdateStatusRequest);
    message.success($t('trade.shipment.message.statusUpdateSuccess'));
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
      formApi.setValues({
        id: data.id,
      });
    }
  },
});
</script>

<template>
  <Modal>
    <Form />
  </Modal>
</template>
