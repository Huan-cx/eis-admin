<script lang="ts" setup>
import type { MallArticleApi } from '#/api/mall/promotion/article';
import type { MallArticleI18nApi } from '#/api/mall/promotion/article/i18n';

import { computed, nextTick, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { Button, message, Space } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import {
  createArticle,
  getArticle,
  updateArticle,
} from '#/api/mall/promotion/article';
import {
  getArticleI18nList,
  saveArticleI18n,
} from '#/api/mall/promotion/article/i18n';
import I18nEditor from '#/components/i18n-editor/I18nEditor.vue';
import { $t } from '#/locales';
import { SpuShowcase } from '#/views/mall/product/spu/components';

import { useFormSchema } from '../data';

const emit = defineEmits(['success']);

const formData = ref<MallArticleApi.Article>();
const i18nData = ref<MallArticleI18nApi.TranslationItem[]>([]);
const i18nEditorRef = ref<InstanceType<typeof I18nEditor>>();

const getTitle = computed(() => {
  return formData.value?.id
    ? $t('ui.actionTitle.edit', [$t('promotion.article.title')])
    : $t('ui.actionTitle.create', [$t('promotion.article.title')]);
});

const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    labelWidth: 120,
  },
  wrapperClass: 'grid-cols-2',
  layout: 'horizontal',
  schema: useFormSchema(),
  showDefaultActions: false,
});

const [Modal, modalApi] = useVbenModal({
  async onConfirm() {
    if (formData.value?.spuId) {
      await formApi.setFieldValue('spuId', formData.value.spuId);
    }
    const { valid } = await formApi.validate();
    if (!valid) {
      return;
    }
    modalApi.lock();
    const data = (await formApi.getValues()) as MallArticleApi.Article;
    try {
      const result = await (formData.value?.id
        ? updateArticle(data)
        : createArticle(data));

      if (result?.id) {
        if (formData.value) {
          formData.value.id = result.id;
        } else {
          formData.value = result;
        }
      }

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
    const data = modalApi.getData<MallArticleApi.Article>();
    if (!data || !data.id) {
      return;
    }
    modalApi.lock();
    try {
      formData.value = await getArticle(data.id);
      await formApi.setValues(formData.value);
    } finally {
      modalApi.unlock();
    }
  },
});

async function loadI18nData() {
  if (!formData.value?.id) {
    i18nData.value = [];
    return;
  }
  try {
    i18nData.value = await getArticleI18nList(formData.value.id);
  } catch (error) {
    console.error('加载国际化数据失败:', error);
    i18nData.value = [];
  }
}

// ✅ 优化：改用 async/await 配合 nextTick，避免 DOM 渲染延迟导致 ref 找不到而报错
async function openI18nEditor() {
  await loadI18nData();
  await nextTick(); // 确保模板中的 v-if 条件渲染和 ref 绑定已全部就绪
  i18nEditorRef.value?.modalApi.open();
}
</script>

<template>
  <Modal :title="getTitle" class="w-2/5">
    <template #footer>
      <Space>
        <Button v-if="!!formData?.id" type="default" @click="openI18nEditor">
          {{ $t('mall-product.i18n.title') }}
        </Button>
        <Button type="primary" @click="modalApi.onConfirm()">
          {{ $t('common.save') }}
        </Button>
      </Space>
    </template>
    <Form class="mx-4">
      <template v-if="!!formData?.spuId" #spuId>
        <SpuShowcase v-model="formData!.spuId" :limit="1" />
      </template>
    </Form>
  </Modal>

  <I18nEditor
    v-if="formData?.id"
    ref="i18nEditorRef"
    :title="$t('promotion.article.i18n')"
    :entity-id="formData.id"
    :fields="[
      { key: 'title', label: $t('promotion.article.title'), type: 'input' },
      {
        key: 'introduction',
        label: $t('promotion.article.introduction'),
        type: 'textarea',
      },
      {
        key: 'content',
        label: $t('promotion.article.content'),
        type: 'richText',
      },
      {
        key: 'metaTitle',
        label: $t('promotion.article.metaTitle.label'),
        type: 'input',
        placeholder: $t('promotion.article.metaTitle.placeholder'),
      },
      {
        key: 'metaDescription',
        label: $t('promotion.article.metaDescription.label'),
        type: 'textarea',
        placeholder: $t('promotion.article.metaDescription.placeholder'),
      },
    ]"
    :default-data="{
      title: formData.title ?? '',
      introduction: formData.introduction ?? '',
      content: formData.content ?? '',
      metaTitle: formData.metaTitle ?? '',
      metaDescription: formData.metaDescription ?? '',
    }"
    :initial-data="i18nData"
    :save-api="saveArticleI18n"
  />
</template>
