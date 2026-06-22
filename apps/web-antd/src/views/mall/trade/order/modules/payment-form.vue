<script lang="ts" setup>
import { useVbenModal } from '@vben/common-ui';

import { message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { manualPayOrder } from '#/api/mall/trade/b2b/order';
import { $t } from '#/locales';

import { usePaymentFormSchema } from '../data';

const emit = defineEmits(['success']);

const [Form, formApi] = useVbenForm({
  schema: usePaymentFormSchema(),
  showDefaultActions: false,
});

const [Modal, modalApi] = useVbenModal({
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) {
      return;
    }
    modalApi.lock();
    const data = await formApi.getValues() as {
      amount: number;
      paymentMethod: number;
      transactionId?: string;
      remark?: string;
    };
    const orderData = modalApi.getData<{ orderId: number }>();
    try {
      const amountInFen = Math.round(data.amount * 100);
      await manualPayOrder({
        orderId: orderData?.orderId || 0,
        amount: amountInFen,
        paymentMethod: data.paymentMethod,
        transactionId: data.transactionId,
        remark: data.remark || ''
      });
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
    const data = modalApi.getData<{ orderId: number; remaining: number }>();
    if (data) {
      await formApi.setValues({
        amount: data.remaining / 100,
      });
    }
  },
});
</script>

<template>
  <Modal :title="$t('trade.order.index.manualPay')">
    <Form />
  </Modal>
</template>
