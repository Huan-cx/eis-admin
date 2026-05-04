<!-- 积分商城活动选择弹窗组件 -->
<script lang="ts" setup>
import type { VbenFormSchema } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';
import type { MallPointActivityApi } from '#/api/mall/promotion/point';

import { computed } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { $t } from '#/locales';
import { DICT_TYPE } from '@vben/constants';
import { getDictOptions } from '@vben/hooks';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getPointActivityPage } from '#/api/mall/promotion/point';

interface PointTableSelectProps {
  multiple?: boolean; // 是否单选：true - checkbox；false - radio
}

const props = withDefaults(defineProps<PointTableSelectProps>(), {
  multiple: false,
});

const emit = defineEmits<{
  change: [
    activity:
      | MallPointActivityApi.PointActivity
      | MallPointActivityApi.PointActivity[],
  ];
}>();

/** 单选：处理选中变化 */
function handleRadioChange() {
  const selectedRow =
    gridApi.grid.getRadioRecord() as MallPointActivityApi.PointActivity;
  if (selectedRow) {
    emit('change', selectedRow);
    modalApi.close();
  }
}

/** 计算已兑换数量 */
const getRedeemedQuantity = (row: MallPointActivityApi.PointActivity) =>
  (row.totalStock || 0) - (row.stock || 0);

/** 搜索表单 Schema */
const formSchema = computed<VbenFormSchema[]>(() => [
  {
    fieldName: 'status',
    label: $t('promotion.point.activity.form.status'),
    component: 'Select',
    componentProps: {
      options: getDictOptions(DICT_TYPE.COMMON_STATUS, 'number'),
      placeholder: $t('promotion.point.activity.placeholder.status'),
      clearable: true,
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
      title: $t('promotion.point.activity.grid.id'),
      minWidth: 100,
      align: 'center',
    },
    {
      field: 'picUrl',
      title: $t('promotion.point.activity.grid.picUrl'),
      width: 100,
      align: 'center',
      cellRender: {
        name: 'CellImage',
      },
    },
    {
      field: 'spuName',
      title: $t('promotion.point.activity.grid.spuName'),
      minWidth: 200,
    },
    {
      field: 'marketPrice',
      title: $t('promotion.point.activity.grid.marketPrice'),
      minWidth: 100,
      align: 'center',
      formatter: ({ cellValue }) => {
        return `${$t('promotion.point.activity.grid.currency')}${(cellValue / 100).toFixed(2)}`;
      },
    },
    {
      field: 'status',
      title: $t('promotion.point.activity.form.status'),
      minWidth: 100,
      align: 'center',
      cellRender: {
        name: 'CellDict',
        props: { type: DICT_TYPE.COMMON_STATUS },
      },
    },
    {
      field: 'stock',
      title: $t('promotion.point.activity.grid.stock'),
      minWidth: 80,
      align: 'center',
    },
    {
      field: 'totalStock',
      title: $t('promotion.point.activity.grid.totalStock'),
      minWidth: 80,
      align: 'center',
    },
    {
      field: 'redeemedQuantity',
      title: $t('promotion.point.activity.grid.redeemedQuantity'),
      minWidth: 100,
      align: 'center',
      formatter: ({ row }) => getRedeemedQuantity(row),
    },
    {
      field: 'createTime',
      title: $t('promotion.point.activity.grid.createTime'),
      width: 180,
      align: 'center',
      formatter: 'formatDateTime',
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
          return await getPointActivityPage({
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
      gridApi.grid.getCheckboxRecords() as MallPointActivityApi.PointActivity[];
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
      MallPointActivityApi.PointActivity | MallPointActivityApi.PointActivity[]
    >();
    if (props.multiple && Array.isArray(data) && data.length > 0) {
      setTimeout(() => {
        const tableData = gridApi.grid.getTableData().fullData;
        data.forEach((activity) => {
          const row = tableData.find(
            (item: MallPointActivityApi.PointActivity) =>
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
          (item: MallPointActivityApi.PointActivity) => item.id === data.id,
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
      | MallPointActivityApi.PointActivity
      | MallPointActivityApi.PointActivity[],
  ) => {
    modalApi.setData(data).open();
  },
});
</script>

<template>
  <Modal :title="$t('promotion.point.activity.selectForm.title')" class="w-[950px]">
    <Grid />
  </Modal>
</template>
