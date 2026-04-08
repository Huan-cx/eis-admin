<script lang="ts" setup>
import type { MallOrderApi } from '#/api/mall/trade/order';

import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { updateOrderAddress } from '#/api/mall/trade/order';
import { $t } from '#/locales';

import { useAddressFormSchema } from '../data';

const emit = defineEmits(['success']);

const formData = ref<MallOrderApi.Order>();

const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 120,
  },
  layout: 'horizontal',
  schema: useAddressFormSchema(),
  showDefaultActions: false,
});

const [Modal, modalApi] = useVbenModal({
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) {
      return;
    }
    modalApi.lock();
    // 提交表单
    const data = await formApi.getValues();
    try {
      await updateOrderAddress(data as MallOrderApi.OrderUpdateAddressReqVO);
      // 关闭并提示
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
    // 加载数据
    const data = modalApi.getData<MallOrderApi.Order>();
    if (!data || !data.id) {
      return;
    }
    modalApi.lock();
    try {
      formData.value = data;
      // 映射数据到字段结构
      const formValues = {
        id: data.id,
        receiveUseBilling: data.receiveUseBilling || false,
        businessUseBilling: data.businessUseBilling || false,
        receiverAddress: {
          firstName: data.receiverAddress?.firstName || '',
          lastName: data.receiverAddress?.lastName || '',
          companyName: data.receiverAddress?.companyName || '',
          street: data.receiverAddress?.street || '',
          city: data.receiverAddress?.city || '',
          state: data.receiverAddress?.state || '',
          country: data.receiverAddress?.country || '',
          postcode: data.receiverAddress?.postcode || '',
          phone: data.receiverAddress?.phone || '',
          email: data.receiverAddress?.email || '',
          vat: data.receiverAddress?.vat || '',
          eori: data.receiverAddress?.eori || '',
        },
        billingAddress: {
          companyName: data.billingAddress?.companyName || '',
          firstName: data.billingAddress?.firstName || '',
          lastName: data.billingAddress?.lastName || '',
          street: data.billingAddress?.street || '',
          city: data.billingAddress?.city || '',
          state: data.billingAddress?.state || '',
          country: data.billingAddress?.country || '',
          postcode: data.billingAddress?.postcode || '',
          phone: data.billingAddress?.phone || '',
          email: data.billingAddress?.email || '',
          vat: data.billingAddress?.vat || '',
          eori: data.billingAddress?.eori || '',
        },
        businessAddress: {
          companyName: data.businessAddress?.companyName || '',
          firstName: data.businessAddress?.firstName || '',
          lastName: data.businessAddress?.lastName || '',
          street: data.businessAddress?.street || '',
          city: data.businessAddress?.city || '',
          state: data.businessAddress?.state || '',
          country: data.businessAddress?.country || '',
          postcode: data.businessAddress?.postcode || '',
          phone: data.businessAddress?.phone || '',
          email: data.businessAddress?.email || '',
          vat: data.businessAddress?.vat || '',
          eori: data.businessAddress?.eori || '',
        },
      };
      // 设置到 values
      await formApi.setValues(formValues);
    } finally {
      modalApi.unlock();
    }
  },
});
</script>

<template>
  <Modal :title="$t('ui.actionTitle.edit', ['收货地址'])" class="w-1/3">
    <Form class="mx-4" />
  </Modal>
</template>
