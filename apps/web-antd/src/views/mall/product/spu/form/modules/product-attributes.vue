<!-- 商品发布 - 库存价格 - 属性列表 -->
<script lang="ts" setup>
import type { MallPropertyApi } from '#/api/mall/product/property';
import type { PropertyAndValues } from '#/views/mall/product/spu/components';

import { computed, ref, watch } from 'vue';

import { IconifyIcon } from '@vben/icons';

import { Col, Divider, message, Select, Tag } from 'ant-design-vue';

import {
  createPropertyValue,
  getPropertyValueSimpleList,
} from '#/api/mall/product/property';
import { $t } from '#/locales';

defineOptions({ name: 'ProductAttributes' });

const props = withDefaults(defineProps<Props>(), {
  propertyList: () => [],
  isDetail: false,
});

const emit = defineEmits(['success']);

interface Props {
  propertyList?: PropertyAndValues[];
  isDetail?: boolean;
}

const inputValue = ref<string[]>([]); // 输入框值（tags 模式使用数组）
/** 当前激活输入框的属性ID（不再使用 index 避免删除错位） */
const activeAttributeId = ref<number | null>(null);

/** 通过 attribute.id 判断是否显示输入框，避免 index 做 key 导致的错位 */
const inputVisible = computed(() => (attr: PropertyAndValues) => {
  return activeAttributeId.value === attr.id;
});

interface InputRefMap {
  [attributeId: number]: any;
}

/** 使用 Map 存储输入框引用，使用 attributeId 作为 key，删除/重排不影响 */
const inputRefMap = ref<InputRefMap>({});

/** 记录 attributeId 对应 DOM，避免 v-for 用 index 做 key 导致 ref 获取错位 */
function setInputRefByAttribute(el: any, attributeId: number) {
  if (el === null || el === undefined) {
    return;
  }
  inputRefMap.value[attributeId] = el;
}

const attributeList = ref<PropertyAndValues[]>([]); // 商品属性列表
const attributeOptions = ref<MallPropertyApi.PropertyValue[]>([]); // 商品属性值下拉框

watch(
  () => props.propertyList,
  (data) => {
    if (!data) {
      return;
    }
    attributeList.value = data;
  },
  {
    deep: true,
    immediate: true,
  },
);

/** 通过 attribute.id 在列表中查找当前索引（防御式写法，顺序变动仍能找到）*/
function findAttributeIndex(attributeId: number): number {
  return attributeList.value.findIndex((attr) => attr.id === attributeId);
}

/** 删除属性值：传入 attribute 对象而非 index，避免重排后索引错误 */
function handleCloseValue(attribute: PropertyAndValues, value: PropertyAndValues) {
  const attr = attributeList.value.find((a) => a.id === attribute.id);
  if (!attr || !attr.values) {
    return;
  }
  attr.values = attr.values.filter((item) => item.id !== value.id);
  emit('success', [...attributeList.value]);
}

/** 删除属性 */
function handleCloseProperty(item: PropertyAndValues) {
  attributeList.value = attributeList.value.filter(
    (attribute) => attribute.id !== item.id,
  );
  // 如果删除的是当前激活输入框对应的属性，清理 active id
  if (activeAttributeId.value === item.id) {
    activeAttributeId.value = null;
    inputValue.value = [];
  }
  emit('success', [...attributeList.value]);
}

/** 显示输入框并获取焦点：传入 attribute 对象，内部以 id 定位 */
async function showInput(attribute: PropertyAndValues) {
  activeAttributeId.value = attribute.id;
  await getAttributeOptions(attribute.id);
  // 以 attribute.id 为 key 从 Map 中取 ref，再 focus
  const input = inputRefMap.value[attribute.id];
  if (input && typeof input.focus === 'function') {
    // 下一帧执行，确保 v-show 已切换
    setTimeout(() => input.focus(), 0);
  }
}

/** 添加属性值确认 */
async function handleInputConfirm(attribute: PropertyAndValues) {
  // 从数组中取最后一个输入的值（tags 模式下 inputValue 是数组）
  const currentValue = inputValue.value?.[inputValue.value.length - 1]?.trim();
  const index = findAttributeIndex(attribute.id);
  if (index === -1) {
    activeAttributeId.value = null;
    inputValue.value = [];
    return;
  }
  const propertyId = attribute.id;

  if (currentValue) {
    // 1. 重复添加校验：必须以 props.propertyList 作为基准（防止本地引用不同步）
    const propAttr = (props.propertyList || []).find(
      (a: PropertyAndValues) => a.id === attribute.id,
    );
    const dupFromProp = propAttr?.values?.some(
      (item: any) => item.name === currentValue,
    );
    const dupFromLocal = attributeList.value?.[index]?.values?.find(
      (item) => item.name === currentValue,
    );
    if (dupFromProp || dupFromLocal) {
      message.warning('已存在相同属性值，请重试');
      activeAttributeId.value = null;
      inputValue.value = [];
      return;
    }

    // 2.1 情况一：属性值已存在，则直接使用并结束
    const existValue = attributeOptions.value.find(
      (item) => item.name === currentValue,
    );
    if (existValue) {
      activeAttributeId.value = null;
      inputValue.value = [];
      attributeList.value?.[index]?.values?.push({
        id: existValue.id!,
        name: existValue.name,
      });
      emit('success', [...attributeList.value]);
      return;
    }

    // 2.2 情况二：新属性值，则进行保存
    try {
      const id = await createPropertyValue({
        propertyId,
        name: currentValue,
      });
      attributeList.value?.[index]?.values?.push({
        id,
        name: currentValue,
      });
      message.success($t('ui.actionMessage.operationSuccess'));
      emit('success', [...attributeList.value]);
    } catch {
      message.error($t('ui.actionMessage.operationFailed'));
    }
  }
  activeAttributeId.value = null;
  inputValue.value = [];
}

/** 获取商品属性下拉选项 */
async function getAttributeOptions(propertyId: number) {
  attributeOptions.value = await getPropertyValueSimpleList(propertyId);
}
</script>

<template>
  <Col v-for="attribute in attributeList" :key="attribute.id">
    <Divider class="my-3" />
    <div class="mt-2 flex flex-wrap items-center gap-2">
      <span class="mx-1">属性名：</span>
      <Tag
        :closable="!isDetail"
        class="mx-1"
        color="success"
        @close="handleCloseProperty(attribute)"
      >
        {{ attribute.name }}
      </Tag>
    </div>
    <div class="mt-2 flex flex-wrap items-center gap-2">
      <span class="mx-1">属性值：</span>
      <Tag
        v-for="value in attribute.values"
        :key="value.id"
        :closable="!isDetail"
        class="mx-1"
        @close="handleCloseValue(attribute, value)"
      >
        {{ value?.name }}
      </Tag>
      <Select
        v-show="inputVisible(attribute)"
        :id="`input-attr-${attribute.id}`"
        :ref="(el) => setInputRefByAttribute(el, attribute.id)"
        v-model:value="inputValue"
        allow-clear
        mode="tags"
        :max-tag-count="1"
        :filter-option="true"
        size="small"
        style="width: 100px"
        @blur="handleInputConfirm(attribute)"
        @change="handleInputConfirm(attribute)"
        @keyup.enter="handleInputConfirm(attribute)"
      >
        <Select.Option
          v-for="item2 in attributeOptions"
          :key="item2.id"
          :value="item2.name"
        >
          {{ item2.name }}
        </Select.Option>
      </Select>
      <Tag
        v-show="!inputVisible(attribute)"
        v-if="!isDetail"
        @click="showInput(attribute)"
        class="mx-1 border-dashed bg-gray-100"
      >
        <div class="flex items-center">
          <IconifyIcon class="mr-2" icon="lucide:plus" />
          添加
        </div>
      </Tag>
    </div>
  </Col>
</template>
