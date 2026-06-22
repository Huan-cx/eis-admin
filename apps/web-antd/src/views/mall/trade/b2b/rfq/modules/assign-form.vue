<script lang="ts" setup>
import type { B2BRfqApi } from '#/api/mall/trade/b2b/rfq';

import { useVbenModal } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import { assignSupplier } from '#/api/mall/trade/b2b/rfq';
import { $t } from '#/locales';

import { useAssignSupplierFormSchema } from '../data';

const emit = defineEmits<{
  success: [];
}>();

const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 120,
  },
  layout: 'horizontal',
  schema: useAssignSupplierFormSchema(),
  showDefaultActions: false,
});

const [Modal, modalApi] = useVbenModal({
  title: $t('trade.b2b.rfq.assignSupplierForm.title'),
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) {
      return;
    }
    modalApi.lock();
    try {
      const data = await formApi.getValues();
      await assignSupplier(data as B2BRfqApi.AssignSupplierReqVO);
      emit('success');
      await modalApi.close();
    } finally {
      modalApi.unlock();
    }
  },
  async onOpenChange(isOpen: boolean) {
    if (!isOpen) {
      return;
    }
    const data = modalApi.getData<{ id: number }>();
    if (data?.id) {
      await formApi.setValues({ id: data.id });
    }
  },
});

function open(data: { id: number }) {
  modalApi.setData(data).open();
}

defineExpose({
  open,
});
</script>

<template>
  <Modal v-bind="$attrs">
    <Form />
  </Modal>
</template>
