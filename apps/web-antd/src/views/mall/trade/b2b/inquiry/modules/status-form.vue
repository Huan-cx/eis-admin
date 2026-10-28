<script lang="ts" setup>
import type { B2BInquiryApi } from '#/api/mall/trade/b2b/inquiry';

import { computed, ref } from 'vue';
import { useVbenModal } from '@vben/common-ui';
import { message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { updateInquiryStatus } from '#/api/mall/trade/b2b/inquiry';
import { $t } from '#/locales';

import { useStatusFormSchema } from '../data';

const emit = defineEmits(['success']);
const formData = ref<B2BInquiryApi.UpdateStatusReqVO>();

/** 标题 */
const getTitle = computed(() => {
  return $t('trade.b2b.inquiry.actions.process');
});

// 表单配置（注意：showDefaultActions: false，避免重复按钮）
const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: { class: 'w-full' },
    labelWidth: 100,
  },
  schema: useStatusFormSchema(),
  showDefaultActions: false,
});

// Modal配置
const [Modal, modalApi] = useVbenModal({
  async onConfirm() {
    modalApi.lock();
    try {
      const data = await formApi.getValues();
      await updateInquiryStatus(data as B2BInquiryApi.UpdateStatusReqVO);
      await modalApi.close();
      emit('success');
      message.success($t('ui.actionMessage.operationSuccess'));
    } finally {
      modalApi.unlock();
    }
  },
  async onOpenChange(isOpen: boolean) {
    if (!isOpen) {
      formData.value = undefined;
      return;
    }
    // 加载编辑数据
    const data = modalApi.getData<B2BInquiryApi.UpdateStatusReqVO>();
    formData.value = data;
    await formApi.setValues(data);
  },
});
</script>

<template>
  <Modal :title="getTitle">
    <Form />
  </Modal>
</template>
