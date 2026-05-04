<script setup lang="ts">
import type { TitleBarProperty } from './config';

import { IconifyIcon } from '@vben/icons';

import { $t } from '#/locales';

import { useVModel } from '@vueuse/core';
import {
  Card,
  Checkbox,
  Form,
  FormItem,
  Input,
  Radio,
  RadioButton,
  RadioGroup,
  Slider,
  Tooltip,
} from 'ant-design-vue';

import UploadImg from '#/components/upload/image-upload.vue';
import {
  AppLinkInput,
  InputWithColor,
} from '#/views/mall/promotion/components';

import ComponentContainerProperty from '../../component-container-property.vue';

/** 导航栏属性面板 */
defineOptions({ name: 'TitleBarProperty' });

const props = defineProps<{ modelValue: TitleBarProperty }>();

const emit = defineEmits(['update:modelValue']);

const formData = useVModel(props, 'modelValue', emit);

const rules = {}; // 表单校验
</script>
<template>
  <ComponentContainerProperty v-model="formData.style">
    <Form :model="formData" :rules="rules">
      <Card :title="$t('promotion.titleBar.property.style')" class="property-group">
        <FormItem :label="$t('promotion.titleBar.property.bgImg')" name="bgImgUrl">
          <UploadImg
            v-model="formData.bgImgUrl"
            width="100%"
            height="40px"
            :show-description="false"
          >
            <!-- TODO @芋艿：这里不提示；是不是组件得封装下；-->
            <template #tip>{{ $t('promotion.titleBar.property.bgImgTip') }}</template>
          </UploadImg>
        </FormItem>
        <FormItem :label="$t('promotion.titleBar.property.titlePosition')" name="textAlign">
          <RadioGroup v-model:value="formData!.textAlign">
            <Tooltip :title="$t('promotion.titleBar.property.alignLeft')" placement="top">
              <RadioButton value="left">
                <IconifyIcon
                  icon="ant-design:align-left-outlined"
                  class="size-6"
                />
              </RadioButton>
            </Tooltip>
            <Tooltip :title="$t('promotion.titleBar.property.alignCenter')" placement="top">
              <RadioButton value="center">
                <IconifyIcon
                  icon="ant-design:align-center-outlined"
                  class="size-6"
                />
              </RadioButton>
            </Tooltip>
          </RadioGroup>
        </FormItem>
        <FormItem :label="$t('promotion.titleBar.property.offset')" name="marginLeft">
          <Slider v-model:value="formData.marginLeft" :max="100" :min="0" />
        </FormItem>
        <FormItem :label="$t('promotion.titleBar.property.height')" name="height">
          <Slider v-model:value="formData.height" :max="200" :min="20" />
        </FormItem>
      </Card>
      <Card :title="$t('promotion.titleBar.property.mainTitle')" class="property-group">
        <FormItem :label="$t('promotion.titleBar.property.text')" name="title">
          <InputWithColor
            v-model="formData.title"
            v-model:color="formData.titleColor"
            show-count
            :maxlength="20"
          />
        </FormItem>
        <FormItem :label="$t('promotion.titleBar.property.size')" name="titleSize">
          <Slider v-model:value="formData.titleSize" :max="60" :min="10" />
        </FormItem>
        <FormItem :label="$t('promotion.titleBar.property.weight')" name="titleWeight">
          <Slider
            v-model:value="formData.titleWeight"
            :min="100"
            :max="900"
            :step="100"
          />
        </FormItem>
      </Card>
      <Card :title="$t('promotion.titleBar.property.subTitle')" class="property-group">
        <FormItem :label="$t('promotion.titleBar.property.text')" name="description">
          <InputWithColor
            v-model="formData.description"
            v-model:color="formData.descriptionColor"
            show-count
            :maxlength="50"
          />
        </FormItem>
        <FormItem :label="$t('promotion.titleBar.property.size')" name="descriptionSize">
          <Slider
            v-model:value="formData.descriptionSize"
            :max="60"
            :min="10"
          />
        </FormItem>
        <FormItem :label="$t('promotion.titleBar.property.weight')" name="descriptionWeight">
          <Slider
            v-model:value="formData.descriptionWeight"
            :min="100"
            :max="900"
            :step="100"
          />
        </FormItem>
      </Card>
      <Card :title="$t('promotion.titleBar.property.more')" class="property-group">
        <FormItem :label="$t('promotion.titleBar.property.show')" name="more.show">
          <Checkbox v-model:checked="formData.more.show" />
        </FormItem>
        <!-- 更多按钮的 样式选择 -->
        <template v-if="formData.more.show">
          <FormItem :label="$t('promotion.titleBar.property.type')" name="more.type">
            <RadioGroup v-model:value="formData.more.type">
              <Radio value="text">{{ $t('promotion.titleBar.property.text') }}</Radio>
              <Radio value="icon">{{ $t('promotion.titleBar.property.icon') }}</Radio>
              <Radio value="all">{{ $t('promotion.titleBar.property.textIcon') }}</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem
            :label="$t('promotion.titleBar.property.moreText')"
            name="more.text"
            v-show="formData.more.type !== 'icon'"
          >
            <Input v-model:value="formData.more.text" />
          </FormItem>
          <FormItem :label="$t('promotion.titleBar.property.url')" name="more.url">
            <AppLinkInput v-model="formData.more.url" />
          </FormItem>
        </template>
      </Card>
    </Form>
  </ComponentContainerProperty>
</template>
