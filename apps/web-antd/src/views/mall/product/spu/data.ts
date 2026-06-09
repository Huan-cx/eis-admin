import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { MallSpuApi } from '#/api/mall/product/spu';

import { fenToYuan, handleTree, treeToString } from '@vben/utils';

import { getCategoryList } from '#/api/mall/product/category';
import { $t } from '#/locales';
import { getRangePickerDefaultProps } from '#/utils';

/** 关联数据 */
let categoryList: any[] = [];
getCategoryList({}).then((data) => {
  categoryList = handleTree(data, 'id', 'parentId', 'children');
});

/** 列表的搜索表单 */
export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'name',
      label: $t('mall-product.spu.name'),
      component: 'Input',
      componentProps: {
        placeholder: $t('mall-product.spu.placeholder.name'),
        allowClear: true,
      },
    },
    {
      fieldName: 'categoryId',
      label: $t('mall-product.spu.category'),
      component: 'ApiTreeSelect',
      componentProps: {
        placeholder: $t('mall-product.spu.placeholder.category'),
        allowClear: true,
        options: categoryList,
        fieldNames: { label: 'name', value: 'id', children: 'children' },
      },
    },
    {
      fieldName: 'createTime',
      label: $t('common.createTime'),
      component: 'RangePicker',
      componentProps: {
        ...getRangePickerDefaultProps(),
        allowClear: true,
      },
    },
  ];
}

/** 列表的字段 */
export function useGridColumns(
  onStatusChange?: (
    newStatus: number,
    row: MallSpuApi.Spu,
  ) => PromiseLike<boolean | undefined>,
): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'id',
      title: $t('mall-product.spu.id'),
      fixed: 'left',
      minWidth: 100,
    },
    {
      field: 'name',
      title: $t('mall-product.spu.name'),
      fixed: 'left',
      minWidth: 200,
    },
    {
      field: 'picUrl',
      title: $t('mall-product.spu.picUrl'),
      minWidth: 100,
      cellRender: {
        name: 'CellImage',
      },
    },
    {
      field: 'categoryId',
      title: $t('mall-product.spu.category'),
      minWidth: 150,
      formatter: ({ row }) => {
        return treeToString(categoryList, row.categoryId);
      },
    },
    {
      field: 'status',
      title: $t('mall-product.spu.status'),
      minWidth: 100,
      cellRender: {
        attrs: { beforeChange: onStatusChange },
        name: 'CellSwitch',
        props: {
          checkedValue: 1,
          checkedChildren: $t('mall-product.spu.statusOptions.onSale'),
          unCheckedValue: 0,
          unCheckedChildren: $t('mall-product.spu.statusOptions.offSale'),
        },
      },
    },
    {
      field: 'price',
      title: $t('mall-product.spu.price'),
      minWidth: 100,
      formatter: 'formatAmount2',
    },
    {
      field: 'marketPrice',
      title: $t('mall-product.spu.marketPrice'),
      minWidth: 100,
      formatter: ({ row }) => {
        return `${fenToYuan(row.marketPrice)} 元`;
      },
    },
    {
      field: 'costPrice',
      title: $t('mall-product.spu.costPrice'),
      minWidth: 100,
      formatter: ({ row }) => {
        return `${fenToYuan(row.costPrice)} 元`;
      },
    },
    {
      field: 'salesCount',
      title: $t('mall-product.spu.salesCount'),
      minWidth: 80,
    },
    {
      field: 'virtualSalesCount',
      title: $t('mall-product.spu.virtualSalesCount'),
      minWidth: 100,
    },
    {
      field: 'stock',
      title: $t('mall-product.spu.stock'),
      minWidth: 80,
    },
    {
      field: 'minQty',
      title: $t('mall-product.spu.minQty'),
      minWidth: 100,
    },
    {
      field: 'unit',
      title: $t('mall-product.spu.unit'),
      minWidth: 80,
    },
    {
      field: 'browseCount',
      title: $t('mall-product.spu.browseCount'),
      minWidth: 100,
    },
    {
      field: 'sort',
      title: $t('mall-product.spu.sort'),
      minWidth: 80,
    },
    {
      field: 'createTime',
      title: $t('mall-product.spu.createTime'),
      minWidth: 160,
      formatter: 'formatDateTime',
    },
    {
      title: $t('common.actions'),
      width: 300,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}
