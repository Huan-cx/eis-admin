<script setup lang="ts">
import type { NoticeBarProperty } from './config';

import { useVModel } from '@vueuse/core';
import { Card, Form, FormItem, Input } from 'ant-design-vue';

import UploadImg from '#/components/upload/image-upload.vue';
import { $t } from '#/locales';
import {
  AppLinkInput,
  ColorInput,
  Draggable,
} from '#/views/mall/promotion/components';

import ComponentContainerProperty from '../../component-container-property.vue';

/** 公告栏属性面板 */
defineOptions({ name: 'NoticeBarProperty' });

const props = defineProps<{ modelValue: NoticeBarProperty }>();

const emit = defineEmits(['update:modelValue']);

const formData = useVModel(props, 'modelValue', emit);
const rules = {
  content: [
    {
      required: true,
      message: $t('promotion.noticeBar.property.required'),
      trigger: 'blur',
    },
  ],
}; // 表单校验
</script>

<template>
  <ComponentContainerProperty v-model="formData.style">
    <Form :model="formData" :rules="rules">
      <FormItem :label="$t('promotion.noticeBar.property.icon')" name="iconUrl">
        <UploadImg
          v-model="formData.iconUrl"
          height="48px"
          :show-description="false"
        >
          <!-- TODO @芋艿：这里不提示；是不是组件得封装下；-->
          <template #tip>
            {{ $t('promotion.noticeBar.property.iconTip') }}
          </template>
        </UploadImg>
      </FormItem>
      <FormItem
        :label="$t('promotion.noticeBar.property.bgColor')"
        name="backgroundColor"
      >
        <ColorInput v-model="formData.backgroundColor" />
      </FormItem>
      <FormItem
        :label="$t('promotion.noticeBar.property.textColor')"
        name="textColor"
      >
        <ColorInput v-model="formData.textColor" />
      </FormItem>
      <Card
        :title="$t('promotion.noticeBar.property.content')"
        class="property-group"
      >
        <Draggable v-model="formData.contents">
          <template #default="{ element }">
            <FormItem
              :label="$t('promotion.noticeBar.property.notice')"
              name="text"
            >
              <Input
                v-model:value="element.text"
                :placeholder="$t('promotion.noticeBar.property.placeholder')"
              />
            </FormItem>
            <FormItem
              :label="$t('promotion.noticeBar.property.url')"
              name="url"
            >
              <AppLinkInput v-model="element.url" />
            </FormItem>
          </template>
        </Draggable>
      </Card>
    </Form>
  </ComponentContainerProperty>
</template>
