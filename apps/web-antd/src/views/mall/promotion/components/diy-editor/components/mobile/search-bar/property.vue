<script setup lang="ts">
import type { SearchProperty } from './config';

import { watch } from 'vue';

import { IconifyIcon } from '@vben/icons';
import { isString } from '@vben/utils';

import { useVModel } from '@vueuse/core';
import {
  Card,
  Form,
  FormItem,
  Input,
  RadioButton,
  RadioGroup,
  Slider,
  Switch,
  Tooltip,
} from 'ant-design-vue';

import { $t } from '#/locales';
import { ColorInput, Draggable } from '#/views/mall/promotion/components';

import ComponentContainerProperty from '../../component-container-property.vue';

/** 搜索框属性面板 */
defineOptions({ name: 'SearchProperty' });

const props = defineProps<{ modelValue: SearchProperty }>();

const emit = defineEmits(['update:modelValue']);

const formData = useVModel(props, 'modelValue', emit);

/** 监听热词数组变化 */
watch(
  () => formData.value.hotKeywords,
  (newVal) => {
    // 找到非字符串项的索引
    const nonStringIndex = newVal.findIndex((item) => !isString(item));
    if (nonStringIndex !== -1) {
      formData.value.hotKeywords[nonStringIndex] = '';
    }
  },
  { deep: true, flush: 'post' },
);
</script>

<template>
  <ComponentContainerProperty v-model="formData.style">
    <Form :model="formData" :label-col="{ style: { width: '80px' } }">
      <Card
        :title="$t('promotion.searchBar.property.hotKeywords')"
        class="property-group"
      >
        <Draggable
          v-model="formData.hotKeywords"
          :empty-item="{
            type: 'input',
            placeholder: $t(
              'promotion.searchBar.property.hotKeywordPlaceholder',
            ),
          }"
        >
          <template #default="{ index }">
            <Input
              v-model:value="formData.hotKeywords[index]"
              :placeholder="
                $t('promotion.searchBar.property.hotKeywordPlaceholder')
              "
            />
          </template>
        </Draggable>
      </Card>
      <Card
        :title="$t('promotion.searchBar.property.style')"
        class="property-group"
      >
        <FormItem :label="$t('promotion.searchBar.property.boxStyle')">
          <RadioGroup v-model:value="formData!.borderRadius">
            <Tooltip
              :title="$t('promotion.searchBar.property.square')"
              placement="top"
            >
              <RadioButton :value="0">
                <IconifyIcon icon="tabler:input-search" class="size-6" />
              </RadioButton>
            </Tooltip>
            <Tooltip
              :title="$t('promotion.searchBar.property.round')"
              placement="top"
            >
              <RadioButton :value="10">
                <IconifyIcon icon="iconoir:input-search" class="size-6" />
              </RadioButton>
            </Tooltip>
          </RadioGroup>
        </FormItem>
        <FormItem
          :label="$t('promotion.searchBar.property.placeholder')"
          name="placeholder"
        >
          <Input v-model:value="formData.placeholder" />
        </FormItem>
        <FormItem
          :label="$t('promotion.searchBar.property.textPosition')"
          name="placeholderPosition"
        >
          <RadioGroup v-model:value="formData!.placeholderPosition">
            <Tooltip
              :title="$t('promotion.searchBar.property.alignLeft')"
              placement="top"
            >
              <RadioButton value="left">
                <IconifyIcon
                  icon="ant-design:align-left-outlined"
                  class="size-6"
                />
              </RadioButton>
            </Tooltip>
            <Tooltip
              :title="$t('promotion.searchBar.property.alignCenter')"
              placement="top"
            >
              <RadioButton value="center">
                <IconifyIcon
                  icon="ant-design:align-center-outlined"
                  class="size-6"
                />
              </RadioButton>
            </Tooltip>
          </RadioGroup>
        </FormItem>
        <FormItem
          :label="$t('promotion.searchBar.property.scan')"
          name="showScan"
        >
          <Switch v-model:checked="formData!.showScan" />
        </FormItem>
        <FormItem
          :label="$t('promotion.searchBar.property.height')"
          name="height"
        >
          <Slider v-model:value="formData!.height" :max="50" :min="28" />
        </FormItem>
        <FormItem
          :label="$t('promotion.searchBar.property.boxColor')"
          name="backgroundColor"
        >
          <ColorInput v-model="formData.backgroundColor" />
        </FormItem>
        <FormItem
          :label="$t('promotion.searchBar.property.textColor')"
          name="textColor"
        >
          <ColorInput v-model="formData.textColor" />
        </FormItem>
      </Card>
    </Form>
  </ComponentContainerProperty>
</template>
