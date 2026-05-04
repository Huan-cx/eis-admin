<script setup lang="ts">
import type { NavigationBarProperty } from './config';

import { $t } from '#/locales';

import { useVModel } from '@vueuse/core';
import {
  Card,
  Checkbox,
  Form,
  FormItem,
  Radio,
  RadioGroup,
  Tooltip,
} from 'ant-design-vue';

import UploadImg from '#/components/upload/image-upload.vue';
import { ColorInput } from '#/views/mall/promotion/components';

import NavigationBarCellProperty from './components/cell-property.vue';

/** 导航栏属性面板 */
defineOptions({ name: 'NavigationBarProperty' });

const props = defineProps<{ modelValue: NavigationBarProperty }>();

const emit = defineEmits(['update:modelValue']);

const rules: Record<string, any> = {
  name: [{ required: true, message: $t('promotion.navigationBar.property.required'), trigger: 'blur' }],
}; // 表单校验

const formData = useVModel(props, 'modelValue', emit);
if (!formData.value._local) {
  formData.value._local = { previewMp: true, previewOther: false };
}
</script>

<template>
  <Form
    :label-col="{ span: 6 }"
    :wrapper-col="{ span: 18 }"
    :model="formData"
    :rules="rules"
  >
    <FormItem :label="$t('promotion.navigationBar.property.style')" name="styleType">
      <RadioGroup v-model:value="formData!.styleType">
        <Radio value="normal">{{ $t('promotion.navigationBar.property.normal') }}</Radio>
        <Tooltip
          :title="$t('promotion.navigationBar.property.innerTooltip')"
          placement="top"
        >
          <Radio value="inner">{{ $t('promotion.navigationBar.property.inner') }}</Radio>
        </Tooltip>
      </RadioGroup>
    </FormItem>
    <FormItem
      :label="$t('promotion.navigationBar.property.alwaysShow')"
      name="alwaysShow"
      v-if="formData.styleType === 'inner'"
    >
      <RadioGroup v-model:value="formData!.alwaysShow">
        <Radio :value="false">{{ $t('promotion.navigationBar.property.close') }}</Radio>
        <Tooltip
          :title="$t('promotion.navigationBar.property.alwaysShowTooltip')"
          placement="top"
        >
          <Radio :value="true">{{ $t('promotion.navigationBar.property.open') }}</Radio>
        </Tooltip>
      </RadioGroup>
    </FormItem>
    <FormItem :label="$t('promotion.navigationBar.property.bgType')" name="bgType">
      <RadioGroup v-model:value="formData.bgType">
        <Radio value="color">{{ $t('promotion.navigationBar.property.solidColor') }}</Radio>
        <Radio value="img">{{ $t('promotion.navigationBar.property.image') }}</Radio>
      </RadioGroup>
    </FormItem>
    <FormItem
      :label="$t('promotion.navigationBar.property.bgColor')"
      name="bgColor"
      v-if="formData.bgType === 'color'"
    >
      <ColorInput v-model="formData.bgColor" />
    </FormItem>
    <FormItem :label="$t('promotion.navigationBar.property.bgImage')" name="bgImg" v-else>
      <div class="flex items-center">
        <UploadImg
          v-model="formData.bgImg"
          :limit="1"
          width="56px"
          height="56px"
          :show-description="false"
        />
        <span class="mb-2 ml-2 text-xs text-gray-400">{{ $t('promotion.navigationBar.property.bgImageTip') }}</span>
      </div>
    </FormItem>
    <Card class="property-group" :bordered="false">
      <template #title>
        <div class="flex items-center justify-between">
          <span>{{ $t('promotion.navigationBar.property.contentMp') }}</span>
          <FormItem name="_local.previewMp" class="mb-0">
            <Checkbox
              v-model:checked="formData._local.previewMp"
              @change="
                formData._local.previewOther = !formData._local.previewMp
              "
            >
              {{ $t('promotion.navigationBar.property.preview') }}
            </Checkbox>
          </FormItem>
        </div>
      </template>
      <NavigationBarCellProperty v-model="formData.mpCells" is-mp />
    </Card>
    <Card class="property-group" :bordered="false">
      <template #title>
        <div class="flex items-center justify-between">
          <span>{{ $t('promotion.navigationBar.property.contentOther') }}</span>
          <FormItem name="_local.previewOther" class="mb-0">
            <Checkbox
              v-model:checked="formData._local.previewOther"
              @change="
                formData._local.previewMp = !formData._local.previewOther
              "
            >
              预览
            </Checkbox>
          </FormItem>
        </div>
      </template>
      <NavigationBarCellProperty v-model="formData.otherCells" :is-mp="false" />
    </Card>
  </Form>
</template>
