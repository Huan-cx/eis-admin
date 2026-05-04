<!-- 秒杀活动选择弹窗组件 -->
<script lang="ts" setup>
import type { VbenFormSchema } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';
import type { MallCategoryApi } from '#/api/mall/product/category';
import type { MallSeckillActivityApi } from '#/api/mall/promotion/seckill/seckillActivity';

import { computed, onMounted, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { DICT_TYPE } from '@vben/constants';
import { getDictOptions } from '@vben/hooks';
import { fenToYuan, formatDate, handleTree } from '@vben/utils';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getCategoryList } from '#/api/mall/product/category';
import { getSeckillActivityPage } from '#/api/mall/promotion/seckill/seckillActivity';

interface SeckillTableSelectProps {
  multiple?: boolean; // 是否多选：true - checkbox；false - radio
}

const props = withDefaults(defineProps<SeckillTableSelectProps>(), {
  multiple: false,
});

const emit = defineEmits<{
  change: [
    activity:
      | MallSeckillActivityApi.SeckillActivity
      | MallSeckillActivityApi.SeckillActivity[],
  ];
}>();

const categoryList = ref<MallCategoryApi.Category[]>([]); // 分类列表
const categoryTreeList = ref<any[]>([]); // 分类树

/** 单选：处理选中变化 */
function handleRadioChange() {
  const selectedRow =
    gridApi.grid.getRadioRecord() as MallSeckillActivityApi.SeckillActivity;
  if (selectedRow) {
    emit('change', selectedRow);
    modalApi.close();
  }
}

/**
 * 格式化秒杀价格
 * @param products
 */
const formatSeckillPrice = (
  products: MallSeckillActivityApi.SeckillProduct[],
) => {
  if (!products || products.length === 0) return '-';
  const seckillPrice = Math.min(
    ...products.map((item) => item.seckillPrice || 0),
  );
  return `￥${fenToYuan(seckillPrice)}`;
};

/** 搜索表单 Schema */
const formSchema = computed<VbenFormSchema[]>(() => [
  {
    fieldName: 'name',
    label: $t('promotion.seckill.activity.form.name'),
    component: 'Input',
    componentProps: {
      placeholder: $t('promotion.seckill.activity.placeholder.name'),
      clearable: true,
    },
  },
  {
    fieldName: 'status',
    label: $t('promotion.seckill.activity.form.status'),
    component: 'Select',
    componentProps: {
      placeholder: $t('promotion.seckill.activity.placeholder.status'),
      clearable: true,
      options: getDictOptions(DICT_TYPE.COMMON_STATUS, 'number'),
    },
  },
]);

/** 表格列配置 */
const gridColumns = computed<VxeGridProps['columns']>(() => {
  const columns: VxeGridProps['columns'] = [];
  if (props.multiple) {
    columns.push({ type: 'checkbox', width: 55 });
  } else {
    columns.push({ type: 'radio', width: 55 });
  }
  columns.push(
    {
      field: 'id',
      title: $t('promotion.seckill.activity.grid.id'),
      minWidth: 80,
      align: 'center',
    },
    {
      field: 'name',
      title: $t('promotion.seckill.activity.form.name'),
      minWidth: 140,
    },
    {
      field: 'activityTime',
      title: $t('promotion.seckill.activity.grid.activityTime'),
      minWidth: 210,
      formatter: ({ row }) => {
        return `${formatDate(row.startTime, 'YYYY-MM-DD')} ~ ${formatDate(row.endTime, 'YYYY-MM-DD')}`;
      },
    },
    {
      field: 'picUrl',
      title: $t('promotion.seckill.activity.grid.picUrl'),
      width: 100,
      align: 'center',
      cellRender: {
        name: 'CellImage',
      },
    },
    {
      field: 'spuName',
      title: $t('promotion.seckill.activity.grid.spuName'),
      minWidth: 300,
    },
    {
      field: 'marketPrice',
      title: $t('promotion.seckill.activity.grid.marketPrice'),
      minWidth: 100,
      align: 'center',
      formatter: ({ cellValue }) => {
        return cellValue ? `￥${fenToYuan(cellValue)}` : '-';
      },
    },
    {
      field: 'products',
      title: $t('promotion.seckill.activity.grid.seckillPrice'),
      minWidth: 100,
      align: 'center',
      formatter: ({ cellValue }) => {
        return formatSeckillPrice(cellValue);
      },
    },
    {
      field: 'status',
      title: $t('promotion.seckill.activity.form.status'),
      minWidth: 100,
      align: 'center',
      cellRender: {
        name: 'CellDict',
        props: { type: DICT_TYPE.COMMON_STATUS },
      },
    },
    {
      field: 'createTime',
      title: $t('promotion.seckill.activity.grid.createTime'),
      width: 180,
      align: 'center',
      cellRender: {
        name: 'CellDatetime',
      },
    },
  );
  return columns;
});

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    schema: formSchema.value,
    layout: 'horizontal',
    collapsed: false,
  },
  gridOptions: {
    columns: gridColumns.value,
    height: 500,
    border: true,
    checkboxConfig: {
      reserve: true,
    },
    radioConfig: {
      reserve: true,
    },
    rowConfig: {
      keyField: 'id',
      isHover: true,
    },
    proxyConfig: {
      ajax: {
        async query({ page }: any, formValues: any) {
          return await getSeckillActivityPage({
            pageNo: page.currentPage,
            pageSize: page.pageSize,
            ...formValues,
          });
        },
      },
    },
  },
  gridEvents: {
    radioChange: handleRadioChange,
  },
});

const [Modal, modalApi] = useVbenModal({
  destroyOnClose: true,
  showConfirmButton: props.multiple, // 特殊：radio 单选情况下，走 handleRadioChange 处理。
  onConfirm: () => {
    const selectedRows =
      gridApi.grid.getCheckboxRecords() as MallSeckillActivityApi.SeckillActivity[];
    emit('change', selectedRows);
    modalApi.close();
  },
  async onOpenChange(isOpen: boolean) {
    if (!isOpen) {
      await gridApi.grid.clearCheckboxRow();
      await gridApi.grid.clearRadioRow();
      return;
    }

    // 1. 先查询数据
    await gridApi.query();
    // 2. 设置已选中行
    const data = modalApi.getData<
      | MallSeckillActivityApi.SeckillActivity
      | MallSeckillActivityApi.SeckillActivity[]
    >();
    if (props.multiple && Array.isArray(data) && data.length > 0) {
      setTimeout(() => {
        const tableData = gridApi.grid.getTableData().fullData;
        data.forEach((activity) => {
          const row = tableData.find(
            (item: MallSeckillActivityApi.SeckillActivity) =>
              item.id === activity.id,
          );
          if (row) {
            gridApi.grid.setCheckboxRow(row, true);
          }
        });
      }, 300);
    } else if (!props.multiple && data && !Array.isArray(data)) {
      setTimeout(() => {
        const tableData = gridApi.grid.getTableData().fullData;
        const row = tableData.find(
          (item: MallSeckillActivityApi.SeckillActivity) => item.id === data.id,
        );
        if (row) {
          gridApi.grid.setRadioRow(row);
        }
      }, 300);
    }
  },
});

/** 对外暴露的方法 */
defineExpose({
  open: (
    data?:
      | MallSeckillActivityApi.SeckillActivity
      | MallSeckillActivityApi.SeckillActivity[],
  ) => {
    modalApi.setData(data).open();
  },
});

/** 初始化分类数据 */
onMounted(async () => {
  categoryList.value = await getCategoryList({});
  categoryTreeList.value = handleTree(categoryList.value, 'id', 'parentId');
});
</script>

<template>
  <Modal :title="$t('promotion.seckill.activity.selectForm.title')" class="w-[950px]">
    <Grid />
  </Modal>
</template>
