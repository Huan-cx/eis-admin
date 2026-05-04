<script setup lang="ts">
import type { TabBarProperty } from './config';

import { IconifyIcon } from '@vben/icons';

import { useVModel } from '@vueuse/core';
import {
  Form,
  FormItem,
  Input,
  RadioButton,
  RadioGroup,
  Select,
  SelectOption,
} from 'ant-design-vue';

import UploadImg from '#/components/upload/image-upload.vue';
import { $t } from '#/locales';
import {
  AppLinkInput,
  ColorInput,
  Draggable,
} from '#/views/mall/promotion/components';

import { component, THEME_LIST } from './config';

/** 底部导航栏 */
defineOptions({ name: 'TabBarProperty' });

const props = defineProps<{ modelValue: TabBarProperty }>();
const emit = defineEmits(['update:modelValue']);
const formData = useVModel(props, 'modelValue', emit);

// 将数据库的值更新到右侧属性栏
component.property.items = formData.value.items;

/** 处理主题变更 */
const handleThemeChange = () => {
  const theme = THEME_LIST.find((theme) => theme.id === formData.value.theme);
  if (theme?.color) {
    formData.value.style.activeColor = theme.color;
  }
};
</script>

<template>
  <div>
    <!-- 表单 -->
    <Form
      :model="formData"
      :label-col="{ span: 6 }"
      :wrapper-col="{ span: 18 }"
    >
      <FormItem :label="$t('promotion.tabBar.property.theme')" name="theme">
        <Select v-model:value="formData!.theme" @change="handleThemeChange">
          <SelectOption
            v-for="(theme, index) in THEME_LIST"
            :key="index"
            :label="theme.name"
            :value="theme.id"
          >
            <div class="flex items-center justify-between">
              <IconifyIcon :icon="theme.icon" :color="theme.color" />
              <span>{{ theme.name }}</span>
            </div>
          </SelectOption>
        </Select>
      </FormItem>
      <FormItem :label="$t('promotion.tabBar.property.defaultColor')">
        <ColorInput v-model="formData!.style.color" />
      </FormItem>
      <FormItem :label="$t('promotion.tabBar.property.activeColor')">
        <ColorInput v-model="formData!.style.activeColor" />
      </FormItem>
      <FormItem :label="$t('promotion.tabBar.property.navBg')">
        <RadioGroup v-model:value="formData!.style.bgType">
          <RadioButton value="color">
            {{ $t('promotion.tabBar.property.solidColor') }}
          </RadioButton>
          <RadioButton value="img">
            {{ $t('promotion.tabBar.property.image') }}
          </RadioButton>
        </RadioGroup>
      </FormItem>
      <FormItem
        :label="$t('promotion.tabBar.property.selectColor')"
        v-if="formData!.style.bgType === 'color'"
      >
        <ColorInput v-model="formData!.style.bgColor" />
      </FormItem>
      <FormItem
        :label="$t('promotion.tabBar.property.selectImage')"
        v-if="formData!.style.bgType === 'img'"
      >
        <UploadImg
          v-model="formData!.style.bgImg"
          width="100%"
          height="50px"
          class="min-w-[200px]"
          :show-description="false"
        >
          <!-- TODO @芋艿：这里不提示；是不是组件得封装下；-->
          <template #tip>
            {{ $t('promotion.tabBar.property.bgImgTip') }}
          </template>
        </UploadImg>
      </FormItem>

      <div class="mb-2 text-base">
        {{ $t('promotion.tabBar.property.iconSettings') }}
      </div>
      <div class="mb-2 text-xs text-gray-500">
        {{ $t('promotion.tabBar.property.iconTips') }}
      </div>
      <Draggable v-model="formData.items" :limit="5">
        <template #default="{ element }">
          <div class="mb-2 flex items-center justify-around">
            <div class="flex flex-col items-center justify-between">
              <UploadImg
                v-model="element.iconUrl"
                width="40px"
                height="40px"
                :show-delete="false"
                :show-description="false"
              />
              <div class="text-xs">
                {{ $t('promotion.tabBar.property.notSelected') }}
              </div>
            </div>
            <div>
              <UploadImg
                v-model="element.activeIconUrl"
                width="40px"
                height="40px"
                :show-delete="false"
                :show-description="false"
              />
              <div class="text-xs">
                {{ $t('promotion.tabBar.property.selected') }}
              </div>
            </div>
          </div>
          <FormItem
            name="text"
            :label="$t('promotion.tabBar.property.text')"
            :label-col="{ span: 4 }"
            :wrapper-col="{ span: 20 }"
            class="mb-2"
          >
            <Input
              v-model:value="element.text"
              :placeholder="$t('promotion.tabBar.property.textPlaceholder')"
            />
          </FormItem>
          <FormItem
            name="url"
            :label="$t('promotion.tabBar.property.url')"
            :label-col="{ span: 4 }"
            :wrapper-col="{ span: 20 }"
            class="mb-0"
          >
            <AppLinkInput v-model="element.url" />
          </FormItem>
        </template>
      </Draggable>
    </Form>
  </div>
</template>
