<script setup lang="ts">
import type { ComponentStyle } from '../util';

import { useVModel } from '@vueuse/core';
import {
  Col,
  Form,
  FormItem,
  InputNumber,
  Radio,
  RadioGroup,
  Row,
  Slider,
  TabPane,
  Tabs,
  Tree,
} from 'ant-design-vue';

import UploadImg from '#/components/upload/image-upload.vue';
import { $t } from '#/locales';
import { ColorInput } from '#/views/mall/promotion/components';

/**
 * 组件容器属性：目前右边部分
 * 用于包裹组件，为组件提供 背景、外边距、内边距、边框等样式
 */
defineOptions({ name: 'ComponentContainer' });

const props = defineProps<{ modelValue: ComponentStyle }>();
const emit = defineEmits(['update:modelValue']);
const formData = useVModel(props, 'modelValue', emit);

const treeData: any[] = [
  {
    label: $t('promotion.diy.editor.style.margin'),
    prop: 'margin',
    children: [
      {
        label: $t('promotion.diy.editor.style.top'),
        prop: 'marginTop',
      },
      {
        label: $t('promotion.diy.editor.style.right'),
        prop: 'marginRight',
      },
      {
        label: $t('promotion.diy.editor.style.bottom'),
        prop: 'marginBottom',
      },
      {
        label: $t('promotion.diy.editor.style.left'),
        prop: 'marginLeft',
      },
    ],
  },
  {
    label: $t('promotion.diy.editor.style.padding'),
    prop: 'padding',
    children: [
      {
        label: $t('promotion.diy.editor.style.top'),
        prop: 'paddingTop',
      },
      {
        label: $t('promotion.diy.editor.style.right'),
        prop: 'paddingRight',
      },
      {
        label: $t('promotion.diy.editor.style.bottom'),
        prop: 'paddingBottom',
      },
      {
        label: $t('promotion.diy.editor.style.left'),
        prop: 'paddingLeft',
      },
    ],
  },
  {
    label: $t('promotion.diy.editor.style.borderRadius'),
    prop: 'borderRadius',
    children: [
      {
        label: $t('promotion.diy.editor.style.topLeft'),
        prop: 'borderTopLeftRadius',
      },
      {
        label: $t('promotion.diy.editor.style.topRight'),
        prop: 'borderTopRightRadius',
      },
      {
        label: $t('promotion.diy.editor.style.bottomRight'),
        prop: 'borderBottomRightRadius',
      },
      {
        label: $t('promotion.diy.editor.style.bottomLeft'),
        prop: 'borderBottomLeftRadius',
      },
    ],
  },
];

function handleSliderChange(prop: string) {
  switch (prop) {
    case 'borderRadius': {
      formData.value.borderTopLeftRadius = formData.value.borderRadius;
      formData.value.borderTopRightRadius = formData.value.borderRadius;
      formData.value.borderBottomRightRadius = formData.value.borderRadius;
      formData.value.borderBottomLeftRadius = formData.value.borderRadius;
      break;
    }
    case 'margin': {
      formData.value.marginTop = formData.value.margin;
      formData.value.marginRight = formData.value.margin;
      formData.value.marginBottom = formData.value.margin;
      formData.value.marginLeft = formData.value.margin;
      break;
    }
    case 'padding': {
      formData.value.paddingTop = formData.value.padding;
      formData.value.paddingRight = formData.value.padding;
      formData.value.paddingBottom = formData.value.padding;
      formData.value.paddingLeft = formData.value.padding;
      break;
    }
  }
}
</script>

<template>
  <Tabs>
    <!-- 每个组件的自定义内容 -->
    <TabPane
      :tab="$t('promotion.diy.editor.tab.content')"
      key="content"
      v-if="$slots.default"
    >
      <slot></slot>
    </TabPane>

    <!-- 每个组件的通用内容 -->
    <TabPane
      :tab="$t('promotion.diy.editor.tab.style')"
      key="style"
      force-render
    >
      <div class="mb-2 bg-gray-100 p-2 text-sm">
        {{ $t('promotion.diy.editor.tab.style') }}：
      </div>
      <div class="flex flex-col gap-2 rounded-md p-4 shadow-lg">
        <Form :model="formData">
          <FormItem
            :label="$t('promotion.diy.editor.style.bgType')"
            name="bgType"
            :label-col="{ style: { width: '109px' } }"
          >
            <RadioGroup v-model:value="formData.bgType">
              <Radio value="color">
                {{ $t('promotion.diy.editor.style.solidColor') }}
              </Radio>
              <Radio value="img">
                {{ $t('promotion.diy.editor.style.image') }}
              </Radio>
            </RadioGroup>
          </FormItem>
          <FormItem
            :label="$t('promotion.diy.editor.style.selectColor')"
            name="bgColor"
            :label-col="{ style: { width: '109px' } }"
            v-if="formData.bgType === 'color'"
          >
            <ColorInput v-model="formData.bgColor" />
          </FormItem>
          <FormItem
            :label="$t('promotion.diy.editor.style.uploadImage')"
            name="bgImg"
            :label-col="{ style: { width: '109px' } }"
            v-else
          >
            <UploadImg
              v-model="formData.bgImg"
              :limit="1"
              :show-description="false"
            >
              <template #tip>
                {{ $t('promotion.diy.editor.style.imageTip') }}
              </template>
            </UploadImg>
          </FormItem>
          <Tree :tree-data="treeData" default-expand-all :block-node="true">
            <template #title="{ dataRef }">
              <FormItem
                :label="dataRef.label"
                :name="dataRef.prop"
                :label-col="{
                  style: { width: dataRef.children ? '80px' : '58px' },
                }"
                class="mb-0 w-full"
              >
                <Row>
                  <Col :span="19">
                    <Slider
                      v-model:value="
                        formData[dataRef.prop as keyof ComponentStyle]
                      "
                      :max="100"
                      :min="0"
                      @change="handleSliderChange(dataRef.prop)"
                      class="mr-4"
                    />
                  </Col>
                  <Col :span="4">
                    <InputNumber
                      class="w-[50px]"
                      :max="100"
                      :min="0"
                      v-model:value="
                        formData[dataRef.prop as keyof ComponentStyle]
                      "
                    />
                  </Col>
                </Row>
              </FormItem>
            </template>
          </Tree>
          <slot name="style" :style="formData"></slot>
        </Form>
      </div>
    </TabPane>
  </Tabs>
</template>
