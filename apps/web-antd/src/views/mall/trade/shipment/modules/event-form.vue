<script lang="ts" setup>
import type { OrderShipmentEventApi } from '#/api/mall/trade/shipment/types';

import { useVbenModal } from '@vben/common-ui';

import { message } from 'ant-design-vue';
import dayjs from 'dayjs';

import { useVbenForm } from '#/adapter/form';
import { createShipmentEvent } from '#/api/mall/trade/shipment';
import { $t } from '#/locales';

import { useEventFormSchema } from '../data';

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
  schema: useEventFormSchema(),
  showDefaultActions: false,
});

const [Modal, modalApi] = useVbenModal({
  title: $t('trade.shipment.action.addEvent'),
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) {
      return;
    }
    modalApi.lock();
    const values = await formApi.getValues();
    try {
      await createShipmentEvent(values as OrderShipmentEventApi.CreateRequest);
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
    const data = modalApi.getData<{ shipmentId: number }>();
    if (data) {
      await formApi.setValues({
        shipmentId: data.shipmentId,
        eventTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        eventType: 9999,
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
