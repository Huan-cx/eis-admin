<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { B2BQuotationApi } from '#/api/mall/trade/b2b/quotation';
import type { B2BRfqApi } from '#/api/mall/trade/b2b/rfq';

import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { Page } from '@vben/common-ui';
import { useTabs } from '@vben/hooks';
import { fenToYuan, yuanToFen } from '@vben/utils';

import {
  Button,
  Card,
  Descriptions,
  Input,
  InputNumber,
  message,
  Select,
  Space,
} from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getSimpleSupplierList } from '#/api/mall/product/supplier';
import {
  createQuotation,
  getQuotation,
  submitQuotationForReview,
  updateQuotation,
} from '#/api/mall/trade/b2b/quotation';
import { getRfq } from '#/api/mall/trade/b2b/rfq';
import { $t } from '#/locales';

import {
  useFeeItemsColumns,
  useQuotationFormSchema,
  useQuotationItemsColumns,
} from './data';

const route = useRoute();
const router = useRouter();
const tabs = useTabs();

const loading = ref(false);

// 将 validUntil 时间戳转换为天数
function calculateValidDays(validUntil?: number): number | undefined {
  if (!validUntil) return undefined;
  const now = Date.now();
  const diff = validUntil - now;
  if (diff <= 0) return 0;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}
const isEdit = ref(false);
const rfqDetail = ref<B2BRfqApi.RfqDetail | null>(null);
const quotationDetail = ref<B2BQuotationApi.QuotationDetail | null>(null);
const supplierList = ref<Array<{ id?: number; name: string }>>([]);

const itemsData = ref<any[]>([]);
const feeItemsData = ref<any[]>([]);

const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 120,
  },
  layout: 'horizontal',
  schema: useQuotationFormSchema(),
  showDefaultActions: false,
});

const [ItemsGrid, itemsGridApi] = useVbenVxeGrid({
  gridOptions: {
    editConfig: {
      trigger: 'click',
      mode: 'cell',
    },
    columns: useQuotationItemsColumns(),
    data: [],
    minHeight: 200,
    height: 'auto',
    keepSource: true,
    border: true,
    rowConfig: {
      keyField: '_XID',
      isHover: true,
    },
    pagerConfig: {
      enabled: false,
    },
    toolbarConfig: {
      enabled: false,
    },
  } as VxeTableGridOptions<any>,
});

const [FeeItemsGrid, feeItemsGridApi] = useVbenVxeGrid({
  gridOptions: {
    editConfig: {
      trigger: 'click',
      mode: 'cell',
      showStatus: true,
    },
    columns: useFeeItemsColumns(),
    data: [],
    minHeight: 200,
    height: 'auto',
    keepSource: true,
    border: true,
    rowConfig: {
      keyField: '_XID',
      isHover: true,
    },
    pagerConfig: {
      enabled: false,
    },
    toolbarConfig: {
      enabled: false,
    },
    events: {
      editClosed: ({ row }: { row: Record<string, any> }) => {
        // 同步编辑后的数据到 feeItemsData
        const index = feeItemsData.value.findIndex(
          (item) => item._XID === row._XID,
        );
        if (index !== -1) {
          feeItemsData.value[index] = { ...row };
        }
      },
    },
  } as VxeTableGridOptions<any>,
});

/** 监听商品数据变化，加载到表格 */
watch(
  () => itemsData.value,
  async (items) => {
    if (!items) return;
    await nextTick();
    await itemsGridApi.grid?.reloadData(items);
  },
  { deep: true },
);

/** 监听费用数据变化，加载到表格 */
watch(
  () => feeItemsData.value,
  async (items) => {
    if (!items) return;
    await nextTick();
    await feeItemsGridApi.grid?.reloadData(items);
  },
  { deep: true },
);

const itemsTotal = computed(() => {
  const items = itemsData.value || [];
  return items.reduce((sum: number, item: any) => {
    return sum + (item.supplierPrice || 0) * (item.count || 0);
  }, 0);
});

const feesTotal = computed(() => {
  const feeItems = feeItemsData.value || [];
  return feeItems.reduce((sum: number, item: any) => {
    return sum + (item.amount || 0);
  }, 0);
});

const totalPrice = computed(() => {
  return itemsTotal.value + feesTotal.value;
});

// 添加费用项目
function handleAddFeeItem() {
  const newRow = {
    feeType: 'FREIGHT',
    feeName: '',
    amount: 0,
    description: '',
    optional: false,
  };
  feeItemsGridApi.grid?.insertAt(newRow, -1);
  // 同步到 feeItemsData
  feeItemsData.value.push(newRow);
}

// 删除费用项目
function handleDeleteFeeItem(row: any) {
  feeItemsGridApi.grid?.remove(row);
  // 同步从 feeItemsData 移除
  const index = feeItemsData.value.findIndex((item) => item._XID === row._XID);
  if (index !== -1) {
    feeItemsData.value.splice(index, 1);
  }
}

// 商品供应价变动时转换为分值存储
function handleSupplierPriceChange(row: any, value: any) {
  if (value === null || value === undefined) return;
  row.supplierPrice = yuanToFen(value);
  // 触发表格刷新，确保小计和总金额计算正确
  itemsGridApi.setGridOptions({ data: [...itemsData.value] });
}

// 费用金额变动时转换为分值存储，并同步更新 feeItemsData
function handleFeeAmountChange(row: any, value: any) {
  if (value === null || value === undefined) return;
  row.amount = yuanToFen(value);

  // 同步更新 feeItemsData，确保价格汇总正确计算
  const index = feeItemsData.value.findIndex((item) => item._XID === row._XID);
  if (index !== -1) {
    feeItemsData.value[index] = { ...row };
  }

  // 触发表格刷新
  feeItemsGridApi.setGridOptions({ data: [...feeItemsData.value] });
}

async function handleSaveDraft() {
  const { valid } = await formApi.validate();
  if (!valid) {
    return;
  }

  loading.value = true;
  try {
    const formData = await formApi.getValues();
    const items = itemsData.value.map((item: any) => ({
      ...item,
      totalPrice: (item.supplierPrice || 0) * (item.count || 0),
    }));
    const feeItems = feeItemsData.value;

    const supplier = supplierList.value.find(
      (s) => s.id === formData.supplierId,
    );

    const data: B2BQuotationApi.CreateQuotationReqVO = {
      rfqId: Number(formData.rfqId),
      supplierId: Number(formData.supplierId),
      supplierName: supplier?.name || quotationDetail.value?.supplierName || '',
      items,
      feeItems,
      currency: formData.currency,
      validDays: Number(formData.validDays),
      remark: formData.remark,
    };

    if (isEdit.value) {
      await updateQuotation(quotationDetail.value!.id, data);
      message.success(
        $t('ui.actionMessage.updateSuccess', [$t('common.quotation')]),
      );
    } else {
      await createQuotation(data);
      message.success(
        $t('ui.actionMessage.createSuccess', [$t('common.quotation')]),
      );
    }

    router.back();
  } catch (error) {
    console.error($t('trade.b2b.quotation.actionMessage.saveFailed'), error);
  } finally {
    loading.value = false;
  }
}

async function handleSubmitReview() {
  const { valid } = await formApi.validate();
  if (!valid) {
    return;
  }

  loading.value = true;
  try {
    const formData = await formApi.getValues();
    const items = itemsData.value.map((item: any) => ({
      ...item,
      totalPrice: (item.supplierPrice || 0) * (item.count || 0),
    }));
    const feeItems = feeItemsData.value;

    const supplier = supplierList.value.find(
      (s) => s.id === formData.supplierId,
    );

    const data: B2BQuotationApi.CreateQuotationReqVO = {
      rfqId: Number(formData.rfqId),
      supplierId: Number(formData.supplierId),
      supplierName: supplier?.name || quotationDetail.value?.supplierName || '',
      items,
      feeItems,
      currency: formData.currency,
      validDays: Number(formData.validDays),
      remark: formData.remark,
    };

    let quotationId = quotationDetail.value?.id;
    if (quotationId) {
      await updateQuotation(quotationId, data);
    } else {
      const result = await createQuotation(data);
      quotationId = result.id;
    }

    await submitQuotationForReview(quotationId!);
    message.success(
      $t('trade.b2b.quotation.actionMessage.submitReviewSuccess'),
    );

    router.back();
  } catch (error) {
    console.error(
      $t('trade.b2b.quotation.actionMessage.submitReviewFailed'),
      error,
    );
  } finally {
    loading.value = false;
  }
}

function handleBack() {
  tabs.closeCurrentTab();
  router.back();
}

async function initData() {
  const rfqId = Number(route.query.rfqId);
  const quotationId = Number(route.params.id);

  loading.value = true;
  try {
    supplierList.value = await getSimpleSupplierList();

    if (quotationId) {
      isEdit.value = true;
      const result = await getQuotation(quotationId);
      quotationDetail.value = result;
      rfqDetail.value = await getRfq(result.rfqId);

      await formApi.setValues({
        id: result.id,
        no: result.no,
        rfqId: result.rfqId,
        rfqNo: result.rfqNo,
        supplierId: result.supplierId,
        supplierName: result.supplierName,
        currency: result.currency,
        validDays: result.validDays ?? calculateValidDays(result.validUntil),
        remark: result.remark,
      });

      // 更新响应式数据，触发 watch 加载表格
      itemsData.value = (result.items || []).map((item: any) => ({
        ...item,
        supplierPrice: item.supplierPrice || 0,
        subtotal: item.totalPrice || (item.supplierPrice || 0) * item.count,
      }));
      feeItemsData.value = result.feeItems || [];
    } else if (rfqId) {
      isEdit.value = false;
      rfqDetail.value = await getRfq(rfqId);

      await formApi.setValues({
        rfqId,
        rfqNo: rfqDetail.value?.no,
        supplierId: rfqDetail.value?.supplierId,
        supplierName: rfqDetail.value?.supplierName,
        currency: 'CNY',
      });

      const items =
        rfqDetail.value?.items?.map((item: any) => ({
          skuId: item.skuId,
          spuId: item.spuId,
          spuName: item.spuName,
          skuName: item.skuName,
          picUrl: item.picUrl,
          count: item.count,
          supplierPrice: 0,
          subtotal: 0,
          supplierId: rfqDetail.value?.supplierId,
          supplierName: rfqDetail.value?.supplierName,
        })) || [];

      // 更新响应式数据，触发 watch 加载表格
      itemsData.value = items;
    }
  } catch (error) {
    console.error(
      $t('trade.b2b.quotation.actionMessage.initDataFailed'),
      error,
    );
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  initData();
});
</script>

<template>
  <Page auto-content-height :loading="loading">
    <template #extra>
      <Space>
        <Button @click="handleBack">{{ $t('common.back') }}</Button>
        <Button :loading="loading" @click="handleSaveDraft">
          {{ $t('common.save') }}
        </Button>
        <Button type="primary" :loading="loading" @click="handleSubmitReview">
          {{ $t('trade.b2b.quotation.actions.submitReview') }}
        </Button>
      </Space>
    </template>

    <div class="space-y-6 p-4">
      <Card :title="$t('trade.b2b.quotation.formPage.basicInfo')">
        <Form />
      </Card>

      <Card :title="$t('trade.b2b.quotation.formPage.productQuotation')">
        <ItemsGrid class="items-grid">
          <template #picUrl="{ row }">
            <img
              v-if="row.picUrl"
              :src="row.picUrl"
              class="h-10 w-10 rounded object-cover"
            />
            <span v-else>-</span>
          </template>
          <template #supplierId="{ row }">
            <Select
              v-model:value="row.supplierId"
              :options="
                supplierList.map((s) => ({ label: s.name, value: s.id }))
              "
              class="w-full"
              :placeholder="$t('trade.b2b.quotation.formPage.selectSupplier')"
            />
          </template>
          <template #supplierPrice="{ row }">
            <InputNumber
              :value="fenToYuan(row.supplierPrice)"
              :min="0"
              :precision="2"
              :step="0.01"
              class="w-full"
              @change="(val: any) => handleSupplierPriceChange(row, val)"
            />
          </template>
          <template #subtotal="{ row }">
            {{ fenToYuan(row.supplierPrice * row.count) }}
          </template>
        </ItemsGrid>
      </Card>

      <Card :title="$t('trade.b2b.quotation.formPage.feeItems')">
        <template #extra>
          <Button type="primary" size="small" @click="handleAddFeeItem">
            {{ $t('trade.b2b.quotation.formPage.addFee') }}
          </Button>
        </template>
        <FeeItemsGrid>
          <template #feeType="{ row }">
            <Select
              v-model:value="row.feeType"
              :options="[
                {
                  label: $t('trade.b2b.quotation.feeType.freight'),
                  value: 'FREIGHT',
                },
                {
                  label: $t('trade.b2b.quotation.feeType.insurance'),
                  value: 'INSURANCE',
                },
                {
                  label: $t('trade.b2b.quotation.feeType.customs'),
                  value: 'CUSTOMS',
                },
                {
                  label: $t('trade.b2b.quotation.feeType.other'),
                  value: 'OTHER',
                },
              ]"
              class="w-full"
            />
          </template>
          <template #feeName="{ row }">
            <Input v-model:value="row.feeName" class="w-full" />
          </template>
          <template #amount="{ row }">
            <InputNumber
              :value="fenToYuan(row.amount)"
              :min="0"
              :precision="2"
              :step="0.01"
              class="w-full"
              @change="(val: any) => handleFeeAmountChange(row, val)"
            />
          </template>
          <template #description="{ row }">
            <Input v-model:value="row.description" class="w-full" />
          </template>
          <template #actions="{ row }">
            <Button
              type="link"
              danger
              size="small"
              @click="handleDeleteFeeItem(row)"
            >
              {{ $t('common.delete') }}
            </Button>
          </template>
        </FeeItemsGrid>
      </Card>

      <Card :title="$t('trade.b2b.quotation.formPage.priceSummary')">
        <Descriptions :column="3" bordered size="middle">
          <Descriptions.Item
            :label="$t('trade.b2b.quotation.formPage.totalProductAmount')"
          >
            <span> ¥{{ fenToYuan(itemsTotal) }} </span>
          </Descriptions.Item>
          <Descriptions.Item
            :label="$t('trade.b2b.quotation.formPage.feeItems')"
          >
            <span> ¥{{ fenToYuan(feesTotal) }} </span>
          </Descriptions.Item>
          <Descriptions.Item label="合计">
            <span class="text-lg font-bold">
              ¥{{ fenToYuan(totalPrice) }}
            </span>
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  </Page>
</template>
