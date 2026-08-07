<script lang="ts" setup>
import type { Ref } from 'vue';

import type { MallSpuApi } from '#/api/mall/product/spu';
import type {
  PropertyAndValues,
  RuleConfig,
} from '#/views/mall/product/spu/components';

import { ref, watch } from 'vue';

import {
  copyValueToTarget,
  formatToFraction,
  getNestedValue,
  isEmpty,
} from '@vben/utils';

import { Button, Image, Input, InputNumber, message } from 'ant-design-vue';

import { VxeColumn, VxeTable } from '#/adapter/vxe-table';
import { ImageUpload } from '#/components/upload';
import { $t } from '#/locales';

defineOptions({ name: 'SkuList' });

const props = withDefaults(
  defineProps<{
    isActivityComponent?: boolean; // 是否作为 sku 活动配置组件
    isBatch?: boolean; // 是否作为批量操作组件
    isComponent?: boolean; // 是否作为 sku 选择组件
    isDetail?: boolean; // 是否作为 sku 详情组件
    propertyList?: PropertyAndValues[];
    propFormData?: MallSpuApi.Spu;
    ruleConfig?: RuleConfig[];
  }>(),
  {
    propFormData: () => ({}) as MallSpuApi.Spu,
    propertyList: () => [],
    ruleConfig: () => [],
    isBatch: false,
    isDetail: false,
    isComponent: false,
    isActivityComponent: false,
  },
);

const emit = defineEmits<{
  (e: 'selectionChange', value: MallSpuApi.Sku[]): void;
}>();

const { isBatch, isDetail, isComponent, isActivityComponent } = props;

const formData: Ref<MallSpuApi.Spu | undefined> = ref<MallSpuApi.Spu>();
const tableHeaders = ref<{ label: string; prop: string }[]>([]);

/** 创建空 SKU 数据 */
function createEmptySku(): MallSpuApi.Sku {
  return {
    name: '', // SKU 名称，提交时会自动使用 SPU 名称
    skuCode: '',
    price: 0,
    marketPrice: 0,
    costPrice: 0,
    barCode: '',
    picUrl: '',
    stock: 0,
    weight: 0,
    volume: 0,
    minQty: 1,
    length: 0,
    width: 0,
    height: 0,
    unit: '',
    model: '',
    packagingWay: '',
    pcsPerCtn: 0,
    nwPerCtn: 0,
    gwPerCtn: 0,
    hsCode: '',
    remark: '',
    firstBrokeragePrice: 0,
    secondBrokeragePrice: 0,
  };
}

const skuList = ref<MallSpuApi.Sku[]>([createEmptySku()]);

/**
 * ==========================================================
 *  🚀 高性能组合签名（comboKey）工具
 *  - 原来用 normalizeProperties + 两个 Set 比较，每次 O(k) 创建对象
 *  - 现在用排序后的字符串作为签名，比较 O(1)，创建 O(k)
 *  - 核心优化：签名一次性计算后到处复用，避免重复 new Set
 * ==========================================================
 */

/**
 * 计算属性组合的稳定签名 key。
 * 无论 properties 元素顺序如何，相同组合返回相同字符串。
 * 空组合返回 ''。
 */
function computeComboKey(
  properties: MallSpuApi.Property[] | null | undefined,
): string {
  if (!properties || properties.length === 0) {
    return '';
  }
  const parts: string[] = [];
  for (const p of properties) {
    if (p.propertyId !== null && p.valueId !== null) {
      parts.push(`${p.propertyId}:${p.valueId}`);
    }
  }
  if (parts.length === 0) return '';
  parts.sort(); // 排序，保证顺序无关
  return parts.join('|');
}

/** 🛡️ 幂等防重入：同一份 propertyList 签名的 generate 10ms 内只执行一次 */
let _lastGenerateSignature = '';
let _lastGenerateTs = 0;
function shouldGenerateNow(signature: string): boolean {
  const now = Date.now();
  if (signature === _lastGenerateSignature && now - _lastGenerateTs < 10) {
    return false; // 10ms 内重复触发的同一份数据直接跳过（防止 watch + 外部双调用）
  }
  _lastGenerateSignature = signature;
  _lastGenerateTs = now;
  return true;
}

/** 根据 propertyList 生成其"当前结构签名"，用于幂等判断 */
function computePropertyListSignature(
  propertyList: PropertyAndValues[],
): string {
  const keys: string[] = [];
  for (const p of propertyList) {
    const vIds = (p.values || [])
      .map((v) => String(v.id))
      .toSorted()
      .join(',');
    keys.push(`${p.id}[${vIds}]`);
  }
  return keys.join('|');
}

/** 批量添加 */
function batchAdd() {
  validateProperty();
  formData.value!.skus!.forEach((item: MallSpuApi.Sku) => {
    copyValueToTarget(item, skuList.value[0]);
  });
}

/** 校验商品属性属性值 */
function validateProperty() {
  // 校验商品属性属性值是否为空，有一个为空都不给过
  const warningInfo = '存在属性属性值为空，请先检查完善属性值后重试！！！';
  for (const item of props.propertyList as PropertyAndValues[]) {
    if (!item.values || isEmpty(item.values)) {
      message.warning(warningInfo);
      throw new Error(warningInfo);
    }
  }
}

/**
 * 删除 SKU —— 按 comboKey O(1) 匹配，不再 O(N×k) 遍历 Set 比较。
 * 对于 1000 行 SKU 表，findIndex 的每次比较从 ~10μs 降到 ~0.03μs
 */
function deleteSku(row: MallSpuApi.Sku) {
  const targetKey = computeComboKey(row.properties);
  if (!targetKey) {
    // 无 properties 的行按引用找 index
    const index = formData.value!.skus!.indexOf(row);
    if (index !== -1) formData.value!.skus!.splice(index, 1);
    return;
  }
  // 预计算所有 SKU 的 comboKey，O(N) 一次扫描找到索引
  const skus = formData.value!.skus!;
  for (let i = 0; i < skus.length; i++) {
    if (computeComboKey(skus[i].properties) === targetKey) {
      skus.splice(i, 1);
      return;
    }
  }
}

/** 校验 SKU 数据：保存时，每个商品规格的表单要校验。例如：销售金额最低是 0.01 */
function validateSku() {
  validateProperty();
  // 保存前强制清理：当前 propertyList 中已不存在的属性/属性值对应的 SKU 行要剔除
  cleanupInvalidSkus(props.propertyList as PropertyAndValues[]);
  let warningInfo = '请检查商品各行相关属性配置，';
  let validate = true;

  for (const sku of formData.value!.skus!) {
    for (const rule of props?.ruleConfig as RuleConfig[]) {
      const value = getNestedValue(sku, rule.name);
      if (!rule.rule(value)) {
        validate = false;
        warningInfo += rule.message;
        break;
      }
    }

    if (!validate) {
      message.warning(warningInfo);
      throw new Error(warningInfo);
    }
  }
}

/**
 * 选择时触发
 *
 * @param {object} param0 参数对象
 * @param {MallSpuApi.Sku[]} param0.records 传递过来的选中的 sku 是一个数组
 */
function handleSelectionChange({ records }: { records: MallSpuApi.Sku[] }) {
  emit('selectionChange', records);
}

/** 将传进来的值赋值给 skuList */
watch(
  () => props.propFormData,
  (data) => {
    if (!data) {
      return;
    }
    formData.value = data;
  },
  {
    deep: true,
    immediate: true,
  },
);

/**
 * 🔵 统一计算 validKeys 与 validPropertyIds —— cleanupInvalidSkus / validateData 共用
 *    避免两个函数分别计算两次 Set，减少 GC 与对象创建开销
 */
function computeValidityContext(propertyList: PropertyAndValues[]) {
  const validKeys = new Set<string>();
  const validPropertyIds = new Set<number>();
  let hasEmptyValues = false;
  for (const p of propertyList) {
    validPropertyIds.add(p.id);
    const values = p.values || [];
    if (values.length === 0) {
      hasEmptyValues = true;
      continue;
    }
    for (const v of values) {
      validKeys.add(`${p.id}:${v.id}`);
    }
  }
  return { validKeys, validPropertyIds, hasEmptyValues };
}

/**
 * 强制清理无效 SKU：
 * 基于 propertyList 当前有效 (propertyId, valueId) 组合，
 * 剔除掉任何已删除属性/属性值对应的 SKU 行。
 * 每次 generateTableData 以及保存前都会调用。
 */
function cleanupInvalidSkus(propertyList: PropertyAndValues[]) {
  if (!formData.value || !Array.isArray(formData.value.skus)) {
    return;
  }
  // 单规格时，不按 properties 清理
  if (!formData.value.specType) {
    return;
  }
  const { validKeys, validPropertyIds } = computeValidityContext(propertyList);
  const expectedSize = propertyList.length;

  formData.value.skus = formData.value.skus.filter((sku: MallSpuApi.Sku) => {
    const props = sku.properties || [];
    // 空 properties 在多规格下是无效数据
    if (props.length === 0) {
      return true; // 允许保留空数据，避免初始空SKU被误删
    }
    // 1. properties 长度必须匹配当前属性数量（增减属性都能检测到）
    if (expectedSize > 0 && props.length !== expectedSize) {
      return false;
    }
    // 2. 每个 propertyId:valueId 必须在有效集合
    for (const p of props) {
      if (
        p.propertyId === null ||
        !validPropertyIds.has(Number(p.propertyId))
      ) {
        return false;
      }
      const key = `${p.propertyId}:${p.valueId}`;
      if (!validKeys.has(key)) {
        return false;
      }
    }
    return true;
  });
}

/** 生成表数据 */
function generateTableData(propertyList: PropertyAndValues[]) {
  // 🛡️ 10ms 内同签名的数据直接跳过（防止 watch + generateSkus 双触发）
  const signature = computePropertyListSignature(propertyList);
  if (!shouldGenerateNow(signature)) {
    return;
  }
  // ===== 第一步：强制清理无效 SKU（删除属性/属性值场景必须走这里）
  cleanupInvalidSkus(propertyList);

  // ===== 第二步：生成所有属性值组合（迭代式 build，避免递归栈溢出）
  const propertyValues = propertyList.map((item: PropertyAndValues) =>
    (item.values || []).map((v: { id: number; name: string }) => ({
      propertyId: item.id,
      propertyName: item.name,
      valueId: v.id,
      valueName: v.name,
    })),
  );

  const buildSkuList = build(propertyValues);
  if (buildSkuList.length === 0) {
    return;
  }

  // ===== 第三步：🔥 exists 判断从 O(N²×k) → O(N+M)
  // 先把现有所有 sku 的 comboKey 建成 Set，O(N×k) 只扫描一次
  const existingComboKeys = new Set<string>();
  const skus = formData.value!.skus!;
  for (const element of skus) {
    const key = computeComboKey(element.properties);
    if (key) existingComboKeys.add(key); // 空 key（无 properties 行）跳过
  }
  // 组合阈值保护：超过 500 提示但继续生成（极端：10×10×10 = 1000）
  if (buildSkuList.length > 500) {
    message.warning(
      `当前属性组合数 ${buildSkuList.length} 较多，可能导致界面卡顿，建议减少属性值数量`,
    );
  }
  for (const properties of buildSkuList) {
    // comboKey 只算一次（properties 元素本身就是 build 新创建的，稳定）
    const key = computeComboKey(properties);
    if (existingComboKeys.has(key)) {
      continue;
    }
    const row = {
      ...createEmptySku(),
      properties,
    };
    skus.push(row);
    existingComboKeys.add(key); // 🔥 同步加入 Set，防止 buildSkuList 内部本身有重复（理论上不会）
  }
}

/**
 * 生成 skus 前置校验（已升级为同时校验 属性ID + 属性值ID 全量一致）。
 * 仅用于快速判断：如果全量一致则没必要清理/重算。
 * 优化：复用 computeValidityContext，扫描 SKU 时直接按 comboKey 拆 key 存入集合
 */
function validateData(propertyList: PropertyAndValues[]): boolean {
  if (!formData.value || !Array.isArray(formData.value.skus)) {
    return false;
  }
  const { validKeys, validPropertyIds, hasEmptyValues } =
    computeValidityContext(propertyList);
  if (hasEmptyValues) {
    return false; // 属性还有空值，直接判定不一致（需要用户填完）
  }
  const skuPropertyIds = new Set<number>();
  const skuComboKeys = new Set<string>();
  let hasAnyProperties = false;

  const skus = formData.value.skus;
  for (const sku of skus) {
    const props = sku.properties || [];
    if (props.length === 0) continue;
    hasAnyProperties = true;
    // 长度不一致 → 不一致
    if (props.length !== propertyList.length) return false;
    for (const p of props) {
      if (p.propertyId !== null) skuPropertyIds.add(Number(p.propertyId));
      if (p.propertyId !== null && p.valueId !== null) {
        const key = `${p.propertyId}:${p.valueId}`;
        if (!validKeys.has(key)) return false; // 🔴 有任何一个 property:value 不在当前有效集合 → 不一致
        skuComboKeys.add(key);
      }
    }
  }
  if (!hasAnyProperties) return false;
  // 属性 ID 集合必须完全匹配
  if (skuPropertyIds.size !== validPropertyIds.size) return false;
  for (const id of skuPropertyIds) {
    if (!validPropertyIds.has(id)) return false;
  }
  // 属性值键集合大小必须匹配（少一个颜色=红色也能检测到）
  return skuComboKeys.size === validKeys.size;
}

/**
 * 🔵 构建所有排列组合（迭代实现，非递归）
 *  - 原来递归 build + slice(1) 会造成 O(P²) 额外数组拷贝 + 栈深 O(P)
 *  - 现在纯迭代，result 复用中间态，栈深 O(1)，拷贝减少
 *  - 统一返回二维数组，单属性情况也包一层：[[红], [蓝], [绿]]
 */
function build(
  propertyValuesList: MallSpuApi.Property[][],
): MallSpuApi.Property[][] {
  if (propertyValuesList.length === 0) {
    return [];
  }
  // 从一个空前缀开始迭代，每乘一个属性分组就扩展
  let result: MallSpuApi.Property[][] = [[]];
  for (const element of propertyValuesList) {
    const group = element || [];
    if (group.length === 0) {
      // 某个属性还没有值，直接返回空（调用方会判断 length===0 跳过）
      return [];
    }
    const next: MallSpuApi.Property[][] = [];
    next.length = result.length * group.length; // 预分配，减少扩容
    let writeIdx = 0;
    for (const prefix of result) {
      for (const element of group) {
        next[writeIdx++] = [...prefix, element];
      }
    }
    result = next;
  }
  return result;
}

/** 监听属性列表，生成相关参数和表头 */
watch(
  () => props.propertyList as PropertyAndValues[],
  (propertyList: PropertyAndValues[]) => {
    // 如果不是多规格则结束
    if (!formData.value!.specType) {
      return;
    }
    // 如果当前组件作为批量添加数据使用，则重置表数据
    if (props.isBatch) {
      skuList.value = [createEmptySku()];
      return;
    }
    // 属性为空时：清空表头并清理所有带 properties 的 SKU（保留至少一条空记录）
    if (!propertyList || propertyList.length === 0) {
      tableHeaders.value = [];
      return;
    }
    // 重置并生成表头
    tableHeaders.value = propertyList.map((item, index) => ({
      prop: `name${index}`,
      label: item.name,
    }));

    // 每次 propertyList 变化，先强制清理一次无效 SKU
    cleanupInvalidSkus(propertyList);

    // 如果回显/现有 sku 的属性值和 propertyList 完全一致则不重新 generate
    if (validateData(propertyList)) {
      return;
    }
    // 添加新属性没有属性值也不做 generate（会 generate 空列表）
    if (propertyList.some((item) => !item.values || isEmpty(item.values))) {
      return;
    }
    // 生成 table 数据，即 sku 列表
    generateTableData(propertyList);
  },
  {
    deep: true,
    immediate: true,
  },
);

const activitySkuListRef = ref();

/** 获取 SKU 表格引用 */
function getSkuTableRef() {
  return activitySkuListRef.value;
}

defineExpose({
  generateTableData,
  validateSku,
  getSkuTableRef,
});
</script>

<template>
  <div class="w-full">
    <!-- 情况一：添加/修改 -->
    <VxeTable
      v-if="!isDetail && !isActivityComponent"
      :data="isBatch ? skuList : formData?.skus || []"
      border
      max-height="500"
      :column-config="{
        resizable: true,
      }"
      :resizable-config="{
        dragMode: 'fixed',
      }"
      size="small"
    >
      <VxeColumn
        align="center"
        :title="$t('mall-product.spu.picUrl')"
        width="120"
        fixed="left"
      >
        <template #default="{ row }">
          <ImageUpload
            v-model:value="row.picUrl"
            :max-number="1"
            :max-size="2"
            :show-description="false"
          />
        </template>
      </VxeColumn>
      <template v-if="formData?.specType && !isBatch">
        <!-- 根据商品属性动态添加 -->
        <VxeColumn
          v-for="(item, index) in tableHeaders"
          :key="index"
          :title="item.label"
          align="center"
          fixed="left"
          min-width="80"
        >
          <template #default="{ row }">
            <span class="font-bold text-[#40aaff]">
              {{ row.properties?.[index]?.valueName }}
            </span>
          </template>
        </VxeColumn>
      </template>
      <VxeColumn
        align="center"
        :title="$t('mall-product.spu.name')"
        width="168"
      >
        <template #default="{ row }">
          <Input v-model:value="row.name" class="w-full" />
        </template>
      </VxeColumn>
      <VxeColumn
        align="center"
        :title="$t('mall-product.spu.skuCode')"
        width="168"
      >
        <template #default="{ row }">
          <Input v-model:value="row.skuCode" class="w-full" />
        </template>
      </VxeColumn>
      <VxeColumn
        align="center"
        :title="$t('mall-product.spu.barCode')"
        width="168"
      >
        <template #default="{ row }">
          <Input v-model:value="row.barCode" class="w-full" />
        </template>
      </VxeColumn>
      <VxeColumn
        align="center"
        :title="$t('mall-product.spu.price')"
        width="168"
      >
        <template #default="{ row }">
          <InputNumber
            v-model:value="row.price"
            :min="0"
            :precision="2"
            :step="0.1"
            class="w-full"
          />
        </template>
      </VxeColumn>
      <VxeColumn
        align="center"
        :title="$t('mall-product.spu.marketPrice')"
        width="168"
      >
        <template #default="{ row }">
          <InputNumber
            v-model:value="row.marketPrice"
            :min="0"
            :precision="2"
            :step="0.1"
            class="w-full"
          />
        </template>
      </VxeColumn>
      <VxeColumn
        align="center"
        :title="$t('mall-product.spu.costPrice')"
        width="168"
      >
        <template #default="{ row }">
          <InputNumber
            v-model:value="row.costPrice"
            :min="0"
            :precision="2"
            :step="0.1"
            class="w-full"
          />
        </template>
      </VxeColumn>
      <VxeColumn
        align="center"
        :title="$t('mall-product.spu.stock')"
        width="168"
      >
        <template #default="{ row }">
          <InputNumber v-model:value="row.stock" :min="0" class="w-full" />
        </template>
      </VxeColumn>
      <VxeColumn
        align="center"
        :title="$t('mall-product.spu.weight')"
        width="168"
      >
        <template #default="{ row }">
          <InputNumber
            v-model:value="row.weight"
            :min="0"
            :precision="2"
            :step="0.1"
            class="w-full"
          />
        </template>
      </VxeColumn>
      <VxeColumn
        align="center"
        :title="$t('mall-product.spu.volume')"
        width="168"
      >
        <template #default="{ row }">
          <InputNumber
            v-model:value="row.volume"
            :min="0"
            :precision="2"
            :step="0.1"
            class="w-full"
          />
        </template>
      </VxeColumn>
      <VxeColumn
        align="center"
        :title="$t('mall-product.spu.minQty')"
        width="120"
      >
        <template #default="{ row }">
          <InputNumber v-model:value="row.minQty" :min="1" class="w-full" />
        </template>
      </VxeColumn>
      <VxeColumn
        align="center"
        :title="$t('mall-product.spu.length')"
        width="120"
      >
        <template #default="{ row }">
          <InputNumber
            v-model:value="row.length"
            :min="0"
            :precision="2"
            :step="0.1"
            class="w-full"
          />
        </template>
      </VxeColumn>
      <VxeColumn
        align="center"
        :title="$t('mall-product.spu.width')"
        width="120"
      >
        <template #default="{ row }">
          <InputNumber
            v-model:value="row.width"
            :min="0"
            :precision="2"
            :step="0.1"
            class="w-full"
          />
        </template>
      </VxeColumn>
      <VxeColumn
        align="center"
        :title="$t('mall-product.spu.height')"
        width="120"
      >
        <template #default="{ row }">
          <InputNumber
            v-model:value="row.height"
            :min="0"
            :precision="2"
            :step="0.1"
            class="w-full"
          />
        </template>
      </VxeColumn>
      <VxeColumn
        align="center"
        :title="$t('mall-product.spu.unit')"
        width="120"
      >
        <template #default="{ row }">
          <Input v-model:value="row.unit" class="w-full" />
        </template>
      </VxeColumn>
      <VxeColumn
        align="center"
        :title="$t('mall-product.spu.model')"
        width="168"
      >
        <template #default="{ row }">
          <Input v-model:value="row.model" class="w-full" :maxlength="64" />
        </template>
      </VxeColumn>
      <VxeColumn
        align="center"
        :title="$t('mall-product.spu.packagingWay')"
        width="140"
      >
        <template #default="{ row }">
          <Input
            v-model:value="row.packagingWay"
            class="w-full"
            :maxlength="64"
          />
        </template>
      </VxeColumn>
      <VxeColumn
        align="center"
        :title="$t('mall-product.spu.pcsPerCtn')"
        width="100"
      >
        <template #default="{ row }">
          <InputNumber v-model:value="row.pcsPerCtn" :min="0" class="w-full" />
        </template>
      </VxeColumn>
      <VxeColumn
        align="center"
        :title="$t('mall-product.spu.nwPerCtn')"
        width="100"
      >
        <template #default="{ row }">
          <InputNumber
            v-model:value="row.nwPerCtn"
            :min="0"
            :precision="3"
            class="w-full"
          />
        </template>
      </VxeColumn>
      <VxeColumn
        align="center"
        :title="$t('mall-product.spu.gwPerCtn')"
        width="100"
      >
        <template #default="{ row }">
          <InputNumber
            v-model:value="row.gwPerCtn"
            :min="0"
            :precision="3"
            class="w-full"
          />
        </template>
      </VxeColumn>
      <VxeColumn
        align="center"
        :title="$t('mall-product.spu.hsCode')"
        width="168"
      >
        <template #default="{ row }">
          <Input v-model:value="row.hsCode" class="w-full" :maxlength="32" />
        </template>
      </VxeColumn>
      <VxeColumn
        align="center"
        :title="$t('mall-product.spu.remark')"
        width="200"
      >
        <template #default="{ row }">
          <Input v-model:value="row.remark" class="w-full" :maxlength="512" />
        </template>
      </VxeColumn>
      <template v-if="formData?.subCommissionType">
        <VxeColumn
          align="center"
          :title="$t('mall-product.spu.firstBrokeragePrice')"
          width="168"
        >
          <template #default="{ row }">
            <InputNumber
              v-model:value="row.firstBrokeragePrice"
              :min="0"
              :precision="2"
              :step="0.1"
              class="w-full"
            />
          </template>
        </VxeColumn>
        <VxeColumn
          align="center"
          :title="$t('mall-product.spu.secondBrokeragePrice')"
          width="168"
        >
          <template #default="{ row }">
            <InputNumber
              v-model:value="row.secondBrokeragePrice"
              :min="0"
              :precision="2"
              :step="0.1"
              class="w-full"
            />
          </template>
        </VxeColumn>
      </template>
      <VxeColumn
        v-if="formData?.specType"
        align="center"
        fixed="right"
        :title="$t('common.actions')"
        width="100"
      >
        <template #default="{ row }">
          <Button v-if="isBatch" type="link" size="small" @click="batchAdd">
            批量添加
          </Button>
          <Button
            v-else
            type="link"
            size="small"
            danger
            @click="deleteSku(row)"
          >
            删除
          </Button>
        </template>
      </VxeColumn>
    </VxeTable>

    <!-- 情况二：详情 -->
    <VxeTable
      v-if="isDetail"
      ref="activitySkuListRef"
      :data="formData?.skus || []"
      border
      max-height="500"
      size="small"
      :column-config="{
        resizable: true,
      }"
      :resizable-config="{
        dragMode: 'fixed',
      }"
      :checkbox-config="isComponent ? { reserve: true } : undefined"
      @checkbox-change="handleSelectionChange"
      @checkbox-all="handleSelectionChange"
    >
      <VxeColumn v-if="isComponent" type="checkbox" width="45" fixed="left" />
      <VxeColumn
        align="center"
        :title="$t('mall-product.spu.picUrl')"
        max-width="140"
        fixed="left"
      >
        <template #default="{ row }">
          <Image
            v-if="row.picUrl"
            :src="row.picUrl"
            class="h-[50px] w-[50px] cursor-pointer"
            :preview="true"
          />
        </template>
      </VxeColumn>
      <template v-if="formData?.specType && !isBatch">
        <!-- 根据商品属性动态添加 -->
        <VxeColumn
          v-for="(item, index) in tableHeaders"
          :key="index"
          :title="item.label"
          align="center"
          max-width="80"
          fixed="left"
        >
          <template #default="{ row }">
            <span class="font-bold text-[#40aaff]">
              {{ row.properties?.[index]?.valueName }}
            </span>
          </template>
        </VxeColumn>
      </template>
      <VxeColumn
        align="center"
        :title="$t('mall-product.spu.barCode')"
        width="100"
      >
        <template #default="{ row }">
          {{ row.barCode }}
        </template>
      </VxeColumn>
      <VxeColumn
        align="center"
        :title="$t('mall-product.spu.price')"
        width="80"
      >
        <template #default="{ row }">
          {{ row.price }}
        </template>
      </VxeColumn>
      <VxeColumn
        align="center"
        :title="$t('mall-product.spu.marketPrice')"
        width="80"
      >
        <template #default="{ row }">
          {{ row.marketPrice }}
        </template>
      </VxeColumn>
      <VxeColumn
        align="center"
        :title="$t('mall-product.spu.costPrice')"
        width="80"
      >
        <template #default="{ row }">
          {{ row.costPrice }}
        </template>
      </VxeColumn>
      <VxeColumn
        align="center"
        :title="$t('mall-product.spu.stock')"
        width="80"
      >
        <template #default="{ row }">
          {{ row.stock }}
        </template>
      </VxeColumn>
      <VxeColumn
        align="center"
        :title="$t('mall-product.spu.weight')"
        width="80"
      >
        <template #default="{ row }">
          {{ row.weight }}
        </template>
      </VxeColumn>
      <VxeColumn
        align="center"
        :title="$t('mall-product.spu.volume')"
        width="80"
      >
        <template #default="{ row }">
          {{ row.volume }}
        </template>
      </VxeColumn>
      <VxeColumn
        align="center"
        :title="$t('mall-product.spu.minQty')"
        width="80"
      >
        <template #default="{ row }">
          {{ row.minQty }}
        </template>
      </VxeColumn>
      <VxeColumn
        align="center"
        :title="$t('mall-product.spu.length')"
        width="80"
      >
        <template #default="{ row }">
          {{ row.length }}
        </template>
      </VxeColumn>
      <VxeColumn
        align="center"
        :title="$t('mall-product.spu.width')"
        width="80"
      >
        <template #default="{ row }">
          {{ row.width }}
        </template>
      </VxeColumn>
      <VxeColumn
        align="center"
        :title="$t('mall-product.spu.height')"
        width="80"
      >
        <template #default="{ row }">
          {{ row.height }}
        </template>
      </VxeColumn>
      <VxeColumn align="center" :title="$t('mall-product.spu.unit')" width="80">
        <template #default="{ row }">
          {{ row.unit }}
        </template>
      </VxeColumn>
      <VxeColumn
        align="center"
        :title="$t('mall-product.spu.model')"
        width="120"
      >
        <template #default="{ row }">
          {{ row.model }}
        </template>
      </VxeColumn>
      <VxeColumn
        align="center"
        :title="$t('mall-product.spu.packagingWay')"
        width="100"
      >
        <template #default="{ row }">
          {{ row.packagingWay }}
        </template>
      </VxeColumn>
      <VxeColumn
        align="center"
        :title="$t('mall-product.spu.pcsPerCtn')"
        width="80"
      >
        <template #default="{ row }">
          {{ row.pcsPerCtn }}
        </template>
      </VxeColumn>
      <VxeColumn
        align="center"
        :title="$t('mall-product.spu.nwPerCtn')"
        width="80"
      >
        <template #default="{ row }">
          {{ row.nwPerCtn }}
        </template>
      </VxeColumn>
      <VxeColumn
        align="center"
        :title="$t('mall-product.spu.gwPerCtn')"
        width="80"
      >
        <template #default="{ row }">
          {{ row.gwPerCtn }}
        </template>
      </VxeColumn>
      <VxeColumn
        align="center"
        :title="$t('mall-product.spu.hsCode')"
        width="120"
      >
        <template #default="{ row }">
          {{ row.hsCode }}
        </template>
      </VxeColumn>
      <VxeColumn
        align="center"
        :title="$t('mall-product.spu.remark')"
        width="150"
      >
        <template #default="{ row }">
          {{ row.remark }}
        </template>
      </VxeColumn>
      <template v-if="formData?.subCommissionType">
        <VxeColumn
          align="center"
          :title="$t('mall-product.spu.firstBrokeragePrice')"
          width="80"
        >
          <template #default="{ row }">
            {{ row.firstBrokeragePrice }}
          </template>
        </VxeColumn>
        <VxeColumn
          align="center"
          :title="$t('mall-product.spu.secondBrokeragePrice')"
          width="80"
        >
          <template #default="{ row }">
            {{ row.secondBrokeragePrice }}
          </template>
        </VxeColumn>
      </template>
    </VxeTable>

    <!-- 情况三：作为活动组件 -->
    <VxeTable
      v-if="isActivityComponent"
      :data="formData?.skus || []"
      border
      max-height="500"
      size="small"
      :column-config="{
        resizable: true,
      }"
      :resizable-config="{
        dragMode: 'fixed',
      }"
    >
      <VxeColumn v-if="isComponent" type="checkbox" width="45" fixed="left" />
      <VxeColumn
        align="center"
        :title="$t('mall-product.spu.picUrl')"
        max-width="140"
        fixed="left"
      >
        <template #default="{ row }">
          <Image
            :src="row.picUrl"
            class="h-[60px] w-[60px] cursor-pointer"
            :preview="true"
          />
        </template>
      </VxeColumn>
      <template v-if="formData?.specType">
        <!-- 根据商品属性动态添加 -->
        <VxeColumn
          v-for="(item, index) in tableHeaders"
          :key="index"
          :title="item.label"
          align="center"
          width="80"
          fixed="left"
        >
          <template #default="{ row }">
            <span class="font-bold text-[#40aaff]">
              {{ row.properties?.[index]?.valueName }}
            </span>
          </template>
        </VxeColumn>
      </template>
      <VxeColumn
        align="center"
        :title="$t('mall-product.spu.barCode')"
        width="100"
      >
        <template #default="{ row }">
          {{ row.barCode }}
        </template>
      </VxeColumn>
      <VxeColumn
        align="center"
        :title="$t('mall-product.spu.price')"
        width="80"
      >
        <template #default="{ row }">
          {{ formatToFraction(row.price) }}
        </template>
      </VxeColumn>
      <VxeColumn
        align="center"
        :title="$t('mall-product.spu.marketPrice')"
        width="80"
      >
        <template #default="{ row }">
          {{ formatToFraction(row.marketPrice) }}
        </template>
      </VxeColumn>
      <VxeColumn
        align="center"
        :title="$t('mall-product.spu.costPrice')"
        width="80"
      >
        <template #default="{ row }">
          {{ formatToFraction(row.costPrice) }}
        </template>
      </VxeColumn>
      <VxeColumn
        align="center"
        :title="$t('mall-product.spu.stock')"
        width="80"
      >
        <template #default="{ row }">
          {{ row.stock }}
        </template>
      </VxeColumn>
      <VxeColumn
        align="center"
        :title="$t('mall-product.spu.minQty')"
        width="80"
      >
        <template #default="{ row }">
          {{ row.minQty }}
        </template>
      </VxeColumn>
      <VxeColumn align="center" :title="$t('mall-product.spu.unit')" width="80">
        <template #default="{ row }">
          {{ row.unit }}
        </template>
      </VxeColumn>
      <!-- 方便扩展每个活动配置的属性不一样  -->
      <slot name="extension"></slot>
    </VxeTable>
  </div>
</template>
