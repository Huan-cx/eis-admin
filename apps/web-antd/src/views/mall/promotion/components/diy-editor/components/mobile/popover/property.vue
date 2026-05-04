<script setup lang="ts">
import type { PopoverProperty } from './config';

import { $t } from '#/locales';

import { useVModel } from '@vueuse/core';
import { Form, FormItem, Radio, RadioGroup, Tooltip } from 'ant-design-vue';

import UploadImg from '#/components/upload/image-upload.vue';
import { AppLinkInput, Draggable } from '#/views/mall/promotion/components';

/** 弹窗广告属性面板 */
defineOptions({ name: 'PopoverProperty' });

const props = defineProps<{ modelValue: PopoverProperty }>();

const emit = defineEmits(['update:modelValue']);

const formData = useVModel(props, 'modelValue', emit);
</script>

<template>
  <Form :label-col="{ style: { width: '80px' } }" :model="formData">
    <Draggable v-model="formData.list" :empty-item="{ showType: 'once' }">
      <template #default="{ element, index }">
        <FormItem :label="$t('promotion.popover.property.image')" :name="`list[${index}].imgUrl`">
          <UploadImg
            v-model="element.imgUrl"
            height="56px"
            width="56px"
            :show-description="false"
          />
        </FormItem>
        <FormItem :label="$t('promotion.popover.property.url')" :name="`list[${index}].url`">
          <AppLinkInput v-model="element.url" />
        </FormItem>
        <FormItem :label="$t('promotion.popover.property.showType')" :name="`list[${index}].showType`">
          <RadioGroup v-model:value="element.showType">
            <Tooltip :title="$t('promotion.popover.property.onceTooltip')" placement="bottom">
              <Radio value="once">{{ $t('promotion.popover.property.once') }}</Radio>
            </Tooltip>
            <Tooltip :title="$t('promotion.popover.property.alwaysTooltip')" placement="bottom">
              <Radio value="always">{{ $t('promotion.popover.property.always') }}</Radio>
            </Tooltip>
          </RadioGroup>
        </FormItem>
      </template>
    </Draggable>
  </Form>
</template>
