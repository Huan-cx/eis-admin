<script lang="ts" setup>
import type { OrderShipmentEventApi } from '#/api/mall/trade/orderShipment/types';

import { useVbenForm, useVbenModal } from '@vben/common-ui';

import { message } from 'ant-design-vue';
import dayjs from 'dayjs';

import { createShipmentEvent } from '#/api/mall/trade/orderShipment';
import { $t } from '#/locales';

import { useEventFormSchema } from '../data';

defineOptions({
  name: 'TradeOrderShipmentEventForm',
});

const emit = defineEmits<{
  success: [];
}>();

const [Form, formApi] = useVbenForm({
  schema: useEventFormSchema(),
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
  },
});

const [Modal, modalApi] = useVbenModal({
  class: 'w-[600px]',
  title: $t('trade.shipment.action.addEvent'),
  async onConfirm() {
    const values = await formApi.submitForm();
    await createShipmentEvent(values as OrderShipmentEventApi.CreateRequest);
    message.success($t('trade.shipment.message.eventAddSuccess'));
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
    const data = modalApi.getData<{ shipmentId: number }>();
    if (data) {
      formApi.setValues({
        shipmentId: data.shipmentId,
        eventTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        eventType: 9999, // CUSTOM_EVENT
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
