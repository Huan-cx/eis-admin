<script lang="tsx" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { B2BQuotationApi } from '#/api/mall/trade/b2b/quotation';

import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { confirm, Page } from '@vben/common-ui';
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
  Tag,
} from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  compareQuotations,
  confirmQuotationSelection,
  selectQuotationItems,
} from '#/api/mall/trade/b2b/quotation';
import { $t } from '#/locales';

import {
  useCompareFeeItemsColumns,
  useCompareSelection,
  useCompareTermsFormSchema,
} from './data';

const route = useRoute();
const router = useRouter();
const tabs = useTabs();

const rfqId = computed(() => Number(route.query.rfqId) || 0);

function handleBack() {
  tabs.closeCurrentTab();
  router.back();
}

const loading = ref(false);

const skuItems = ref<B2BQuotationApi.CompareSkuItem[]>([]);
const quotations = ref<B2BQuotationApi.CompareQuotationBase[]>([]);
const feeItemsData = ref<any[]>([]);

const [TermsForm, termsFormApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 120,
  },
  layout: 'horizontal',
  schema: useCompareTermsFormSchema(),
  showDefaultActions: false,
});

const handleSelectQuotation = (row: B2BQuotationApi.CompareSkuItem) => {
  const index = skuItems.value.findIndex((item) => item.skuId === row.skuId);
  if (index !== -1) {
    const item = skuItems.value[index];
    if (!item) return;
    // 选中报价时，初始化 sellingPrice 为 supplierPrice（如果还没有的话）
    if (
      row.selectedQuotationId &&
      item.quotationPrices[row.selectedQuotationId]
    ) {
      const priceInfo = item.quotationPrices[row.selectedQuotationId];
      if (!priceInfo) return;
      if (!priceInfo.sellingPrice) {
        priceInfo.sellingPrice = priceInfo.supplierPrice;
        priceInfo.totalPrice = priceInfo.supplierPrice * priceInfo.count;
      }
    }
    skuItems.value[index] = {
      ...item,
      selectedQuotationId: row.selectedQuotationId,
    } as B2BQuotationApi.CompareSkuItem;
  }
};

const columns = computed(() => {
  const quotationColumns = quotations.value.map((quote) => ({
    field: `quote_${quote.quotationId}`,
    title: `${quote.supplierName}`,
    width: 180,
    align: 'center' as const,
    cellRender: {
      name: 'CellQuotationPrice',
      props: {
        quotationId: quote.quotationId,
        onSelect: handleSelectQuotation,
      },
    },
  }));

  return [
    {
      field: 'goodsInfo',
      title: $t('trade.b2b.quotation.detail.spuName'),
      width: 280,
      fixed: 'left' as const,
      slots: { default: 'goodsInfo' },
    },
    ...quotationColumns,
    {
      field: 'salesPrice',
      title: $t('trade.b2b.compare.grid.salesUnitPrice'),
      width: 180,
      fixed: 'right' as const,
      slots: { default: 'salesPrice' },
    },
  ];
});

const [Grid, gridApiInstance] = useVbenVxeGrid<B2BQuotationApi.CompareSkuItem>({
  gridOptions: {
    columns: columns.value,
    height: 600,
    border: true,
    showHeaderOverflow: 'title',
    showOverflow: 'title',
    keepSource: true,
    data: [],
    rowConfig: {
      height: 100,
      keyField: 'skuId',
      isHover: true,
    },
    pagerConfig: {
      enabled: false,
    },
    toolbarConfig: {
      enabled: false,
    },
  },
});

const [FeeItemsGrid, feeItemsGridApi] = useVbenVxeGrid({
  gridOptions: {
    editConfig: {
      trigger: 'click',
      mode: 'cell',
      showStatus: true,
    },
    columns: useCompareFeeItemsColumns(),
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

const {
  selectedCount,
  totalCount,
  isAllSelected,
  selectAllCheapest,
  clearSelection,
} = useCompareSelection(skuItems);

const itemsTotal = computed(() => {
  const items = skuItems.value || [];
  let sum = 0;
  for (const item of items) {
    if (!item.selectedQuotationId || !item.quotationPrices) continue;
    const price = item.quotationPrices[item.selectedQuotationId];
    sum += price?.totalPrice || 0;
  }
  return sum;
});

const feesTotal = computed(() => {
  const feeItems = feeItemsData.value || [];
  let sum = 0;
  for (const item of feeItems) {
    sum += item.amount || 0;
  }
  return sum;
});

const totalPrice = computed(() => {
  return itemsTotal.value + feesTotal.value;
});

const loadCompareData = async () => {
  if (!rfqId.value) return;

  loading.value = true;
  try {
    const data = await compareQuotations(rfqId.value);
    skuItems.value = data.skuItems || [];
    quotations.value = data.quotations || [];

    // 如果只有一个报价，自动全选该供应商
    if (quotations.value.length === 1) {
      const singleQuotation = quotations.value[0];
      if (!singleQuotation) return;
      const singleQuotationId = singleQuotation.quotationId;
      skuItems.value.forEach((item) => {
        item.selectedQuotationId = singleQuotationId;
        // 同时初始化 sellingPrice 为 supplierPrice
        const priceInfo = item.quotationPrices?.[singleQuotationId];

        if (priceInfo) {
          // 只有当 sellingPrice 为空时才初始化，保留服务端传过来的值
          if (!priceInfo.sellingPrice) {
            priceInfo.sellingPrice = priceInfo.supplierPrice;
          }
          priceInfo.totalPrice = priceInfo.supplierPrice * priceInfo.count;
        }
      });
      message.info('检测到单个报价，已自动选中');
    }

    if (data.savedTerms) {
      await termsFormApi.setValues({
        currency: data.savedTerms.currency,
        incoterms: data.savedTerms.incoterms,
        deliveryType: data.savedTerms.deliveryType,
        deliveryPort: data.savedTerms.deliveryPort,
        validDays: data.savedTerms.validDays,
      });
      feeItemsData.value = data.savedTerms.feeItems || [];
    }

    gridApiInstance.setGridOptions({
      columns: columns.value,
      data: skuItems.value,
    });

    await nextTick();
    await feeItemsGridApi.grid?.reloadData(feeItemsData.value);
  } catch (error) {
    console.error($t('trade.b2b.quotation.actionMessage.loadFailed'), error);
    message.error($t('trade.b2b.quotation.actionMessage.loadFailed'));
  } finally {
    loading.value = false;
  }
};

function handleSellingPriceChange(row: any, value: any) {
  if (value === null || value === undefined) return;
  const sellingPrice = yuanToFen(value);
  // 找到对应 skuItem 并更新，确保响应式
  const index = skuItems.value.findIndex((item) => item.skuId === row.skuId);
  if (index !== -1) {
    const item = skuItems.value[index];
    if (!item) return;
    const priceInfo = item.quotationPrices?.[item.selectedQuotationId!];
    if (priceInfo) {
      priceInfo.sellingPrice = sellingPrice;
      priceInfo.totalPrice = sellingPrice * priceInfo.count;
      // 触发响应式更新
      skuItems.value[index] = { ...item };
    }
  }
}

function handleAddFeeItem() {
  const newRow = {
    feeType: 'FREIGHT',
    feeName: '',
    amount: 0,
    description: '',
    optional: false,
  };
  feeItemsGridApi.grid?.insertAt(newRow, -1);
  feeItemsData.value.push(newRow);
}

function handleDeleteFeeItem(row: any) {
  feeItemsGridApi.grid?.remove(row);
  const index = feeItemsData.value.findIndex((item) => item._XID === row._XID);
  if (index !== -1) {
    feeItemsData.value.splice(index, 1);
  }
}

function handleFeeAmountChange(row: any, value: any) {
  if (value === null || value === undefined) return;
  row.amount = yuanToFen(value);

  const index = feeItemsData.value.findIndex((item) => item._XID === row._XID);
  if (index !== -1) {
    feeItemsData.value[index] = { ...row };
  }

  feeItemsGridApi.setGridOptions({ data: [...feeItemsData.value] });
}

const handleSave = async () => {
  if (selectedCount.value === 0) {
    message.warning($t('trade.b2b.compare.selection.pleaseSelect'));
    return;
  }

  try {
    const formData = await termsFormApi.getValues();
    const items = skuItems.value
      .filter((item) => item.selectedQuotationId)
      .map((item) => {
        const priceInfo = item.quotationPrices?.[item.selectedQuotationId!];
        // 确保 sellingPrice 有值，如果没有则使用 supplierPrice
        const sellingPrice =
          priceInfo?.sellingPrice || priceInfo?.supplierPrice;
        return {
          skuId: item.skuId,
          quotationId: item.selectedQuotationId!,
          sellingPrice,
        };
      });

    const feeItems = feeItemsData.value.map((item) => ({
      feeType: item.feeType,
      feeName: item.feeName,
      amount: item.amount || 0,
      description: item.description,
      optional: item.optional,
    }));

    await selectQuotationItems({
      rfqId: rfqId.value,
      items,
      currency: formData.currency,
      incoterms: formData.incoterms,
      deliveryType: formData.deliveryType,
      deliveryPort: formData.deliveryPort,
      validDays: formData.validDays,
      feeItems,
    });
    message.success($t('trade.b2b.compare.selection.saveSuccess'));
  } catch (error) {
    console.error('Save selection failed:', error);
    message.error($t('common.fail'));
  }
};

const handleConfirm = async () => {
  if (!isAllSelected.value) {
    message.warning(
      $t('trade.b2b.compare.selection.pleaseSelect', [totalCount.value]),
    );
    return;
  }

  await confirm($t('trade.b2b.compare.index.confirmTip'));
  try {
    await handleSave();
    await confirmQuotationSelection(rfqId.value);
    message.success($t('trade.b2b.compare.selection.confirmSuccess'));
  } catch (error) {
    console.error('Confirm selection failed:', error);
    message.error($t('common.fail'));
  }
};

watch(
  () => feeItemsData.value,
  async (items) => {
    if (!items) return;
    await nextTick();
    await feeItemsGridApi.grid?.reloadData(items);
  },
  { deep: true },
);

onMounted(() => {
  loadCompareData();
});
</script>

<template>
  <Page class="h-full p-4" :title="$t('trade.b2b.compare.title')">
    <template #extra>
      <Space>
        <Button @click="handleBack">{{ $t('common.back') }}</Button>
        <Button @click="clearSelection">
          {{ $t('trade.b2b.compare.index.clearSelection') }}
        </Button>
        <Button @click="selectAllCheapest">
          {{ $t('trade.b2b.compare.index.selectAllCheapest') }}
        </Button>
        <Button type="primary" :loading="loading" @click="handleSave">
          {{ $t('trade.b2b.compare.index.save') }}
        </Button>
        <Button type="primary" :loading="loading" @click="handleConfirm">
          {{ $t('trade.b2b.compare.index.confirm') }}
        </Button>
      </Space>
    </template>

    <div class="space-y-6">
      <Card>
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-lg font-bold">
              {{ $t('trade.b2b.compare.title') }}
            </h2>
            <p class="mt-1 text-sm text-gray-500">
              {{ $t('trade.b2b.rfq.detail.no') }}: {{ rfqId }}
            </p>
          </div>
        </div>
      </Card>

      <Card>
        <Descriptions :column="3" bordered size="small">
          <Descriptions.Item :label="$t('trade.b2b.compare.index.selected')">
            <Tag :color="isAllSelected ? 'green' : 'orange'">
              {{ selectedCount }} / {{ totalCount }}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item :label="$t('trade.b2b.compare.grid.supplier')">
            <Tag color="blue">{{ quotations.length }}</Tag>
          </Descriptions.Item>
          <Descriptions.Item :label="$t('trade.b2b.quotation.status.pending')">
            <Tag :color="isAllSelected ? 'green' : 'default'">
              {{
                isAllSelected
                  ? $t('trade.b2b.compare.selection.allSelected')
                  : $t('trade.b2b.quotation.status.pendingReview')
              }}
            </Tag>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card :title="$t('trade.b2b.compare.terms.title')">
        <TermsForm />
      </Card>

      <Card>
        <template #title>
          <span class="font-medium">{{
            $t('trade.b2b.compare.index.title')
          }}</span>
          <span class="ml-2 text-xs text-gray-500">{{
            $t('trade.b2b.compare.index.subtitle')
          }}</span>
        </template>

        <Grid :loading="loading">
          <template #goodsInfo="{ row }">
            <div class="flex items-center gap-3">
              <img
                :src="row.picUrl"
                :alt="row.spuName"
                class="h-12 w-12 rounded border object-cover"
              />
              <div class="min-w-0 flex-1">
                <div class="truncate text-sm font-medium">
                  {{ row.spuName }}
                </div>
                <div class="truncate text-xs text-gray-500">
                  {{ row.skuName }}
                </div>
                <div class="mt-1 text-xs text-gray-400">
                  {{ $t('trade.b2b.quotation.detail.count') }}:
                  {{ row.inquiryCount }}
                </div>
              </div>
            </div>
          </template>
          <template #salesPrice="{ row }">
            <div v-if="row.selectedQuotationId && row.quotationPrices">
              <div class="mb-1 text-xs text-gray-500">
                {{ $t('trade.b2b.compare.grid.supplierPrice') }}: ¥{{
                  fenToYuan(
                    row.quotationPrices?.[row.selectedQuotationId]
                      ?.supplierPrice || 0,
                  )
                }}
              </div>
              <InputNumber
                :value="
                  fenToYuan(
                    row.quotationPrices?.[row.selectedQuotationId]
                      ?.sellingPrice || 0,
                  )
                "
                :min="0"
                :precision="2"
                :step="0.01"
                class="w-full"
                @change="(val) => handleSellingPriceChange(row, val)"
              />
            </div>
            <div v-else class="text-xs text-gray-400">
              {{ $t('trade.b2b.compare.grid.selectSupplierFirst') }}
            </div>
          </template>
        </Grid>
      </Card>

      <Card :title="$t('trade.b2b.compare.feeItems.title')">
        <template #extra>
          <Button type="primary" size="small" @click="handleAddFeeItem">
            {{ $t('common.add') }}
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
              @change="(val) => handleFeeAmountChange(row, val)"
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
