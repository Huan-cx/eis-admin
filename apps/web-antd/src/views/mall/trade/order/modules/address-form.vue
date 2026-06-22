<script lang="ts" setup>
import type { MallOrderApi } from '#/api/mall/trade/order';

import { useVbenForm, useVbenModal } from '@vben/common-ui';

import { message } from 'ant-design-vue';

import { updateOrderAddress } from '#/api/mall/trade/order';
import { $t } from '#/locales';

import { useAddressFormSchema } from '../data';

defineOptions({
  name: 'TradeOrderAddressForm',
});

const emit = defineEmits<{
  success: [];
}>();

const [Form, formApi] = useVbenForm({
  schema: useAddressFormSchema(),
  commonConfig: {
    componentProps: {
      class: 'w-full',
      cols: 2,
      xGap: 16,
    },
    labelWidth: 120,
  },
});

const [Modal, modalApi] = useVbenModal({
  class: 'w-[700px]',
  title: $t('ui.actionTitle.edit', [$t('trade.order.detail.shippingAddress')]),
  async onConfirm() {
    const values = await formApi.submitForm();
    await updateOrderAddress(values as MallOrderApi.OrderUpdateAddressReqVO);
    message.success($t('ui.actionMessage.operationSuccess'));
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
    const data = modalApi.getData<MallOrderApi.Order>();
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
