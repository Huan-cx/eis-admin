<script setup lang="ts">
import type { ProductListProperty } from './config';

import { IconifyIcon } from '@vben/icons';

import { $t } from '#/locales';

import { useVModel } from '@vueuse/core';
import {
  Card,
  Checkbox,
  Form,
  FormItem,
  RadioButton,
  RadioGroup,
  Slider,
  Switch,
  Tooltip,
} from 'ant-design-vue';

import UploadImg from '#/components/upload/image-upload.vue';
import SpuShowcase from '#/views/mall/product/spu/components/spu-showcase.vue';
import { ColorInput } from '#/views/mall/promotion/components';

import ComponentContainerProperty from '../../component-container-property.vue';

/** 商品栏属性面板 */
defineOptions({ name: 'ProductListProperty' });

const props = defineProps<{ modelValue: ProductListProperty }>();

const emit = defineEmits(['update:modelValue']);

const formData = useVModel(props, 'modelValue', emit);
</script>

<template>
  <ComponentContainerProperty v-model="formData.style">
    <Form
      :label-col="{ span: 6 }"
      :wrapper-col="{ span: 18 }"
      :model="formData"
    >
      <Card :title="$t('promotion.productList.title')" class="property-group" :bordered="false">
        <SpuShowcase v-model="formData.spuIds" />
      </Card>
      <Card :title="$t('promotion.diy.editor.style.productStyle')" class="property-group" :bordered="false">
        <FormItem :label="$t('promotion.diy.editor.style.layout')" name="type">
          <RadioGroup v-model:value="formData.layoutType">
            <Tooltip :title="$t('promotion.diy.editor.style.layout.twoCol')" placement="bottom">
              <RadioButton value="twoCol">
                <IconifyIcon
                  icon="fluent:text-column-two-24-filled"
                  class="size-6"
                />
              </RadioButton>
            </Tooltip>
            <Tooltip :title="$t('promotion.diy.editor.style.layout.threeCol')" placement="bottom">
              <RadioButton value="threeCol">
                <IconifyIcon
                  icon="fluent:text-column-three-24-filled"
                  class="size-6"
                />
              </RadioButton>
            </Tooltip>
            <Tooltip :title="$t('promotion.diy.editor.style.layout.horizontal')" placement="bottom">
              <RadioButton value="horizSwiper">
                <IconifyIcon icon="system-uicons:carousel" class="size-6" />
              </RadioButton>
            </Tooltip>
          </RadioGroup>
        </FormItem>
        <FormItem :label="$t('promotion.diy.editor.style.productName')" name="fields.name.show">
          <div class="flex gap-2">
            <ColorInput v-model="formData.fields.name.color" />
            <Checkbox v-model:checked="formData.fields.name.show" />
          </div>
        </FormItem>
        <FormItem :label="$t('promotion.diy.editor.style.productPrice')" name="fields.price.show">
          <div class="flex gap-2">
            <ColorInput v-model="formData.fields.price.color" />
            <Checkbox v-model:checked="formData.fields.price.show" />
          </div>
        </FormItem>
      </Card>
      <Card :title="$t('promotion.diy.editor.style.badge')" class="property-group" :bordered="false">
        <FormItem :label="$t('promotion.diy.editor.style.badge')" name="badge.show">
          <Switch v-model:checked="formData.badge.show" />
        </FormItem>
        <FormItem :label="$t('promotion.diy.editor.style.badge')" name="badge.imgUrl" v-if="formData.badge.show">
          <UploadImg
            v-model="formData.badge.imgUrl"
            height="44px"
            width="72px"
            :show-description="false"
          >
            <!-- TODO @芋艿：这里不提示；是不是组件得封装下；-->
            <template #tip> 建议尺寸：36 * 22 </template>
          </UploadImg>
        </FormItem>
      </Card>
      <Card :title="$t('promotion.diy.editor.style.productStyle')" class="property-group" :bordered="false">
        <FormItem :label="$t('promotion.diy.editor.style.borderRadiusTop')" name="borderRadiusTop">
          <Slider
            v-model:value="formData.borderRadiusTop"
            :max="100"
            :min="0"
          />
        </FormItem>
        <FormItem :label="$t('promotion.diy.editor.style.borderRadiusBottom')" name="borderRadiusBottom">
          <Slider
            v-model:value="formData.borderRadiusBottom"
            :max="100"
            :min="0"
          />
        </FormItem>
        <FormItem :label="$t('promotion.diy.editor.style.space')" name="space">
          <Slider v-model:value="formData.space" :max="100" :min="0" />
        </FormItem>
      </Card>
    </Form>
  </ComponentContainerProperty>
</template>
