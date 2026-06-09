<script lang="ts" setup>
import type { B2BQuotationApi } from '#/api/mall/trade/b2b/quotation';

import { computed, nextTick, ref, watch } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { createQuotation } from '#/api/mall/trade/b2b/quotation';
import { getRfq } from '#/api/mall/trade/b2b/rfq';
import { $t } from '#/locales';

import {
  useCreateQuotationFormSchema,
  useCreateQuotationItemsColumns,
} from '../data';

const emit = defineEmits<{
  success: [];
}>();

const [Form, formApi] = useVbenForm({
  schema: useCreateQuotationFormSchema(),
  showDefaultActions: false,
});

const [Modal, modalApi] = useVbenModal({
  title: $t('trade.b2b.quotation.createForm.title'),
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) {
      return;
    }
    modalApi.lock();
    try {
      const data = await formApi.getValues();
      await createQuotation(data as B2BQuotationApi.CreateQuotationReqVO);
      emit('success');
      await modalApi.close();
    } finally {
      modalApi.unlock();
    }
  },
  async onOpenChange(isOpen: boolean) {
    if (!isOpen) {
      return;
    }
    const data = modalApi.getData<{ rfqId?: number }>();
    if (data?.rfqId) {
      const rfqDetail = await getRfq(data.rfqId);
      const items = rfqDetail.items.map((item) => ({
        skuId: item.skuId,
        spuId: item.productId,
        spuName: item.productName,
        skuName: item.skuName,
        picUrl: item.imageUrl,
        count: item.count,
        unitPrice: 0,
      }));
      tableData.value = items;
      await formApi.setValues({
        rfqId: data.rfqId,
        supplierId: rfqDetail.supplierId || 0,
        supplierName: rfqDetail.supplierName || '',
        items,
      });
    } else {
      tableData.value = [];
      await formApi.resetForm();
    }
  },
});

const tableData = ref<any[]>([]);

const formData = computed(
  () => formApi.form.values as B2BQuotationApi.CreateQuotationReqVO,
);

const totalPrice = computed(() => {
  const items = tableData.value || [];
  return items.reduce(
    (sum, item) => sum + (item.unitPrice || 0) * (item.count || 0),
    0,
  );
});

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: useCreateQuotationItemsColumns(),
    data: tableData.value,
    minHeight: 200,
    autoResize: true,
    border: false,
    rowConfig: {
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

watch(
  () => tableData.value,
  async (items) => {
    await nextTick();
    if (gridApi.grid) {
      await gridApi.grid.reloadData(items);
    }
    await formApi.setValues({ items });
  },
);

function handleUnitPriceChange(row: any, value: number) {
  row.unitPrice = value;
  const items = [...tableData.value];
  tableData.value = items;
}

function handleSubtotal(row: any) {
  const unitPrice = row?.unitPrice ?? 0;
  const count = row?.count ?? 0;
  return `${(unitPrice * count).toFixed(2)} ${formData.value?.currency}`;
}

function open(data?: { rfqId?: number }) {
  modalApi.setData(data).open();
}

defineExpose({
  open,
});
</script>

<template>
  <Modal v-bind="$attrs">
    <Form />

    <div v-if="tableData.length > 0" class="mt-6">
      <h4 class="mb-4 font-semibold">
        {{ $t('trade.b2b.quotation.createForm.items') }}
      </h4>
      <Grid>
        <template #unitPrice="{ row }">
          <a-input-number
            class="w-full"
            :min="0"
            :precision="2"
            :step="0.01"
            v-model:value="row.unitPrice"
            @change="handleUnitPriceChange(row, $event)"
          />
        </template>
        <template #subtotal="{ row }">
          {{ handleSubtotal(row) }}
        </template>
      </Grid>
    </div>

    <div v-if="tableData.length > 0" class="mt-4 text-right">
      <span class="text-gray-500">
        {{ $t('trade.b2b.quotation.detail.totalPrice') }}:
      </span>
      <span class="text-xl font-bold text-primary">
        {{ totalPrice.toFixed(2) }} {{ formData.currency }}
      </span>
    </div>
  </Modal>
</template>
