<!-- 商品发布 - 库存价格 - 添加属性 -->
<script lang="ts" setup>
import type { VbenFormSchema } from '#/adapter/form';
import type { MallPropertyApi } from '#/api/mall/product/property';
import type { PropertyAndValues } from '#/views/mall/product/spu/components';

import { ref, watch } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import {
  createProperty,
  getPropertySimpleList,
} from '#/api/mall/product/property';
import { $t } from '#/locales';

defineOptions({ name: 'ProductPropertyAddForm' });

const props = withDefaults(
  defineProps<{
    propertyList?: PropertyAndValues[];
  }>(),
  {
    propertyList: () => [],
  },
);

const emit = defineEmits<{
  (e: 'success', list: PropertyAndValues[]): void;
}>();

const attributeList = ref<PropertyAndValues[]>([]); // 商品属性列表
const attributeOptions = ref<MallPropertyApi.Property[]>([]); // 商品属性名称下拉框
const attributeOptionsLoaded = ref(false); // 是否已加载 attributeOptions

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

/** 预加载属性下拉选项，避免用户不点开下拉直接输入时 attributeOptions 为空 */
async function ensureAttributeOptions(): Promise<void> {
  if (attributeOptionsLoaded.value) {
    return;
  }
  try {
    attributeOptions.value = await getPropertySimpleList();
    attributeOptionsLoaded.value = true;
  } catch {
    attributeOptionsLoaded.value = false;
  }
}

const formSchema: VbenFormSchema[] = [
  {
    fieldName: 'name',
    label: $t('mall-product.property.name'),
    component: 'ApiSelect',
    componentProps: {
      api: async () => {
        const data = await getPropertySimpleList();
        attributeOptions.value = data;
        attributeOptionsLoaded.value = true;
        return data.map((item: MallPropertyApi.Property) => ({
          label: item.name,
          value: item.name,
        }));
      },
      showSearch: true,
      filterOption: true,
      placeholder: $t('mall-product.property.placeholder.name'),
      mode: 'tags',
      allowClear: true,
    },
    rules: 'required',
  },
];

const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 80,
  },
  layout: 'horizontal',
  schema: formSchema,
  showDefaultActions: false,
});

const [Modal, modalApi] = useVbenModal({
  destroyOnClose: true,
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) {
      return;
    }
    modalApi.lock();
    const values = await formApi.getValues();
    const names = values.name;
    if (!names || names.length === 0) {
      modalApi.unlock();
      return;
    }
    // 预加载属性选项，避免用户不点开下拉直接输入时 attributeOptions 为空
    await ensureAttributeOptions();
    // 🔴 关键：重复添加校验必须直接读最新的 props.propertyList，
    //    不能依赖本地 attributeList.value 缓存，避免 watch 尚未同步造成的误判
    const currentPropList = props.propertyList || [];
    for (const name of names) {
      for (const attrItem of currentPropList) {
        if (attrItem.name === name) {
          message.error('该属性已存在，请勿重复添加');
          modalApi.unlock();
          return;
        }
      }
    }
    // 也和本地 attributeList 去一次重（双保险）
    const mergedList: any[] = [...currentPropList];
    const existingNames = new Set(mergedList.map((a) => a.name));

    for (const name of names) {
      if (existingNames.has(name)) {
        continue; // 二次防御，跳过已添加的同名属性
      }
      const existProperty = attributeOptions.value.find(
        (item: MallPropertyApi.Property) => item.name === name,
      );
      if (existProperty) {
        // 情况一：如果属性已存在系统字典中，则直接使用
        const newItem = {
          id: Number(existProperty.id),
          name,
          values: [],
        };
        mergedList.push(newItem);
        attributeList.value.push(newItem);
        existingNames.add(name);
      } else {
        // 情况二：如果是不存在的属性，则需要执行新增
        const response = await createProperty({ name });
        const idValue =
          typeof response === 'number'
            ? response
            : (response?.data ?? response?.id);
        if (!idValue) {
          throw new Error(`创建属性 "${name}" 失败，未能获取到有效的ID`);
        }
        const newItem = {
          id: idValue as number,
          name,
          values: [],
        };
        mergedList.push(newItem);
        attributeList.value.push(newItem);
        existingNames.add(name);
      }
    }
    message.success($t('ui.actionMessage.operationSuccess'));
    modalApi.unlock();
    await modalApi.close();
    // 传出 mergedList（基于 props.propertyList 最新值 + 本次新增元素），
    // 而不要用本地 attributeList.value，可能引用未同步造成丢元素
    emit('success', mergedList);
  },
  async onOpenChange(isOpen: boolean) {
    if (!isOpen) {
      return;
    }
    // 🛡️ 强制同步：Modal 打开时立刻用 props.propertyList 最新值覆盖本地 attributeList，
    //    防止 Vue deep watch 的异步时序导致本地缓存仍是"删除属性前"的旧数组
    attributeList.value = props.propertyList || [];
    // 打开时预加载属性列表，避免用户不点开下拉就输入导致的判空
    await ensureAttributeOptions();
    await formApi.resetForm();
  },
});
</script>

<template>
  <Modal :title="$t('mall-product.property.actions.createProperty')">
    <Form />
  </Modal>
</template>
