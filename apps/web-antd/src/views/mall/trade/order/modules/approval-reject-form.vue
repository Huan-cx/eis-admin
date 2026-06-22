<script lang="ts" setup>
import { useVbenModal } from '@vben/common-ui';

import { message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { rejectOrder } from '#/api/mall/trade/b2b/order';
import { $t } from '#/locales';

import { useApprovalRejectFormSchema } from '../data';

const emit = defineEmits(['success']);

const [Form, formApi] = useVbenForm({
  schema: useApprovalRejectFormSchema(),
  showDefaultActions: false,
});

const [Modal, modalApi] = useVbenModal({
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) {
      return;
    }
    modalApi.lock();
    const data = await formApi.getValues() as { reason: string };
    const orderData = modalApi.getData<{ id: number }>();
    try {
      await rejectOrder(orderData?.id || 0, data.reason);
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
    const data = modalApi.getData<{ id: number }>();
    if (data) {
      await formApi.setValues({
        id: data.id,
      });
    }
  },
});
</script>

<template>
  <Modal :title="$t('trade.order.approvalForm.rejectTitle')">
    <Form />
  </Modal>
</template>
